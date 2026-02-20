import { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/Cart';
import { UserContext } from '../../context/User';
import axios from 'axios';
import { baseURL } from '../../config/serverConfig';
import './ProductItem.scss';
import placeholderImage from '../../assets/no-image.png';
import AddToCartModal from '../AddToCartModal/AddToCartModal';

function ProductItem({ product, isAdmin, onDelete, setProducts }) {
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart, userCart } = useContext(CartContext);
  const { headers, user } = useContext(UserContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [imgSrc, setImgSrc] = useState(product.image); 
  const dialog = useRef();

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(
        `${baseURL}/products/${product._id}`,
        editedProduct,
        { headers }
      );
      console.log(`Item updated!`, res.data);
      setIsEditMode(false);
      setProducts((prevProducts) => {
        const existingProductIndex = prevProducts.findIndex(
          (product) => product.id === res.data.id
        );
        if (existingProductIndex !== -1) {
          const updatedProducts = [...prevProducts];
          updatedProducts[existingProductIndex] = res.data;
          return updatedProducts;
        }
      });
    } catch (error) {
      console.error('Failed to save product changes', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleDelete = () => {
    onDelete(product._id);
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
    const productID = product.id;
    const cartID = userCart.id;
    const price = product.price;
    addItemToCart({ productID, cartID, price, quantity });
    dialog.current.open();
  };

  const handleImageError = () => {
    setImgSrc(placeholderImage);
  };

  return (
    <>
      {isEditMode ? (
        <div className='productPreview editPreview'>
          <img
            src={imgSrc}
            alt={product.title}
            width={250}
            onError={handleImageError}
          />
          <input
            type='text'
            name='title'
            value={editedProduct.title}
            onChange={handleChange}
          />
          <input
            type='text'
            name='description'
            value={editedProduct.description}
            onChange={handleChange}
          />
          <input
            type='text'
            name='scale'
            value={editedProduct.scale}
            onChange={handleChange}
          />
          <input
            type='number'
            name='totalQuantity'
            value={editedProduct.totalQuantity}
            onChange={handleChange}
          />
          <input
            type='number'
            name='price'
            value={editedProduct.price}
            onChange={handleChange}
          />
          <div className='editBtns'>
            <button className='saveBtn' onClick={handleSave}>
              <i className='bi bi-check-lg'></i>
            </button>
            <button className='deleteBtn' onClick={handleEdit}>
              <i className='bi bi-x-lg'></i>
            </button>
          </div>
        </div>
      ) : (
        <div className='productPreview'>
          <img
            src={imgSrc}
            alt={product.title}
            width={250}
            onError={handleImageError}
          />
          <h2>
            <Link to={`/products/${product.id}`}>{product.title}</Link>
          </h2>
          <p className='productQuantity'>In stock: {product.totalQuantity}</p>
          <p className='price'>${(quantity * product.price).toFixed(2)}</p>
          <div className='quantity'>
            <p>Quantity:</p>
            <button className='quantityBtn' onClick={handleDecrement}>
              -
            </button>
            <span>{quantity}</span>
            <button className='quantityBtn' onClick={handleIncrement}>
              +
            </button>
          </div>
          <button className='addToCartBtn' onClick={handleAddToCart}>
            <i className='bi bi-cart-plus'></i> Add to cart
          </button>
          {isAdmin && (
            <div className='adminBtns'>
              <button className='editBtn' onClick={handleEdit}>
                <i className='bi bi-pencil-square'></i>
              </button>
              <button className='deleteBtn' onClick={handleDelete}>
                <i className='bi bi-x-lg'></i>
              </button>
            </div>
          )}
        </div>
      )}
      <AddToCartModal ref={dialog} user={user}/>
    </>
  );
}

export default ProductItem;
