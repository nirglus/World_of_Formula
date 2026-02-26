const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const LIMITED_THRESHOLD = 25;
const URGENT_THRESHOLD = 10;

export function isProductNew(product) {
  if (!product) return false;
  const thirtyDaysAgo = Date.now() - THIRTY_DAYS_MS;
  const createdAt = product.createdAt ? new Date(product.createdAt).getTime() : null;
  return (createdAt && createdAt >= thirtyDaysAgo) || product.isNew === true;
}

export function isProductLimited(product) {
  if (!product) return false;
  const stock = product.countInStock ?? product.totalQuantity;
  return typeof stock === 'number' && stock < LIMITED_THRESHOLD;
}

function isProductBestSeller(product) {
  if (!product) return false;
  const hasData =
    typeof product.rating === 'number' &&
    typeof product.numReviews === 'number' &&
    product.rating >= 4.6 &&
    product.numReviews >= 50;
  return hasData || product.isBestSeller === true;
}

export function getProductStock(product) {
  return product?.countInStock ?? product?.totalQuantity ?? 0;
}

export function computeBadges(product) {
  if (!product) return [];
  const badges = [];
  const stock = getProductStock(product);

  if (typeof stock === 'number' && stock < LIMITED_THRESHOLD) {
    badges.push({ type: 'limited', urgent: stock < URGENT_THRESHOLD });
  }
  if (isProductBestSeller(product)) badges.push({ type: 'bestSeller' });
  if (isProductNew(product)) badges.push({ type: 'new' });

  const order = ['limited', 'bestSeller', 'new'];
  return badges
    .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
    .slice(0, 2);
}
