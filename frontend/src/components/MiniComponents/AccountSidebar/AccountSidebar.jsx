import "./AccountSidebar.scss";

function getInitials(fullName) {
  if (!fullName || typeof fullName !== "string") return "?";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0] && parts[0][0]) ? parts[0][0].toUpperCase() : "?";
}

function AccountSidebar({ setSelectedComponent, selectedComponent, user }) {
  const handleClick = (component) => setSelectedComponent(component);
  const fullName = user?.fullName || "";
  const initials = getInitials(fullName);

  return (
    <aside className="accountSidebar" aria-label="Account navigation">
      <div className="accountSidebarHeader">
        <div className="accountSidebarAvatar" aria-hidden="true">
          {initials}
        </div>
        <div className="accountSidebarGreeting">
          <h2 className="accountSidebarTitle">Hello, {fullName || "User"}!</h2>
          <p className="accountSidebarSubtitle">Account</p>
        </div>
      </div>
      <nav className="accountSidebarNav">
        <button
          type="button"
          className={`accountSidebarLink ${selectedComponent === "orders" ? "accountSidebarLinkActive" : ""}`}
          onClick={() => handleClick("orders")}
        >
          <i className="bi bi-receipt-cutoff" aria-hidden="true" />
          My Orders
        </button>
        <button
          type="button"
          className={`accountSidebarLink ${selectedComponent === "settings" ? "accountSidebarLinkActive" : ""}`}
          onClick={() => handleClick("settings")}
        >
          <i className="bi bi-gear-fill" aria-hidden="true" />
          Settings
        </button>
      </nav>
    </aside>
  );
}

export default AccountSidebar
