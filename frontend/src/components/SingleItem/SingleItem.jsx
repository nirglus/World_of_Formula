import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../config/serverConfig";
import { CartContext } from "../../context/Cart";
import placeholderImage from "../../assets/no-image.png";
import loading from "../../assets/loading.gif";
import "./SingleItem.scss";
import AddToCartModal from "../AddToCartModal/AddToCartModal";
import ImageSlider from "../MiniComponents/ImageSlider/ImageSlider";
import SingleItemDesc from "../MiniComponents/SingleItemDesc/SingleItemDesc";

function SingleItem() {
  let { id: itemID } = useParams();
  const [item, setItem] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart, userCart } = useContext(CartContext);
  const [itemImages, setItemImages] = useState(null);
  const dialog = useRef();

  const getItem = async (itemID) => {
    try {
      const singleItem = await axios.get(`${baseURL}/products/${itemID}`);
      setItem(singleItem.data);
      console.log("Got product succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    const productID = item.id;
    console.log({ userCart });
    const cartID = userCart.id;
    const price = item.price;
    addItemToCart({ productID, cartID, price, quantity });
    dialog.current.open();
  };

  useEffect(() => {
    getItem(itemID);
  }, [itemID]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (item.images && item.images.length > 0) {
      setItemImages(item.images);
    } else if (item.image) {
      setItemImages([
        {
          url: item.image,
          title: "item-image",
        },
      ]);
    }
  }, [item]);

  return (
    <>
      <AddToCartModal ref={dialog} />
      <div className="singleProduct">
        {itemImages ? (
          <>
            <div className="productImages">
              <ImageSlider slides={itemImages} />
            </div>
            <SingleItemDesc
              item={item}
              quantity={quantity}
              itemPrice={(item.price * quantity).toFixed(2)}
              handleDecrement={handleDecrement}
              handleIncrement={handleIncrement}
              handleAddToCart={handleAddToCart}
            />
          </>
        ) : (
          <div className="loading">
            <img src={loading} alt="loading" />
          </div>
        )}
      </div>
    </>
  );
}

export default SingleItem;
