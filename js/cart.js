/**
 * Premium Inquiry Wishlist Manager
 * Manages persistent localStorage cart arrays and fires custom events to update badge counts.
 */
const STORAGE_KEY = 'bf_inquiry_cart';

export function getCart() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to read wishlist cart", e);
        return [];
    }
}

export function addToCart(productId) {
    let cart = getCart();
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        dispatchCartUpdate();
    }
}

export function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(id => id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    dispatchCartUpdate();
}

export function isInCart(productId) {
    const cart = getCart();
    return cart.includes(productId);
}

export function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    dispatchCartUpdate();
}

export function updateCartBadges() {
    const cart = getCart();
    const count = cart.length;
    const badges = document.querySelectorAll('.cart-badge');

    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.add('active');
        } else {
            badge.classList.remove('active');
        }
    });
}

function dispatchCartUpdate() {
    updateCartBadges();
    const event = new CustomEvent('bfCartUpdated', { detail: { count: getCart().length } });
    window.dispatchEvent(event);
}
