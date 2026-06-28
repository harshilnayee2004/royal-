/**
 * Product Details Modal Controller (Multi-Page Version)
 * Manages modal display and handles redirecting to the contact page with pre-filled URL query parameters.
 */
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
    const inquireBtn = document.getElementById('modal-inquire-btn');

    if (!modal) return;

    function openModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Set content
        modalImg.src = product.image;
        modalImg.alt = product.name;
        modalTitle.textContent = product.name;
        modalCategory.textContent = product.category;
        modalDesc.textContent = product.description;
        modalIngredients.textContent = product.ingredients;
        modalStorage.textContent = product.storage;
        
        // Add sizes tags
        modalSizes.innerHTML = '';
        product.sizes.forEach(size => {
            const span = document.createElement('span');
            span.className = 'size-tag';
            span.textContent = size;
            modalSizes.appendChild(span);
        });

        // Click handler: Redirect to contact.html with pre-fill URL parameters
        inquireBtn.onclick = (e) => {
            e.preventDefault();
            const categoryParam = product.category;
            const messageParam = `Hello, I am interested in inquiring about the pricing and bulk order availability of "${product.name}". Please share details.`;
            
            window.location.href = `contact.html?category=${categoryParam}&message=${encodeURIComponent(messageParam)}`;
        };

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
