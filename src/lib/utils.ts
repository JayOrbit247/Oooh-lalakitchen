export function formatNaira(amount: number): string {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

export function generateOrderNumber(): string {
  const date = new Date();
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `OLK-${yy}${mm}${dd}-${rand}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const WHATSAPP_PHONE = '2348117926084';

export function buildWhatsAppOrderLink(
  itemName: string,
  quantity: number = 1,
  price?: number,
): string {
  const lines = [
    `Hello Oooh-Lala Kitchen!`,
    ``,
    `I'd like to order:`,
    `• ${quantity}x ${itemName}${price ? ` — ${formatNaira(price)}` : ''}`,
    ``,
    `Please confirm availability and delivery. Thank you!`,
  ];
  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

export function buildWhatsAppCartLink(
  items: { name: string; quantity: number; price: number }[],
  total: number,
): string {
  const lines = [
    `Hello Oooh-Lala Kitchen!`,
    ``,
    `I'd like to order the following:`,
    ...items.map((i) => `• ${i.quantity}x ${i.name} — ${formatNaira(i.price * i.quantity)}`),
    ``,
    `Total: ${formatNaira(total)}`,
    ``,
    `Please confirm my order and delivery details. Thank you!`,
  ];
  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}
