/**
 * Product Details Modal Controller (Multi-Page Version)
 * Manages modal display, respects active mode (Retail vs Bulk), handles single-item quick WhatsApp ordering,
 * and handles adding items to the bulk list.
 */
import { getMode } from './mode.js';
import { buildWhatsAppLink, quickOrderMessage } from './whatsapp.js';
import { addBulkItem, isItemInBulk, getBulkItemQty } from './bulkcart.js';

export function initModal(products) {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-product-img');
    const modalTitle = document.getElementById('modal-product-title');
    const modalCategory = document.getElementById('modal-product-category');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalIngredients = document.getElementById('modal-product-ingredients');
    const modalSizes = document.getElementById('modal-product-sizes');
    const modalStorage = document.getElementById('modal-product-storage');

    if (!modal) return null;

    function openModal(productId, focusQuickOrder = false) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Set content
        modalImg.src = product.image;
        modalImg.alt = product.name;
        modalTitle.textContent = product.name;
        modalDesc.textContent = product.description;
        modalIngredients.textContent = product.ingredients;
        modalStorage.textContent = product.storage;
        
        // Update category badge with category-specific icon
        modalCategory.innerHTML = `<img src="assets/illustrations/${product.category}-icon.png" alt="" class="modal-category-icon"> <span>${product.category}</span>`;
        
        // Add sizes tags & track active selection
        let selectedSize = product.sizes[0] || '';
        modalSizes.innerHTML = '';
        product.sizes.forEach((size, idx) => {
            const span = document.createElement('span');
            span.className = `size-tag ${idx === 0 ? 'active' : ''}`;
            span.textContent = size;
            span.onclick = () => {
                modalSizes.querySelectorAll('.size-tag').forEach(tag => tag.classList.remove('active'));
                span.classList.add('active');
                selectedSize = size;
            };
            modalSizes.appendChild(span);
        });

        // Set up action area based on current mode
        const actionsContainer = document.getElementById('modal-actions-container');
        if (actionsContainer) {
            actionsContainer.innerHTML = '';
            const mode = getMode();

            if (mode === 'retail') {
                // Retail Mode Action Area
                const inquireLink = document.createElement('a');
                inquireLink.href = 'contact.html';
                inquireLink.id = 'modal-inquire-btn';
                inquireLink.className = 'btn btn-outline-dark ripple';
                inquireLink.textContent = 'Quick Inquiry';
                inquireLink.onclick = (e) => {
                    e.preventDefault();
                    const categoryParam = product.category;
                    const messageParam = `Hello, I am interested in inquiring about "${product.name}". Please share details.`;
                    window.location.href = `contact.html?category=${categoryParam}&message=${encodeURIComponent(messageParam)}`;
                };

                const orderBtn = document.createElement('button');
                orderBtn.id = 'modal-order-wa-btn';
                orderBtn.className = 'btn btn-primary ripple btn-order-wa';
                orderBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Order Now';
                orderBtn.onclick = () => {
                    const msg = quickOrderMessage(product, selectedSize);
                    window.open(buildWhatsAppLink(msg), '_blank');
                };

                actionsContainer.appendChild(inquireLink);
                actionsContainer.appendChild(orderBtn);

                // Focus the Order Now button if clicked from the quick buy action
                if (focusQuickOrder) {
                    setTimeout(() => {
                        orderBtn.focus();
                    }, 50);
                }
            } else {
                // Bulk Mode Action Area (Quantity Stepper + Add to Bulk List)
                const stepperWrapper = document.createElement('div');
                stepperWrapper.className = 'modal-bulk-actions';

                const stepperContainer = document.createElement('div');
                stepperContainer.className = 'bulk-stepper-container';

                const decBtn = document.createElement('button');
                decBtn.className = 'stepper-qty-btn';
                decBtn.textContent = '−';

                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'stepper-qty-input';
                input.min = '1';
                input.step = '1';
                
                // Sensible default MOQs: Peanuts/Chana = 5kg, Chikki = 10kg
                let defaultQty = product.category === 'chikki' ? 10 : 5;
                if (isItemInBulk(product.id)) {
                    defaultQty = getBulkItemQty(product.id);
                }
                input.value = defaultQty;

                const unit = document.createElement('span');
                unit.className = 'stepper-qty-unit';
                unit.textContent = 'kg';

                const incBtn = document.createElement('button');
                incBtn.className = 'stepper-qty-btn';
                incBtn.textContent = '+';

                stepperContainer.appendChild(decBtn);
                stepperContainer.appendChild(input);
                stepperContainer.appendChild(unit);
                stepperContainer.appendChild(incBtn);

                decBtn.onclick = () => {
                    let val = parseInt(input.value) || 1;
                    if (val > 1) {
                        input.value = val - 1;
                    }
                };
                incBtn.onclick = () => {
                    let val = parseInt(input.value) || 1;
                    input.value = val + 1;
                };
                input.onchange = () => {
                    let val = parseInt(input.value) || 1;
                    if (val < 1) val = 1;
                    input.value = val;
                };

                const addBtn = document.createElement('button');
                addBtn.id = 'modal-add-bulk-btn';
                const isInBulk = isItemInBulk(product.id);
                addBtn.className = `bulk-add-btn ${isInBulk ? 'added' : ''}`;
                addBtn.textContent = isInBulk ? '✓ In Bulk List' : 'Add to Bulk List';

                addBtn.onclick = () => {
                    const qty = parseInt(input.value) || 1;
                    addBulkItem(product.id, product.name, qty);
                    addBtn.classList.add('added');
                    addBtn.textContent = '✓ In Bulk List';

                    // Simple scale animation
                    addBtn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        addBtn.style.transform = '';
                    }, 150);
                };

                stepperWrapper.appendChild(stepperContainer);
                stepperWrapper.appendChild(addBtn);
                actionsContainer.appendChild(stepperWrapper);
            }
        }

        // Open modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Lock page scrolling
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    // Event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    return {
        open: openModal,
        close: closeModal
    };
}
