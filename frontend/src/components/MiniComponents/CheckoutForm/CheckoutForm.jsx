import { COUNTRIES } from "../../../helpers/countries";
import "./CheckoutForm.scss";

function CheckoutForm({
  address,
  errors,
  handleChange,
  handleCountryChange,
  shippingMethod,
  onShippingChange,
  onProceedToPayment
}) {
  return (
    <form className="checkoutForm" onSubmit={(e) => e.preventDefault()}>
      <div className="checkoutFormField">
        <label htmlFor="street">Street address</label>
        <input
          type="text"
          id="street"
          name="street"
          value={address.street}
          onChange={handleChange}
          autoComplete="street-address"
          placeholder="Number and street name"
          className={errors.street ? "checkoutFormInputError" : ""}
          aria-invalid={!!errors.street}
          aria-describedby={errors.street ? "street-error" : undefined}
        />
        {errors.street && (
          <span id="street-error" className="checkoutFormError" role="alert">
            {errors.street}
          </span>
        )}
      </div>
      <div className="checkoutFormField">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={address.city}
          onChange={handleChange}
          autoComplete="address-level2"
          className={errors.city ? "checkoutFormInputError" : ""}
          aria-invalid={!!errors.city}
          aria-describedby={errors.city ? "city-error" : undefined}
        />
        {errors.city && (
          <span id="city-error" className="checkoutFormError" role="alert">
            {errors.city}
          </span>
        )}
      </div>
      <div className="checkoutFormField">
        <label htmlFor="state">State / Province / Region</label>
        <input
          type="text"
          id="state"
          name="state"
          value={address.state}
          onChange={handleChange}
          autoComplete="address-level1"
          className={errors.state ? "checkoutFormInputError" : ""}
          aria-invalid={!!errors.state}
          aria-describedby={errors.state ? "state-error" : undefined}
        />
        {errors.state && (
          <span id="state-error" className="checkoutFormError" role="alert">
            {errors.state}
          </span>
        )}
      </div>
      <div className="checkoutFormField">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={address.country}
          onChange={handleCountryChange}
          autoComplete="country-name"
          className={errors.country ? "checkoutFormInputError" : ""}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? "country-error" : undefined}
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && (
          <span id="country-error" className="checkoutFormError" role="alert">
            {errors.country}
          </span>
        )}
      </div>

      <div className="checkoutFormSection">
        <span className="checkoutFormSectionLabel">Shipping method</span>
        <div className="checkoutFormShippingOptions">
          <label className="checkoutFormShippingOption">
            <input
              type="radio"
              name="shipping"
              value="standard"
              checked={shippingMethod === "standard"}
              onChange={(e) => onShippingChange(e.target.value)}
            />
            <span className="checkoutFormShippingOptionMain">Standard shipping</span>
            <span className="checkoutFormShippingOptionSub">5–7 business days</span>
          </label>
          <label className="checkoutFormShippingOption">
            <input
              type="radio"
              name="shipping"
              value="express"
              checked={shippingMethod === "express"}
              onChange={(e) => onShippingChange(e.target.value)}
            />
            <span className="checkoutFormShippingOptionMain">Express shipping</span>
            <span className="checkoutFormShippingOptionSub">2–3 business days</span>
          </label>
        </div>
      </div>

      <button
        type="button"
        className="checkoutFormBtn checkoutFormBtnPrimary"
        onClick={onProceedToPayment}
      >
        Proceed to payment
      </button>
    </form>
  );
}

export default CheckoutForm;
