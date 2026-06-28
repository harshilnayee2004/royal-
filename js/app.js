/**
 * Main Application Entrance (App-Style Redesign Version)
 * Coordinates the bottom navigation bar active states, localStorage cart counts,
 * high-density vertical 2-column catalog rendering, and WhatsApp checkout handlers.
 */
import { products } from './products.js';
import { initCarousel } from './carousel.js';
import { initModal } from './modal.js';
import { initContactForm } from './contact.js';
import { initAnimations } from './animations.js';
import { initInquiryPage } from './inquiry.js';
import { isInCart, addToCart, removeFromCart, updateCartBadges } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global Animations
    initAnimations();

    // 2. Global Wishlist Badge Sync
    updateCartBadges();

    // 3. Page-specific routing logic
    if (document.getElementById('home-hero')) {
        // --- HOME LOOKBOOK PAGE ---
        initCarousel();
    } 
    
    if (document.getElementById('product-grid')) {
        // --- PRODUCTS APP CATALOG PAGE ---
        const modalController = initModal(products);
        initAppCatalog(modalController);
    } 
    
    if (document.getElementById('whatsapp-inquiry-form') || document.getElementById('inquiry-form')) {
        // --- INQUIRY checkout PAGE or old Contact form ---
        initContactForm();
        initInquiryPage();
    }

    // Highlight app navigation links
    highlightAppNavbar();
});

/* ==========================================================================
   App-Style Bottom Navbar Highlight Logic
   ========================================================================== */
function highlightAppNavbar() {
    const navLinks = document.querySelectorAll('.app-nav-link');
    const path = window.location.pathname;
    const page = path.split("/").pop();

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (page === '' || page === 'index.html') {
            if (href === 'index.html') link.classList.add('active');
        } else {
            if (href === page) link.classList.add('active');
        }
    });
}

/* ==========================================================================
   App-Style Product Catalog (Vertical 2-Column Grid)
   ========================================================================== */
function initAppCatalog(modalController) {
    const grid = document.getElementById('product-grid');
    const searchInput = document.getElementById('product-search');
    const tabs = document.querySelectorAll('.filter-tab');
    const emptyState = document.getElementById('no-products-found');

    if (!grid) return;

    let activeFilter = 'all';
    let searchQuery = '';
    let debounceTimer = null;

    // Detect pre-filtered category parameter in URL (e.g. products.html?category=peanuts)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryQuery = urlParams.get('category');
    if (categoryQuery) {
        const targetTab = Array.from(tabs).find(tab => tab.getAttribute('data-filter') === categoryQuery);
        if (targetTab) {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            targetTab.classList.add('active');
            targetTab.setAttribute('aria-selected', 'true');
            activeFilter = categoryQuery;
        }
    }

    // Search input event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.toLowerCase().trim();
                renderCatalog();
            }, 250);
        });
    }

    // Tabs filter triggers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            activeFilter = tab.getAttribute('data-filter');
            renderCatalog();
        });
    });

    function createProductCard(p) {
        const added = isInCart(p.id);
        const card = document.createElement('article');
        card.className = 'product-card reveal-up';
        card.innerHTML = `
            <div class="product-img-box-compact">
                <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="product-badge-overlay-compact">${p.category}</div>
                <button class="floating-add-btn ${added ? 'added' : ''}" data-id="${p.id}" aria-label="Toggle wishlist item">
                    <i class="${added ? 'fa-solid fa-check' : 'fa-solid fa-plus'}"></i>
                </button>
            </div>
            <div class="product-info-compact">
                <h3>${p.name}</h3>
            </div>
        `;

        // Wishlist add click
        const addBtn = card.querySelector('.floating-add-btn');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening modal
            toggleBagItem(p.id, addBtn);
        });

        // Open detail modal on card click
        card.addEventListener('click', () => {
            if (modalController) modalController.open(p.id);
        });

        return card;
    }

    function renderCatalog() {
        const filtered = products.filter(p => {
            const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) ||
                                  p.description.toLowerCase().includes(searchQuery) ||
                                  p.category.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        } else {
            grid.classList.remove('hidden');
            if (emptyState) emptyState.classList.add('hidden');
        }

        grid.innerHTML = '';
        filtered.forEach(p => {
            grid.appendChild(createProductCard(p));
        });
    }

    function toggleBagItem(productId, btn) {
        const icon = btn.querySelector('i');
        if (isInCart(productId)) {
            removeFromCart(productId);
            btn.classList.remove('added');
            if (icon) {
                icon.className = 'fa-solid fa-plus';
            }
        } else {
            addToCart(productId);
            btn.classList.add('added');
            if (icon) {
                icon.className = 'fa-solid fa-check';
            }
            
            // Add a small scale feedback animation
            btn.style.transform = 'scale(0.85)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        }
    }

    // Hide skeletons and load catalog
    setTimeout(() => {
        renderCatalog();
    }, 500);
}
