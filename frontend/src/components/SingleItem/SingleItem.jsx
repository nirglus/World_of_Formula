import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { baseURL } from "../../config/serverConfig";
import { CartContext } from "../../context/Cart";
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
    const productID = item.id ?? item._id;
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
      setItemImages([{ url: item.image, title: "item-image" }]);
    } else if (item.id || item._id) {
      setItemImages([]);
    }
  }, [item]);

  const showSkeleton = !(item.id ?? item._id);

  return (
    <>
      <AddToCartModal ref={dialog} />
      <div className="singleProduct">
        {showSkeleton ? (
          <div className="singleProductSkeleton" aria-busy="true" aria-label="Loading product">
            <div className="skeletonProductImage skeleton" />
            <div className="skeletonProductDesc">
              <div className="skeleton skeletonBadge" />
              <div className="skeleton skeletonTitle" />
              <div className="skeleton skeletonPrice" />
              <div className="skeleton skeletonMeta" />
              <div className="skeleton skeletonPurchaseRow" />
            </div>
          </div>
        ) : (
          <div className="singleProductContent">
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
          </div>
        )}
      </div>
    </>
  );
}

export default SingleItem;
