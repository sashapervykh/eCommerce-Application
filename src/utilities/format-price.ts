export function formatPrice(price: number | undefined) {
  if (price === undefined) {
    return '0.00';
  }
  return (price / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
