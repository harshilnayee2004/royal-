const WHATSAPP_NUMBER = "919824192786"; // +91 98241 92786 — CONFIRM WITH CLIENT: check if this is the correct live number

export function buildWhatsAppLink(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function quickOrderMessage(product, size) {
    return `Hi, I'd like to order: ${product.name}${size ? ` (${size})` : ""}. Please confirm availability and next steps.`;
}

export function bulkInquiryMessage(lines) {
    const items = lines.map(l => `- ${l.name}: ${l.qtyKg}kg`).join("\n");
    return `Hi, I'd like to place a bulk order:\n${items}\n\nPlease share pricing and next steps.`;
}
