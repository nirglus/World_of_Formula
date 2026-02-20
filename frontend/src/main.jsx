import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserProvider from './context/User.jsx'
import CartProvider from './context/Cart.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(

  // <React.StrictMode>
  <CartProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </CartProvider>
  // </React.StrictMode>,
)
