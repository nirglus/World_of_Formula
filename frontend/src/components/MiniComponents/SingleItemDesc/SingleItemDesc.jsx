import "./SingleItemDesc.scss";
import { Link } from "react-router-dom";

const LOW_STOCK_THRESHOLD = 5;

function SingleItemDesc({ item, quantity, itemPrice, handleDecrement, handleIncrement, handleAddToCart }) {
  const stock = item.totalQuantity ?? item.countInStock ?? 0;
  const stockLabel = stock <= LOW_STOCK_THRESHOLD && stock > 0 ? "Low stock" : "In stock";

  return (
    <div className="productDescription">
      <p className="licensed">Officially Licensed product</p>
      <h1>{item.title}</h1>
      <ul className="productHighlights" aria-label="Product highlights">
        <li><i className="bi bi-patch-check" aria-hidden /> Officially licensed</li>
        <li><i className="bi bi-gem" aria-hidden /> Collector quality</li>
        <li><i className="bi bi-box-seam" aria-hidden /> {stockLabel}</li>
      </ul>
      <p className="itemDesc">{item.description}</p>
      <div className="productStats">
        <p>
          <span><i className="bi bi-zoom-in"></i> Scale </span>
          {item.scale}
        </p>
        <p>
          <span><i className="bi bi-stack"></i> In stock</span> {stock}
        </p>
      </div>
      <div className="quantity-addToCart">
        <div className="purchaseRow">
          <div className="quantity">
            <span className="quantity-btn" onClick={handleDecrement}>
              -
            </span>
            <span>{quantity}</span>
            <span className="quantity-btn" onClick={handleIncrement}>
              +
            </span>
          </div>
          <button className="addToCartBtn" onClick={handleAddToCart}>
            <i className="bi bi-cart-plus"></i> Add to cart - <span>${itemPrice}</span>
          </button>
        </div>
        <p className="trustLine">
          Secure checkout (simulated) • Fast shipping • 30-day returns
        </p>
      </div>
      <Link to={"/products"} className="backToProducts">
        <i className="bi bi-sign-turn-left-fill"></i> Back to products
      </Link>
    </div>
  );
}

export default SingleItemDesc;
