import { useState } from "react";
import "./PaymentForm.scss";

function PaymentForm({ handleSubmit, isSubmitting }) {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    handleSubmit(e, paymentMethod);
  };

  return (
    <form className="paymentForm" onSubmit={handlePaymentSubmit}>
      <div className="paymentFormOptions">
        <label className="paymentFormOption">
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={handlePaymentMethodChange}
          />
          <span>PayPal</span>
        </label>
        <label className="paymentFormOption">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={handlePaymentMethodChange}
          />
          <span>Credit / Debit card</span>
        </label>
      </div>

      {paymentMethod === "card" && (
        <div className="paymentFormCardFields">
          <div className="checkoutFormField">
            <label htmlFor="cardNumber">Card number</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="paymentFormRow">
            <div className="checkoutFormField">
              <label htmlFor="expiryDate">Expiry</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </div>
            <div className="checkoutFormField">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCVV(e.target.value)}
                placeholder="123"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <p className="paymentFormPayPalNote">You will be redirected to PayPal to complete payment.</p>
      )}

      <button type="submit" className="paymentFormSubmit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="paymentFormSubmitSpinner" aria-hidden />
            Placing order…
          </>
        ) : (
          "Place order"
        )}
      </button>
    </form>
  );
}

export default PaymentForm;
