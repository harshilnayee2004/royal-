/**
 * Bulk Cart Manager
 * Handles localStorage-backed bulk inquiry arrays (productId, name, qtyKg)
 * and fires custom events on modification.
 */
const STORAGE_KEY = 'bf_bulk_cart';

export function getBulkItems() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to read bulk cart", e);
        return [];
    }
}

export function addBulkItem(productId, name, qtyKg) {
    let cart = getBulkItems();
    const existingIndex = cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
        cart[existingIndex].qtyKg = qtyKg;
    } else {
        cart.push({ productId, name, qtyKg });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    dispatchBulkUpdate();
}

export function removeBulkItem(productId) {
    let cart = getBulkItems();
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    dispatchBulkUpdate();
}

export function isItemInBulk(productId) {
    const cart = getBulkItems();
    return cart.some(item => item.productId === productId);
}

export function getBulkItemQty(productId) {
    const cart = getBulkItems();
    const item = cart.find(item => item.productId === productId);
    return item ? item.qtyKg : 0;
}

export function clearBulkCart() {
    localStorage.removeItem(STORAGE_KEY);
    dispatchBulkUpdate();
}

export function updateBulkBadges() {
    // Fire event to trigger UI updates
    dispatchBulkUpdate();
}

function dispatchBulkUpdate() {
    const event = new CustomEvent('bfBulkUpdated', { 
        detail: { 
            items: getBulkItems() 
        } 
    });
    window.dispatchEvent(event);
}
