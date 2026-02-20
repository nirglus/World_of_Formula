import {useState, useContext} from 'react'
import { CartContext } from '../../context/Cart';
import CheckoutForm from '../MiniComponents/CheckoutForm/CheckoutForm';
import axios from 'axios';
import { baseURL } from '../../config/serverConfig';
import PaymentForm from '../MiniComponents/PaymentForm/PaymentForm';
import "./Checkout.scss";

function Checkout() {
    const [isCancel, setIsCancel] = useState(false);
    const [isPayment, setIsPayment] = useState(false);
    const [isOrderFinished, setIsOrderFinished] = useState(false);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: ''
    });
    const {userCart} = useContext(CartContext);

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };
    const handleAddressSubmit = (e) =>{
        e.preventDefault();
    }

    const moveToPayment = () =>{
        setIsPayment(!isPayment);
        console.log({address});
    }
    const handleSubmit = async (e, paymentMethod) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${baseURL}/orders`, {
                userID: userCart.userID,
                address: address,
                cartID: userCart.id,
                items: userCart.items,
                totalPrice: userCart.totalPrice,
                paymentMethod: paymentMethod
            });
            console.log(res.data.message);
        } catch (error) {
            console.log(`Could'nt create order`, error);
        }
        setIsOrderFinished(true);
    };

  return (
    <>
    {!isOrderFinished ? (
        <>
        <CheckoutForm handleChange={handleAddressChange} handleSubmit={handleAddressSubmit} moveToPayment={moveToPayment}/>
        {isPayment && <PaymentForm handleSubmit={handleSubmit}/> }
        </>
    ) : (
        <div className="thankYou">
            <img src="https://media.tenor.com/LEhC5W9BQBIAAAAj/svtl-transparent.gif" alt="" />
            <h1>Thank you for your order!</h1>
            <h2>Your purchase is being processed and will be shipped promptly.</h2>
        </div>
    )}
    
    </>

      

  )
}

export default Checkout
