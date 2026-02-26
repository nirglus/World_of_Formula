import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/Cart";
import { UserContext } from "../../context/User";
import CheckoutForm from "../MiniComponents/CheckoutForm/CheckoutForm";
import PaymentForm from "../MiniComponents/PaymentForm/PaymentForm";
import "./Checkout.scss";

const validateAddress = (addr) => {
  const errors = {};
  const street = (addr.street || "").trim();
  const city = (addr.city || "").trim();
  const state = (addr.state || "").trim();
  const country = (addr.country || "").trim();
  if (!street) errors.street = "Street address is required.";
  else if (street.length < 3) errors.street = "Please enter a valid street address.";
  if (!city) errors.city = "City is required.";
  else if (city.length < 2) errors.city = "Please enter a valid city.";
  if (!state) errors.state = "State / Province / Region is required.";
  else if (state.length < 2) errors.state = "Please enter a valid state or region.";
  if (!country) errors.country = "Please select a country.";
  return errors;
};

function Checkout() {
  const [isPayment, setIsPayment] = useState(false);
  const [isOrderFinished, setIsOrderFinished] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState(null);
  const [addressErrors, setAddressErrors] = useState({});
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: ""
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const { user } = useContext(UserContext);
  const { userCart, placeOrder, isPlacingOrder } = useContext(CartContext);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    if (addressErrors[name]) setAddressErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCountryChange = (e) => {
    setAddress({ ...address, country: e.target.value });
    if (addressErrors.country) setAddressErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleProceedToPayment = () => {
    const errors = validateAddress(address);
    setAddressErrors(errors);
    if (Object.keys(errors).length === 0) setIsPayment(true);
  };

  const handleSubmit = async (e, paymentMethod) => {
    e.preventDefault();
    setPlaceOrderError(null);
    const success = await placeOrder({ address, paymentMethod, shippingMethod, userID: user?.id });
    if (success) setIsOrderFinished(true);
    else setPlaceOrderError("Could not place order. Please try again.");
  };

  const items = userCart?.items ?? [];
  const isEmptyAndNotFinished = items.length === 0 && !isOrderFinished;

  if (isEmptyAndNotFinished) {
    return (
      <div className="checkoutEmptyCard">
        <p className="checkoutEmptyMessage">Your cart is empty.</p>
        <p className="checkoutEmptySub">Add items to your cart to checkout.</p>
        <Link to="/products" className="checkoutEmptyCta">
          Shop products
        </Link>
      </div>
    );
  }

  if (isOrderFinished) {
    return (
      <div className="checkoutThankYouCard">
        <div className="checkoutThankYouIcon" aria-hidden>
          <i className="bi bi-check-circle-fill" />
        </div>
        <h1 className="checkoutThankYouTitle">Thank you for your order</h1>
        <p className="checkoutThankYouText">
          Your purchase is being processed and will be shipped promptly.
        </p>
        <Link to="/products" className="checkoutThankYouCta">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkoutSteps">
      <div className="checkoutStepCard checkoutStep1">
        <span className="checkoutStepLabel">Step 1 — Shipping address</span>
        <CheckoutForm
          address={address}
          errors={addressErrors}
          handleChange={handleAddressChange}
          handleCountryChange={handleCountryChange}
          shippingMethod={shippingMethod}
          onShippingChange={setShippingMethod}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
      {isPayment && (
        <div className="checkoutStepCard checkoutStep2">
          <span className="checkoutStepLabel">Step 2 — Payment</span>
          {placeOrderError && (
            <p className="checkoutError" role="alert">
              {placeOrderError}
            </p>
          )}
          <PaymentForm handleSubmit={handleSubmit} isSubmitting={isPlacingOrder} />
        </div>
      )}
    </div>
  );
}

export default Checkout;
