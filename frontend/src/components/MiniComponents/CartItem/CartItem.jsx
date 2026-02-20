import "./CartItem.scss";
import { Link } from "react-router-dom";

function CartItem({item}) {
  return (
    <>
        <img src={item.productID.image} alt={item.productID.title} width={100}/>
        <article>
          <h3><Link to={`/products/${item.productID.id}`}>{item.productID.title}</Link></h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price}</p>
        </article>
    </>
  )
}

export default CartItem
