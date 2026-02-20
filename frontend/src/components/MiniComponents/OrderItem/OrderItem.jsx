import formatDate from "../../../helpers/formatDate";
import { useState } from "react";
import "./OrderItem.scss";

function OrderItem({order}) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
      setExpanded(!expanded);
    };
  
    return (
      <div className={`orderItem ${expanded ? 'expanded' : ''}`} onClick={toggleExpanded}>
        <div className="orderItemTop"></div>
        <h3><b>Order ID:</b> {order._id}</h3>
        <p><b>Purchased at:</b> {formatDate(order.createdAt)}</p>
        <p><b>Status:</b> {order.status}</p>
        <p><b>Total Price:</b> ${order.totalPrice}</p>
        <div className="details">
            <div className="address">
                <h4>Shipping Address</h4>
                <p>
                    {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country}
                </p>
            </div>
          <h4>Ordered Items</h4>
          <ul className="product-list">
            {order.items.map((item) => (
              <li key={item._id} className="product-item">
                <img src={item.productID.image} alt={item.productID.title} width={70} />{item.productID.title} ({item.quantity}) - ${item.productID.price} each | <b>Total: ${item.productID.price * item.quantity}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}

export default OrderItem
