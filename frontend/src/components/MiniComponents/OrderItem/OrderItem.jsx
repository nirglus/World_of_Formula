import formatDate from "../../../helpers/formatDate";
import { useState } from "react";
import "./OrderItem.scss";

function shortId(id) {
  if (!id || typeof id !== "string") return "—";
  return id.length > 6 ? id.slice(-6) : id;
}

function OrderItem({ order }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleCopyId = (e) => {
    e.stopPropagation();
    if (order?._id) {
      navigator.clipboard.writeText(order._id).catch(() => {});
    }
  };

  const address = order?.address;
  const items = order?.items ?? [];
  const idShort = shortId(order?._id);

  return (
    <div
      className={`orderItem ${expanded ? "orderItemExpanded" : ""}`}
      onClick={toggleExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleExpanded()}
      aria-expanded={expanded}
    >
      <div className="orderItemRow">
        <div className="orderItemMain">
          <div className="orderItemIdWrap">
            <span className="orderItemIdLabel">Order</span>
            <span className="orderItemId">…{idShort}</span>
            <button
              type="button"
              className="orderItemCopy"
              onClick={handleCopyId}
              aria-label="Copy full order ID"
              title="Copy order ID"
            >
              <i className="bi bi-clipboard" aria-hidden="true" />
            </button>
          </div>
          <span className="orderItemDate">{formatDate(order?.createdAt)}</span>
          <span className={`orderItemStatus orderItemStatus${(order?.status || "").replace(/\s+/g, "")}`}>
            {order?.status || "—"}
          </span>
        </div>
        <div className="orderItemMeta">
          <span className="orderItemTotal">${Number(order?.totalPrice ?? 0).toFixed(2)}</span>
          <span className="orderItemExpand" aria-hidden="true">
            <i className={`bi bi-chevron-${expanded ? "up" : "down"}`} />
          </span>
        </div>
      </div>

      <div className="orderItemDetails">
        {address && (
          <div className="orderItemAddress">
            <h4>Shipping address</h4>
            <p>
              {[address.street, address.city, address.state, address.country].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
        )}
        <h4>Ordered items</h4>
        <ul className="orderItemProductList">
          {items.map((item) => {
            const product = item?.productID;
            const title = product?.title ?? "Product";
            const qty = Number(item?.quantity) ?? 0;
            const price = Number(product?.price ?? item?.price ?? 0);
            const lineTotal = price * qty;
            return (
              <li key={item?._id ?? Math.random()} className="orderItemProductItem">
                {product?.image && (
                  <img src={product.image} alt="" width={50} height={50} className="orderItemProductImg" />
                )}
                <span className="orderItemProductTitle">{title}</span>
                <span className="orderItemProductQty">×{qty}</span>
                <span className="orderItemProductTotal">${lineTotal.toFixed(2)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default OrderItem;
