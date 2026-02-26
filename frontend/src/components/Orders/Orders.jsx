import axios from "axios";
import { UserContext } from "../../context/User";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { baseURL } from "../../config/serverConfig";
import OrderItem from "../MiniComponents/OrderItem/OrderItem";
import "./Orders.scss";

function Orders() {
  const { user, headers } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getOrders = async (userID) => {
    if (!userID) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseURL}/orders`, {
        data: { id: userID },
        headers: headers || {},
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to get orders", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) getOrders(user.id);
    else setIsLoading(false);
  }, [user?.id]);

  return (
    <div className="accountOrders">
      <header className="accountOrdersHeader">
        <h1 className="pageHeroTitle">My Orders</h1>
        <p className="accountOrdersSubtitle">View and track your orders</p>
      </header>

      {isLoading ? (
        <div className="accountOrdersSkeletonWrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="accountOrdersSkeletonCard">
              <div className="accountOrdersSkeletonLine accountOrdersSkeletonTitle" />
              <div className="accountOrdersSkeletonLine" />
              <div className="accountOrdersSkeletonLine accountOrdersSkeletonShort" />
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="accountOrdersCard">
          <ul className="accountOrdersList">
            {orders.map((order, index) => (
              <li key={order._id || index}>
                <OrderItem order={order} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="accountOrdersEmpty">
          <div className="accountOrdersEmptyIcon" aria-hidden="true">
            <i className="bi bi-receipt" />
          </div>
          <p className="accountOrdersEmptyTitle">No orders yet</p>
          <p className="accountOrdersEmptySub">Place your first order from our collection.</p>
          <Link to="/products" className="accountOrdersEmptyCta">
            Shop products
          </Link>
        </div>
      )}
    </div>
  );
}

export default Orders;
