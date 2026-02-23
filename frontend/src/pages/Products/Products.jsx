import axios from 'axios';
import { isAdmin } from '../../config/roles';
import { UserContext } from '../../context/User';
import { baseURL } from '../../config/serverConfig';
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import ProductItem from '../../components/ProductItem/ProductItem';
import ProductSkeleton from '../../components/ProductSkeleton/ProductSkeleton';
import { fetchProducts } from '../../api/products';
import './Products.scss';

const LOAD_STATE = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

function Products() {
  const [products, setProducts] = useState([]);
  const [loadState, setLoadState] = useState(LOAD_STATE.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
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
      setErrorMessage(err?.response?.status === 404
        ? 'Products not found.'
        : err?.message || 'Failed to load products. The server may be waking up.');
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

  const handleRetry = () => {
    loadProducts(true); // skip cache on retry
  };

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm('Are you sure you want to disable this item?');
    if (!shouldDelete) return;
    try {
      await axios.patch(
        `${baseURL}/products`,
        { id: productId, active: false },
        { headers }
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error('Failed to disable product', error);
    }
  };

  return (
    <div className="products">
      <div className="titles">
        <h1>Our Products</h1>
        <hr />
      </div>

      {loadState === LOAD_STATE.LOADING && (
        <div className="productsDisp">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {loadState === LOAD_STATE.ERROR && (
        <div className="productsError">
          <p>{errorMessage}</p>
          <button type="button" className="retryBtn" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}

      {loadState === LOAD_STATE.SUCCESS && (
        <div className="productsDisp">
          {products
            .filter((product) => product.active)
            .map((product, index) => (
              <ProductItem
                key={product._id}
                product={product}
                isAdmin={isAdmin(user)}
                onDelete={handleDelete}
                setProducts={setProducts}
              />
            ))}
        </div>
      )}

      {loadState === LOAD_STATE.SUCCESS && products.filter((p) => p.active).length === 0 && (
        <p className="productsEmpty">No products available.</p>
      )}
    </div>
  );
}

export default Products;
