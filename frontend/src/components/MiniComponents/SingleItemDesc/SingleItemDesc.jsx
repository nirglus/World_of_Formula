import "./SingleItemDesc.scss";
import { Link } from "react-router-dom";

function SingleItemDesc({item, quantity, itemPrice, handleDecrement, handleIncrement, handleAddToCart}) {
  return (
    <div className="productDescription">
      <p className="licensed">Officially Licensed product</p>
      <h1>{item.title}</h1>
      <p className="itemDesc">{item.description}</p>
      <div className="productStats">
        <p>
          <span><i className="bi bi-zoom-in"></i> Scale </span>
          {item.scale}
        </p>
        <p>
          <span><i className="bi bi-stack"></i> In stock</span> {item.totalQuantity}
        </p>
      </div>
      <div className="quantity-addToCart">
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
      <Link to={"/products"} className="backToProducts">
        <i className="bi bi-sign-turn-left-fill"></i> Back to products
      </Link>
    </div>
  );
}

export default SingleItemDesc;
