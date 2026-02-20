import { useState } from "react";
import "./PaymentForm.scss";

function PaymentForm({ handleSubmit }) {
    const [paymentMethod, setPaymentMethod] = useState("paypal");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCVV] = useState("");

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleCardNumberChange = (e) => {
        setCardNumber(e.target.value);
    };

    const handleExpiryDateChange = (e) => {
        setExpiryDate(e.target.value);
    };

    const handleCVVChange = (e) => {
        setCVV(e.target.value);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        
        if (paymentMethod === "paypal") {
            // Handle PayPal payment
        } else if (paymentMethod === "card") {
            // Handle card payment
        }

        handleSubmit(e, paymentMethod);
    };

    return (
        <div className="payment-form">
            <div className="titles">
                <h1><i className="bi bi-wallet2"></i> Payment Information</h1>
                <hr />
            </div>
            <form className="checkOutForm" onSubmit={handlePaymentSubmit}>
                <div className="payment-options">
                    <input
                        type="radio"
                        id="paypal"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="paypal">PayPal</label>

                    <input
                        type="radio"
                        id="card"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="card">Credit/Debit Card</label>
                </div>

                {paymentMethod === "card" && (
                    <div className="card-details">
                        <div className="checkoutInput">
                            <label htmlFor="cardNumber" className="cardLabel">Card Number:</label>
                            <input
                                type="text"
                                id="cardNumber"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                required
                            />
                        </div>
                        <div className="cardDates">
                            <div className="checkoutInput">
                                <label htmlFor="expiryDate" className="cardLabel">Expiry:</label>
                                <input
                                type="text"
                                id="expiryDate"
                                value={expiryDate}
                                onChange={handleExpiryDateChange}
                                placeholder="MM/YYYY"
                                required
                                />
                            </div>
                            <div className="checkoutInput">
                                <label htmlFor="cvv">CVV:</label>
                                <input
                                type="text"
                                id="cvv"
                                value={cvv}
                                onChange={handleCVVChange}
                                required
                                />
                            </div>
                        </div>
                    </div>
                )}
                {paymentMethod === "paypal" && (
                    <>
                    <div className="checkoutInput">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                        />
                    </div>
                    <div className="checkoutInput">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                        />
                    </div>
                    </>
                )}

                <button type="submit">Order</button>
            </form>
        </div>
    );
}

export default PaymentForm;