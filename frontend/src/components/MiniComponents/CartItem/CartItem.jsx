import { useState } from "react";
import { Link } from "react-router-dom";
import "./CartItem.scss";
import placeholderImage from "../../../assets/no-image.png";

function CartItem({ item, isPending, onRemove, onQuantityChange }) {
  const product = item?.productID && typeof item.productID === "object" ? item.productID : null;
  const productId = typeof item.productID === "string" ? item.productID : (product?.id ?? product?._id ?? "");
  const title = item.name ?? product?.title ?? product?.name ?? "Product";
  const imageUrl = item.image ?? product?.image ?? "";
  const unitPrice = item.quantity > 0 ? item.price / item.quantity : 0;
  const lineTotal = item.price;

  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const displaySrc = imgError || !imgSrc ? placeholderImage : imgSrc;

  const handleImgError = () => {
    setImgError(true);
    setImgSrc(placeholderImage);
  };

  const handleImgLoad = () => setImgLoaded(true);

  return (
    <div className={`cartItemRow ${isPending ? "cartItemRow--pending" : ""}`}>
      <Link to={`/products/${productId}`} className="cartItemImageWrap">
        <img
          src={displaySrc}
          alt=""
          className={`cartItemImage ${imgLoaded ? "cartItemImageLoaded" : ""}`}
          loading="lazy"
          onError={handleImgError}
          onLoad={handleImgLoad}
        />
      </Link>
      <div className="cartItemDetails">
        <h3 className="cartItemTitle">
          <Link to={`/products/${productId}`}>{title}</Link>
        </h3>
        <p className="cartItemUnitPrice">${Number(unitPrice).toFixed(2)} each</p>
        <div className="cartItemActions">
          <div className="cartItemStepper">
            <button
              type="button"
              className="cartItemStepperBtn"
              onClick={() => onQuantityChange(item, -1)}
              disabled={isPending}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="cartItemQty" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              className="cartItemStepperBtn"
              onClick={() => onQuantityChange(item, 1)}
              disabled={isPending}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {isPending && <span className="cartItemSpinner" aria-hidden />}
          <p className="cartItemLineTotal">${Number(lineTotal).toFixed(2)}</p>
        </div>
      </div>
      <button
        type="button"
        className="cartItemRemove"
        onClick={onRemove}
        disabled={isPending}
        aria-label="Remove from cart"
        title="Remove from cart"
      >
        <i className="bi bi-trash3" aria-hidden />
      </button>
    </div>
  );
}

export default CartItem;
