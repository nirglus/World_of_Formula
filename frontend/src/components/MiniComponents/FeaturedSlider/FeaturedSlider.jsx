import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../../api/products";
import { baseURL } from "../../../config/serverConfig";
import placeholderImage from "../../../assets/no-image.png";
import "./FeaturedSlider.scss";

const FEATURED_COUNT = 8;
const CARD_WIDTH = 280;
const SCROLL_AMOUNT = CARD_WIDTH + 20;

function FeaturedSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const trackRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    fetchProducts(ac.signal)
      .then((list) => {
        if (cancelled) return;
        const featured = (Array.isArray(list) ? list : []).slice(0, FEATURED_COUNT);
        setProducts(featured);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, []);

  const scroll = useCallback((direction) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  const handleImageError = useCallback((id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  }, []);

  const prefetchProduct = useCallback((id) => {
    try {
      fetch(`${baseURL}/products/${id}`, { method: "GET" }).catch(() => {});
    } catch {
      // ignore
    }
  }, []);

  return (
    <section className="featuredSlider" aria-labelledby="featured-slider-heading">
      <div className="featuredHeader">
        <h2 id="featured-slider-heading">Featured Models</h2>
        <span>Collector favorites</span>
      </div>

      <div className="sliderWrapper">
        <button
          type="button"
          className="featuredSliderArrow featuredSliderArrowLeft"
          onClick={() => scroll("left")}
          aria-label="Previous products"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="sliderTrack" ref={trackRef} role="list">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="featuredSliderSkeleton" role="listitem">
                  <div className="featuredSkeletonImage" />
                  <div className="featuredSkeletonLine" />
                  <div className="featuredSkeletonLine featuredSkeletonTitle" />
                  <div className="featuredSkeletonLine featuredSkeletonPrice" />
                </div>
              ))}
            </>
          ) : (
            products.map((product) => {
              const hasImage = product.image && !imageErrors[product._id];
              return (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="featuredSliderCard"
                  onMouseEnter={() => prefetchProduct(product._id)}
                  role="listitem"
                >
                  <div className="featuredSliderCardImageWrap">
                    {hasImage ? (
                      <img
                        src={product.image}
                        alt={product.title || "Product"}
                        loading="lazy"
                        onError={() => handleImageError(product._id)}
                      />
                    ) : (
                      <div className="featuredSliderCardNoImage">
                        <img src={placeholderImage} alt="" role="presentation" />
                      </div>
                    )}
                  </div>
                  <div className="featuredSliderCardBody">
                    <span className="featuredSliderCardMeta">Diecast model</span>
                    <h3 className="featuredSliderCardTitle">{product.title}</h3>
                    <p className="featuredSliderCardPrice">${Number(product.price)?.toFixed(2) ?? "0.00"}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <button
          type="button"
          className="featuredSliderArrow featuredSliderArrowRight"
          onClick={() => scroll("right")}
          aria-label="Next products"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default FeaturedSlider;
