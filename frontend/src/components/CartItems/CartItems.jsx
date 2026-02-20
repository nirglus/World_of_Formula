import CartItem from "../MiniComponents/CartItem/CartItem";
import { useContext, useEffect, useState } from "react";
import {CartContext} from "../../context/Cart";
import { useParams } from "react-router-dom";
import "./CartItems.scss";
import loading from "../../assets/loading.gif";

function CartItems() {
  const {userCart, findCartByUserID, setUserCart, removeItemFromCart, isCartLoading} = useContext(CartContext);
  const [cartTotalPrice, setCartTotalPrice] = useState(userCart.totalPrice);
  let {id: cartID} = useParams();
  
  useEffect(() => {
    findCartByUserID(cartID);
  }, [cartID, userCart.totalPrice]);

  return (
    <div className="cartItems">
      {isCartLoading && (
      <div className="loading">
          <img src={loading} alt="loading" />
      </div>
      )}
      {!isCartLoading && userCart.items.map((item,index)=>(
        <div className='cartItem' key={index}>
        <CartItem item={item} />
        <button onClick={() => removeItemFromCart(userCart.id, item._id)}><i className="bi bi-trash3"></i> <span className="removeFromCart">Remove from Cart</span></button>
        </div>
      ))}
      <p><b>Total price: </b>${userCart.totalPrice}</p>
    </div>
  )
}

export default CartItems
