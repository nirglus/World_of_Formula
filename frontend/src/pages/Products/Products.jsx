import axios from 'axios';
import { isAdmin } from '../../config/roles';
import { UserContext } from '../../context/User';
import { baseURL } from '../../config/serverConfig';
import { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import ProductItem from '../../components/ProductItem/ProductItem';
import ProductSkeleton from '../../components/ProductSkeleton/ProductSkeleton';
import TrustBar from '../../components/TrustBar/TrustBar';
import { fetchProducts } from '../../api/products';
import { isProductNew, isProductLimited } from '../../helpers/productBadges';
import './Products.scss';

const LOAD_STATE = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };
const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
];

function Products() {
  const [products, setProducts] = useState([]);
  const [loadState, setLoadState] = useState(LOAD_STATE.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [limitedOnly, setLimitedOnly] = useState(false);
  const { user, headers } = useContext(UserContext);
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  const loadProducts = useCallback(async (skipCache = false) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;
    setLoadState(LOAD_STATE.LOADING);
    setErrorMessage('');
    try {
      const data = await fetchProducts(signal, { skipCache });
      if (!mountedRef.current) return;
      setProducts(data);
      setLoadState(LOAD_STATE.SUCCESS);
    } catch (err) {
      if (!mountedRef.current) return;
      if (axios.isCancel(err)) return;
      setLoadState(LOAD_STATE.ERROR);
      setErrorMessage(err?.response?.status === 404 ? 'Products not found.' : err?.message || 'Failed to load products.');
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadProducts();
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, [loadProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...activeProducts];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.scale || '').toLowerCase().includes(q)
      );
    }
    if (inStockOnly) list = list.filter((p) => (p.totalQuantity || 0) > 0);
    if (newOnly) list = list.filter(isProductNew);
    if (limitedOnly) list = list.filter(isProductLimited);

    const [sortKey, sortDir] = sortBy.split('-');
    list.sort((a, b) => {
      if (sortKey === 'price') {
        const diff = (a.price || 0) - (b.price || 0);
        return sortDir === 'asc' ? diff : -diff;
      }
      return sortDir === 'asc'
        ? (a.title || '').toLowerCase().localeCompare((b.title || '').toLowerCase())
        : (b.title || '').toLowerCase().localeCompare((a.title || '').toLowerCase());
    });
    return list;
  }, [activeProducts, searchQuery, inStockOnly, newOnly, limitedOnly, sortBy]);

  const handleBadgeFilter = (type) => {
    if (type === 'new') setNewOnly((p) => !p);
    if (type === 'limited') setLimitedOnly((p) => !p);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setInStockOnly(false);
    setNewOnly(false);
    setLimitedOnly(false);
  };

  const handleRetry = () => loadProducts(true);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to disable this item?')) return;
    try {
      await axios.patch(`${baseURL}/products`, { id: productId, active: false }, { headers });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error('Failed to disable product', error);
    }
  };

  return (
    <div className="productsPage">
      <div className="productsContainer">
        <header className="heroHeader">
          <h1 className="pageHeroTitle">Products</h1>
          <p className="heroSubtitle">Premium diecast models for collectors and racing fans</p>
          <div className="heroChips">
            <button type="button" className={`chip ${newOnly ? 'chipActive' : 'chipAccent'}`} onClick={() => handleBadgeFilter('new')} aria-pressed={newOnly}>New arrivals</button>
            <button type="button" className={`chip ${limitedOnly ? 'chipActive' : ''}`} onClick={() => handleBadgeFilter('limited')} aria-pressed={limitedOnly}>Limited stock</button>
            <span className="chip chipStatic">Best sellers</span>
            <span className="chip chipStatic">Collector grade</span>
          </div>
          <TrustBar />
        </header>
        <div className="featuredStrip">New arrivals updated weekly • Limited stock on popular models</div>

        {loadState === LOAD_STATE.LOADING && (
          <div className="productsGrid">
            {[1, 2, 3, 4, 5, 6].map((i) => <ProductSkeleton key={i} />)}
          </div>
        )}

        {loadState === LOAD_STATE.ERROR && (
          <div className="productsError">
            <p>{errorMessage}</p>
            <button type="button" className="retryBtn" onClick={handleRetry}>Try again</button>
          </div>
        )}

        {loadState === LOAD_STATE.SUCCESS && (
          <>
            <div className="toolbarCard">
              <div className="toolbar">
                <div className="toolbarSearch">
                  <i className="bi bi-search" aria-hidden />
                  <input type="search" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search products" />
                </div>
                <div className="toolbarFilters">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products" className="sortSelect">
                    {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <label className="filterToggle">
                    <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                    <span>In stock</span>
                  </label>
                </div>
                <p className="resultCount">Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="productsEmpty">
                <p>No products match your filters.</p>
                <button type="button" className="clearFiltersBtn" onClick={clearAllFilters}>Clear filters</button>
              </div>
            ) : (
              <div className="productsGrid">
                {filteredAndSortedProducts.map((product) => (
                  <ProductItem
                    key={product._id}
                    product={product}
                    isAdmin={isAdmin(user)}
                    onDelete={handleDelete}
                    setProducts={setProducts}
                    onBadgeClick={handleBadgeFilter}
                    activeFilterNew={newOnly}
                    activeFilterLimited={limitedOnly}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
