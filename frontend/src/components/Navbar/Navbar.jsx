import React from 'react'
import { UserContext } from '../../context/User'
import { useContext ,useState} from 'react'
import { NavLink, Link } from 'react-router-dom';
import { isModerator } from '../../config/roles';
import "./Navbar.scss"

function Navbar() {
  const {user, signOut, token} = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = ()=>{
    setIsOpen(!isOpen);
  }

  const closeMenu = () => {
    setIsOpen(false); 
  };

  return (
    <header className="siteHeader">
      <nav className="navBar">
      <div className="navContainer">
      <Link to="/" className="navLogo">
        <img src="https://i.pinimg.com/originals/ae/d6/b5/aed6b55143050c6762ed415f1cde83c5.png" alt="wof-logo" width={36} height={36} />
        <span className="navBrand">World of Formula</span>
      </Link>
      <div className={`navItems ${isOpen ? 'active' : ''}`}>
        <div className="hamburger" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <ul>
          <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/products" onClick={closeMenu}>Products</NavLink></li>
          {user && <li><NavLink to={`/cart/${user.id}`} onClick={closeMenu}>Cart</NavLink></li>}
          {user && <li><NavLink to={`/account/${user.id}`} onClick={closeMenu}>My Account</NavLink></li>}
          {isModerator(user) && <li><NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink></li>}
          {user ? (
            <li><button type="button" className="navSignOut" onClick={signOut}><i className="bi bi-box-arrow-left"></i> Sign out, <b>{user.fullName}</b></button></li>
          ) : (
            <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
          )}
        </ul>
      </div>
      </div>
    </nav>
    </header>
  )
}

export default Navbar
