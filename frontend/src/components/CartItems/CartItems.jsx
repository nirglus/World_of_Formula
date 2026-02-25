import CartItem from "../MiniComponents/CartItem/CartItem";
import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/Cart";
import "./CartItems.scss";

function CartItems({ isCheckout, onCheckoutClick, onCancelCheckout }) {
  const { id: cartID } = useParams();
  const { userCart, findCartByUserID, findCartByUserIDSilent, removeItemFromCart, updateItemQuantity, isCartLoading } = useContext(CartContext);
  const [pendingItemIds, setPendingItemIds] = useState({});

  useEffect(() => {
    if (cartID) findCartByUserID(cartID);
  }, [cartID, findCartByUserID]);

  const items = userCart?.items ?? [];
  const total = userCart?.totalPrice ?? 0;
  const subtotal = total;
  const shipping = 0;
  const orderTotal = subtotal + shipping;

  const isFirstLoad = isCartLoading && (!items || items.length === 0);
  if (isFirstLoad) {
    return (
      <div className="cartLayout">
        <div className="cartItemsCol">
          <div className="cartSkeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="cartSkeletonRow skeleton">
                <div className="cartSkeletonImg skeleton" />
                <div className="cartSkeletonBody">
                  <div className="cartSkeletonTitle skeleton" />
                  <div className="cartSkeletonPrice skeleton" />
                  <div className="cartSkeletonQty skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cartSummaryCol">
          <div className="cartSummarySkeleton skeleton" />
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  const setItemPending = (itemId, value) => {
    setPendingItemIds((prev) => (value ? { ...prev, [itemId]: true } : (() => { const next = { ...prev }; delete next[itemId]; return next; })()));
  };

  const handleQuantityChange = useCallback(async (item, delta) => {
    const cartId = userCart?.id;
    if (!cartId) return;
    const productId = typeof item.productID === "string" ? item.productID : (item.productID?._id ?? item.productID?.id);
    const unitPrice = item.quantity > 0 ? (item.price * item.quantity) / item.quantity : item.price || 0;
    const newQty = item.quantity + delta;
    const itemId = item.id ?? item._id;
    if (newQty < 1) {
      setItemPending(itemId, true);
      await removeItemFromCart(cartId, itemId);
      setItemPending(itemId, false);
      return;
    }
    setItemPending(itemId, true);
    await updateItemQuantity(cartId, productId, newQty, unitPrice);
    await findCartByUserIDSilent(cartID);
    setItemPending(itemId, false);
  }, [cartID, userCart?.id, removeItemFromCart, updateItemQuantity, findCartByUserIDSilent]);

  const handleRemove = useCallback(async (item) => {
    const cartId = userCart?.id;
    if (!cartId) return;
    const itemId = item.id ?? item._id;
    setItemPending(itemId, true);
    await removeItemFromCart(cartId, itemId);
    setItemPending(itemId, false);
  }, [userCart?.id, removeItemFromCart]);

  return (
    <div className="cartLayout">
      <div className="cartItemsCol">
        <ul className="cartItemsList" aria-label="Cart items">
          {items.map((item, index) => (
            <li key={item.id ?? item._id ?? index} className="cartItemCard">
              <CartItem
                item={item}
                isPending={!!pendingItemIds[item.id ?? item._id]}
                onRemove={() => handleRemove(item)}
                onQuantityChange={handleQuantityChange}
              />
            </li>
          ))}
        </ul>
      </div>
      <aside className="cartSummaryCol" aria-label="Order summary">
        <div className="cartSummaryCard">
          <h2 className="cartSummaryTitle">Order summary</h2>
          <div className="cartSummaryRow">
            <span>Subtotal</span>
            <span>${Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="cartSummaryRow cartSummaryRowMuted">
            <span>Shipping (simulated)</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="cartSummaryRow cartSummaryRowMuted">
            <span>30-day returns</span>
            <span>—</span>
          </div>
          <div className="cartSummaryDivider" />
          <div className="cartSummaryRow cartSummaryTotal">
            <span>Total</span>
            <span>${Number(orderTotal).toFixed(2)}</span>
          </div>
          {!isCheckout ? (
            <button type="button" className="cartSummaryCta" onClick={onCheckoutClick}>
              Proceed to checkout
            </button>
          ) : (
            <button type="button" className="cartSummaryCancel" onClick={onCancelCheckout}>
              Cancel
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CartItems;
