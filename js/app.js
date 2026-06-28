/**
 * Main Application Entrance (App-Style Redesign Version)
 * Coordinates the bottom navigation bar active states, localStorage cart counts,
 * high-density vertical 2-column catalog rendering, WhatsApp checkout handlers,
 * and Retail/Bulk mode state integration.
 */
import { products } from './products.js';
import { initCarousel } from './carousel.js';
import { initModal } from './modal.js';
import { initContactForm } from './contact.js';
import { initAnimations } from './animations.js';
import { initInquiryPage } from './inquiry.js';
import { isInCart, addToCart, removeFromCart, updateCartBadges } from './cart.js';
import { getMode, setMode, subscribeToModeChange } from './mode.js';
import { getBulkItems, addBulkItem, removeBulkItem, isItemInBulk, getBulkItemQty } from './bulkcart.js';
import { buildWhatsAppLink, bulkInquiryMessage } from './whatsapp.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global Animations
    initAnimations();

    // 2. Global Wishlist Badge Sync
    updateCartBadges();

    // 3. Page-specific routing logic
    if (document.getElementById('home-hero')) {
        // --- HOME LOOKBOOK PAGE ---
        initCarousel();
        initHomeBestsellers();
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
    const retailBtn = document.getElementById('mode-retail-btn');
    const bulkBtn = document.getElementById('mode-bulk-btn');
    const sendBulkWaBtn = document.getElementById('send-bulk-wa-btn');

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

    // Initialize mode toggles
    if (retailBtn && bulkBtn) {
        retailBtn.addEventListener('click', () => setMode('retail'));
        bulkBtn.addEventListener('click', () => setMode('bulk'));
    }

    // Subscribe to mode changes
    subscribeToModeChange((newMode) => {
        // Update toggle styles
        if (retailBtn && bulkBtn) {
            if (newMode === 'retail') {
                retailBtn.classList.add('active');
                retailBtn.setAttribute('aria-selected', 'true');
                bulkBtn.classList.remove('active');
                bulkBtn.setAttribute('aria-selected', 'false');
            } else {
                bulkBtn.classList.add('active');
                bulkBtn.setAttribute('aria-selected', 'true');
                retailBtn.classList.remove('active');
                retailBtn.setAttribute('aria-selected', 'false');
            }
        }

        renderCatalog();
        updateBulkSummaryBar();
    });

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

    // Handle bulk checkout
    if (sendBulkWaBtn) {
        sendBulkWaBtn.addEventListener('click', () => {
            const items = getBulkItems();
            if (items.length === 0) {
                alert("Your bulk list is empty. Add items to request wholesale prices.");
                return;
            }
            const msg = bulkInquiryMessage(items);
            window.open(buildWhatsAppLink(msg), '_blank');
        });
    }

    // Listen to bulk list changes to update totals
    window.addEventListener('bfBulkUpdated', () => {
        updateBulkSummaryBar();
    });

    function createProductCard(p) {
        const mode = getMode();

        if (mode === 'retail') {
            // Retail Mode Card
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
                    <button class="floating-quick-buy-btn" data-id="${p.id}" aria-label="Quick order via WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                    </button>
                </div>
                <div class="product-info-compact">
                    <h3>${p.name}</h3>
                </div>
            `;

            // Wishlist add click
            const addBtn = card.querySelector('.floating-add-btn');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleBagItem(p.id, addBtn);
            });

            // Quick order click (opens modal with order button focused)
            const quickBuyBtn = card.querySelector('.floating-quick-buy-btn');
            quickBuyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                modalController.open(p.id, true);
            });

            // Open detail modal on card click
            card.addEventListener('click', () => {
                modalController.open(p.id, false);
            });

            return card;
        } else {
            // Bulk Mode Card
            const isInBulk = isItemInBulk(p.id);
            // Default MOQs per category: Peanuts/Chana = 5kg, Chikki = 10kg
            const currentQty = isInBulk ? getBulkItemQty(p.id) : (p.category === 'chikki' ? 10 : 5);
            const card = document.createElement('article');
            card.className = 'product-card reveal-up';
            card.innerHTML = `
                <div class="product-img-box-compact">
                    <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
                    <div class="product-badge-overlay-compact">${p.category}</div>
                </div>
                <div class="product-info-compact">
                    <h3>${p.name}</h3>
                    <div class="bulk-actions-wrapper">
                        <div class="bulk-stepper-container" onclick="event.stopPropagation()">
                            <button class="stepper-qty-btn dec-btn" aria-label="Decrease quantity">−</button>
                            <input type="number" class="stepper-qty-input" min="1" step="1" value="${currentQty}" aria-label="Quantity in kg">
                            <span class="stepper-qty-unit">kg</span>
                            <button class="stepper-qty-btn inc-btn" aria-label="Increase quantity">+</button>
                        </div>
                        <button class="bulk-add-btn ${isInBulk ? 'added' : ''}" onclick="event.stopPropagation()">
                            ${isInBulk ? '✓ Added' : 'Add to Bulk'}
                        </button>
                    </div>
                </div>
            `;

            const decBtn = card.querySelector('.dec-btn');
            const incBtn = card.querySelector('.inc-btn');
            const input = card.querySelector('.stepper-qty-input');
            const addBtn = card.querySelector('.bulk-add-btn');

            decBtn.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                if (val > 1) {
                    input.value = val - 1;
                    if (isItemInBulk(p.id)) {
                        addBulkItem(p.id, p.name, val - 1);
                    }
                }
            });

            incBtn.addEventListener('click', () => {
                let val = parseInt(input.value) || 1;
                input.value = val + 1;
                if (isItemInBulk(p.id)) {
                    addBulkItem(p.id, p.name, val + 1);
                }
            });

            input.addEventListener('change', () => {
                let val = parseInt(input.value) || 1;
                if (val < 1) val = 1;
                input.value = val;
                if (isItemInBulk(p.id)) {
                    addBulkItem(p.id, p.name, val);
                }
            });

            addBtn.addEventListener('click', () => {
                const val = parseInt(input.value) || 1;
                if (isItemInBulk(p.id)) {
                    removeBulkItem(p.id);
                    addBtn.classList.remove('added');
                    addBtn.textContent = 'Add to Bulk';
                } else {
                    addBulkItem(p.id, p.name, val);
                    addBtn.classList.add('added');
                    addBtn.textContent = '✓ Added';
                }
            });

            // Open detail modal on card click
            card.addEventListener('click', () => {
                modalController.open(p.id, false);
            });

            return card;
        }
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

    function updateBulkSummaryBar() {
        const bar = document.getElementById('bulk-summary-bar');
        if (!bar) return;

        const mode = getMode();
        if (mode === 'bulk') {
            bar.classList.remove('hidden');
            const items = getBulkItems();
            const totalItems = items.length;
            const totalWeight = items.reduce((sum, item) => sum + (parseInt(item.qtyKg) || 0), 0);

            const countEl = document.getElementById('bulk-total-items');
            const weightEl = document.getElementById('bulk-total-weight');
            if (countEl) countEl.textContent = totalItems;
            if (weightEl) weightEl.textContent = totalWeight;
        } else {
            bar.classList.add('hidden');
        }
    }

    // Hide skeletons and load catalog
    setTimeout(() => {
        renderCatalog();
        updateBulkSummaryBar();
    }, 500);
}

/* ==========================================================================
   Home Page Redesign Component Logic
   ========================================================================== */
function initHomeBestsellers() {
    const list = document.getElementById('bestsellers-list');
    if (!list) return;

    // Select 4 bestseller products (one from peanuts, one from chana, one from chikki, etc.)
    const bestsellers = [
        products.find(p => p.id === 'p1'), // Simply Salted Peanuts
        products.find(p => p.id === 'p2'), // Masala Peanuts
        products.find(p => p.id === 'c1'), // Roasted Salted Chana
        products.find(p => p.id === 'k1')  // Premium Pista Chikki
    ].filter(Boolean);

    list.innerHTML = '';
    bestsellers.forEach(p => {
        const added = isInCart(p.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-box-compact">
                <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="product-badge-overlay-compact">${p.category}</div>
                <button class="floating-add-btn ${added ? 'added' : ''}" data-id="${p.id}" aria-label="Toggle wishlist item">
                    <i class="${added ? 'fa-solid fa-check' : 'fa-solid fa-plus'}"></i>
                </button>
                <button class="floating-quick-buy-btn" data-id="${p.id}" aria-label="Quick order via WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </button>
            </div>
            <div class="product-info-compact">
                <h3>${p.name}</h3>
            </div>
        `;

        // Wishlist add click
        const addBtn = card.querySelector('.floating-add-btn');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isInCart(p.id)) {
                removeFromCart(p.id);
                addBtn.classList.remove('added');
                addBtn.querySelector('i').className = 'fa-solid fa-plus';
            } else {
                addToCart(p.id);
                addBtn.classList.add('added');
                addBtn.querySelector('i').className = 'fa-solid fa-check';
            }
        });

        // Quick order click (goes to products.html to open modal, or we can instantiate a mock modal if needed,
        // but simplest is redirecting to products.html?id=p1, or let it open WhatsApp single-item link directly!
        // Wait, firing it directly is extremely convenient for bestsellers!)
        const quickBuyBtn = card.querySelector('.floating-quick-buy-btn');
        quickBuyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Best seller direct WhatsApp check
            const size = p.sizes[0] || '';
            const msg = `Hi, I'd like to order: ${p.name}${size ? ` (${size})` : ""}. Please confirm availability and next steps.`;
            window.open(`https://wa.me/919824192786?text=${encodeURIComponent(msg)}`, '_blank');
        });

        // Click card redirects to catalog page
        card.addEventListener('click', () => {
            window.location.href = `products.html?category=${p.category}`;
        });

        list.appendChild(card);
    });
}
