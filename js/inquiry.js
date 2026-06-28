/**
 * Wishlist Cart Inquiry Controller
 * Renders selected products on inquiry.html and initiates redirection to WhatsApp API.
 */
import { products } from './products.js';
import { getCart, removeFromCart, clearCart } from './cart.js';

export function initInquiryPage() {
    const listContainer = document.getElementById('bag-items-list');
    const emptyState = document.getElementById('bag-empty-state');
    const clearBtn = document.getElementById('clear-bag-btn');
    const form = document.getElementById('whatsapp-inquiry-form');
    
    if (!listContainer) return;

    // Render loop
    function renderBag() {
        const cartIds = getCart();
        
        if (cartIds.length === 0) {
            listContainer.innerHTML = '';
            listContainer.classList.add('hidden');
            if (clearBtn) clearBtn.style.display = 'none';
            if (emptyState) emptyState.classList.remove('hidden');
            
            // Disable submit buttons
            const submitBtn = document.getElementById('send-wa-btn');
            if (submitBtn) submitBtn.disabled = true;
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        if (clearBtn) clearBtn.style.display = 'inline-flex';
        listContainer.classList.remove('hidden');

        const submitBtn = document.getElementById('send-wa-btn');
        if (submitBtn) submitBtn.disabled = false;

        listContainer.innerHTML = '';

        cartIds.forEach(id => {
            const product = products.find(p => p.id === id);
            if (!product) return;

            const row = document.createElement('div');
            row.className = 'bag-item-row reveal-up';
            row.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="bag-item-img">
                <div class="bag-item-details">
                    <span class="bag-item-category">${product.category}</span>
                    <h4>${product.name}</h4>
                    <span class="bag-item-sizes">Sizes: ${product.sizes.join(', ')}</span>
                </div>
                <button class="bag-item-remove" data-id="${product.id}" aria-label="Remove item">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;

            row.querySelector('.bag-item-remove').addEventListener('click', (e) => {
                e.preventDefault();
                removeFromCart(product.id);
            });

            listContainer.appendChild(row);
        });
    }

    // Bind custom cart updates
    window.addEventListener('bfCartUpdated', renderBag);

    // Clear Cart action
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearCart();
        });
    }

    // Form submission for WhatsApp redirect
    if (form) {
        const nameInput = document.getElementById('inq-name');
        const cityInput = document.getElementById('inq-city');
        const messageInput = document.getElementById('inq-message');

        const nameError = document.getElementById('inq-name-error');
        const cityError = document.getElementById('inq-city-error');

        function validateField(input, errorElement, condition) {
            if (!input) return true;
            const group = input.closest('.form-group');
            if (condition) {
                group.classList.remove('invalid');
                return true;
            } else {
                group.classList.add('invalid');
                return false;
            }
        }

        if (nameInput) {
            nameInput.addEventListener('input', () => {
                validateField(nameInput, nameError, nameInput.value.trim().length > 0);
            });
        }

        if (cityInput) {
            cityInput.addEventListener('input', () => {
                validateField(cityInput, cityError, cityInput.value.trim().length > 0);
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 0);
            const isCityValid = validateField(cityInput, cityError, cityInput.value.trim().length > 0);

            if (isNameValid && isCityValid) {
                const cartIds = getCart();
                if (cartIds.length === 0) return;

                // Compile formatted text payload for WhatsApp link
                const selectedProducts = cartIds.map((id, index) => {
                    const prod = products.find(p => p.id === id);
                    return prod ? `${index + 1}. ${prod.name} (Sizes: ${prod.sizes.join(', ')})` : '';
                }).filter(val => val !== '').join('\n');

                const name = nameInput.value.trim();
                const city = cityInput.value.trim();
                const note = messageInput ? messageInput.value.trim() : '';

                // Formatted message payload (strictly premium, no emojis)
                let messageBody = `*Bharuch Food Products - Catalog Inquiry*\n`;
                messageBody += `----------------------------------\n`;
                messageBody += `*Name*: ${name}\n`;
                messageBody += `*City/Location*: ${city}\n\n`;
                messageBody += `*Curated Selection*:\n${selectedProducts}\n\n`;
                
                if (note) {
                    messageBody += `*Additional Note*:\n${note}\n\n`;
                }
                
                messageBody += `----------------------------------\n`;
                messageBody += `Sent from Bharuch Food Website`;

                const phone = '919824192786'; // Target business number
                const encodedMsg = encodeURIComponent(messageBody);
                const waLink = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;

                // Redirect to WhatsApp
                window.open(waLink, '_blank');
            }
        });

        // Prefill message if passed in url parameters
        prefillInquiryFromURL(messageInput);
    }

    // Initialize first render
    renderBag();
}

function prefillInquiryFromURL(messageInput) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        if (message && messageInput) {
            messageInput.value = message;
        }
    } catch (e) {
        console.error("Prefill check failed", e);
    }
}
