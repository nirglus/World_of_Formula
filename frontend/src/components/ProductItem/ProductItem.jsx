import { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/Cart';
import { UserContext } from '../../context/User';
import axios from 'axios';
import { baseURL } from '../../config/serverConfig';
import { computeBadges } from '../../helpers/productBadges';
import './ProductItem.scss';
import placeholderImage from '../../assets/no-image.png';
import AddToCartModal from '../AddToCartModal/AddToCartModal';

const CLICKABLE_BADGES = ['new', 'limited'];
const LABELS = { new: 'New', limited: 'Limited', bestSeller: 'Best Seller' };
const TITLES = { limited: 'Limited availability', new: 'Filter by new arrivals' };

function ProductItem({ product, isAdmin, onDelete, setProducts, onBadgeClick, activeFilterNew, activeFilterLimited }) {
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart, userCart } = useContext(CartContext);
  const { headers, user } = useContext(UserContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imageError, setImageError] = useState(false);
  const dialog = useRef();
  const hasValidImage = product.image && !imageError;
  const badges = computeBadges(product);

  const handleEdit = () => setIsEditMode(!isEditMode);

  const handleSave = async () => {
    try {
      const res = await axios.patch(`${baseURL}/products/${product._id}`, editedProduct, { headers });
      setIsEditMode(false);
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p._id === res.data._id);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = res.data;
        return next;
      });
    } catch (error) {
      console.error('Failed to save product changes', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = () => onDelete(product._id);
  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => quantity > 1 && setQuantity((q) => q - 1);

  const handleAddToCart = () => {
    if (userCart?.id) {
      addItemToCart({ cartID: userCart.id, productID: product._id, price: product.price, quantity });
      dialog.current.open();
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImgSrc(placeholderImage);
  };

  const isActive = (type) => (type === 'new' && activeFilterNew) || (type === 'limited' && activeFilterLimited);

  return (
    <>
      {isEditMode ? (
        <div className="productPreview editPreview">
          <img src={imgSrc} alt={product.title} width={250} onError={handleImageError} />
          <input type="text" name="title" value={editedProduct.title} onChange={handleChange} />
          <input type="text" name="description" value={editedProduct.description} onChange={handleChange} />
          <input type="text" name="scale" value={editedProduct.scale} onChange={handleChange} />
          <input type="number" name="totalQuantity" value={editedProduct.totalQuantity} onChange={handleChange} />
          <input type="number" name="price" value={editedProduct.price} onChange={handleChange} />
          <div className="editBtns">
            <button className="saveBtn" onClick={handleSave}><i className="bi bi-check-lg"></i></button>
            <button className="deleteBtn" onClick={handleEdit}><i className="bi bi-x-lg"></i></button>
          </div>
        </div>
      ) : (
        <div className="productCard">
          <div className="productImageWrap">
            {badges.length > 0 && (
              <div className="productBadges">
                {badges.map((b) => {
                  const clickable = CLICKABLE_BADGES.includes(b.type) && onBadgeClick;
                  const content = (
                    <>
                      {b.type === 'new' && <span className="badgeDot" />}
                      {LABELS[b.type]}
                    </>
                  );
                  if (clickable) {
                    return (
                      <button
                        key={b.type}
                        type="button"
                        className={`badgePill badge-${b.type} ${b.urgent ? 'badge-urgent' : ''} ${isActive(b.type) ? 'badgeActive' : ''}`}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBadgeClick(b.type); }}
                        title={TITLES[b.type]}
                        aria-label={TITLES[b.type]}
                      >
                        {content}
                      </button>
                    );
                  }
                  return (
                    <span key={b.type} className={`badgePill badge-${b.type} ${b.urgent ? 'badge-urgent' : ''}`}>
                      {content}
                    </span>
                  );
                })}
              </div>
            )}
            {hasValidImage ? (
              <img src={imgSrc} alt={product.title} onError={handleImageError} />
            ) : (
              <div className="noImage">No image</div>
            )}
            <span className="stockBadge">{product.totalQuantity} in stock</span>
          </div>
          <div className="productCardBody">
            <span className="productMeta">Diecast model</span>
            <h3 className="productTitle"><Link to={`/products/${product._id}`}>{product.title}</Link></h3>
            <p className="productPrice">${(quantity * product.price).toFixed(2)}</p>
            <div className="quantityRow">
              <span className="quantityLabel">Qty</span>
              <div className="quantityControls">
                <button type="button" className="quantityBtn" onClick={handleDecrement} aria-label="Decrease">−</button>
                <span className="quantityValue">{quantity}</span>
                <button type="button" className="quantityBtn" onClick={handleIncrement} aria-label="Increase">+</button>
              </div>
            </div>
            <button type="button" className="addToCartBtn" onClick={handleAddToCart}>
              <i className="bi bi-cart-plus"></i> Add to cart
            </button>
            {isAdmin && (
              <div className="adminBtns">
                <button type="button" className="editBtn" onClick={handleEdit} title="Edit"><i className="bi bi-pencil-square"></i></button>
                <button type="button" className="deleteBtn" onClick={handleDelete} title="Disable"><i className="bi bi-x-lg"></i></button>
              </div>
            )}
          </div>
        </div>
      )}
      <AddToCartModal ref={dialog} user={user} />
    </>
  );
}

export default ProductItem;
