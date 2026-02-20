import "./AccountSidebar.scss";
function AccountSidebar({setSelectedComponent, selectedComponent, user}) {
  
  const handleClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="sidebar">
      <div className="titles">
          <h3>Hello, {user?.fullName}!</h3>
          <div className="avatar"></div>

      </div>
      <div className="spans">
        <span className={`dashLink ${selectedComponent === 'orders' ? 'active' : ''}`} onClick={() => handleClick('orders')}>
        <i className="bi bi-receipt-cutoff"></i> My Orders
        </span>
        <span className={`dashLink ${selectedComponent === 'settings' ? 'active' : ''}`} onClick={() => handleClick('settings')}>
         <i className="bi bi-gear-fill"></i> Settings
        </span>
      </div>

  </div>
  )
}

export default AccountSidebar
