import Checkout from "../../components/Checkout/Checkout";
import CartItems from "../../components/CartItems/CartItems";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/Cart";
import { Link } from "react-router-dom";
import "../../components/Checkout/Checkout.scss";
import "./Cart.scss";

function Cart() {
  const { id } = useParams();
  const [isCheckout, setIsCheckout] = useState(false);
  const { userCart, orderPlacedSuccess, clearOrderSuccess, findCartByUserID } = useContext(CartContext);

  const toggleCheckout = () => setIsCheckout(!isCheckout);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (id) findCartByUserID(id);
  }, [id, findCartByUserID]);

  const isEmpty = !userCart.items || userCart.items.length < 1;

  useEffect(() => {
    if (!isEmpty && orderPlacedSuccess) clearOrderSuccess();
  }, [isEmpty, orderPlacedSuccess, clearOrderSuccess]);

  if (orderPlacedSuccess && isEmpty) {
    return (
      <div className="cartPage">
        <header className="cartPageHeader">
          <h1 className="cartPageTitle">
            <i className="bi bi-cart3" aria-hidden />
            My Cart
          </h1>
        </header>
        <div className="checkoutThankYouCard">
          <div className="checkoutThankYouIcon" aria-hidden>
            <i className="bi bi-check-circle-fill" />
          </div>
          <h1 className="checkoutThankYouTitle">Thank you for your order</h1>
          <p className="checkoutThankYouText">
            Your purchase is being processed and will be shipped promptly.
          </p>
          <Link to="/products" className="checkoutThankYouCta" onClick={clearOrderSuccess}>
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cartPage">
      <header className="cartPageHeader">
        <h1 className="cartPageTitle">
          <i className="bi bi-cart3" aria-hidden />
          My Cart
        </h1>
      </header>

      {isEmpty ? (
        <div className="cartEmptyState">
          <p className="cartEmptyMessage">Your cart is empty</p>
          <p className="cartEmptySub">Add items from our collection to get started.</p>
          <Link to="/products" className="cartEmptyCta">
            Shop products
          </Link>
        </div>
      ) : (
        <>
          <CartItems
            isCheckout={isCheckout}
            onCheckoutClick={toggleCheckout}
            onCancelCheckout={toggleCheckout}
          />
          {isCheckout && (
            <div className="cartCheckoutWrap">
              <Checkout />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
