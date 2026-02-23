/**
 * Products API with retry, cache (localStorage TTL=60s), and AbortController support.
 */
import axios from 'axios';
import { baseURL } from '../config/serverConfig';

const CACHE_KEY = 'wof_products_cache';
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

function getCachedProducts() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL_MS) return data;
    localStorage.removeItem(CACHE_KEY);
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }
  return null;
}

function setCachedProducts(products) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: products,
      timestamp: Date.now(),
    }));
  } catch {
    // ignore quota / storage errors
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch products with retry and optional cache.
 * @param {AbortSignal} [signal] - AbortController signal to cancel the request
 * @param {{ skipCache?: boolean }} [opts] - skipCache: bypass cache and refetch
 * @returns {Promise<Array>} products array
 */
export async function fetchProducts(signal, opts = {}) {
  if (!opts.skipCache) {
    const cached = getCachedProducts();
    if (cached) return cached;
  }

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(`${baseURL}/products`, {
        signal,
        timeout: 15000,
      });
      const products = Array.isArray(response.data) ? response.data : [];
      setCachedProducts(products);
      return products;
    } catch (err) {
      lastError = err;
      if (axios.isCancel(err)) throw err;
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    }
  }
  throw lastError;
}
