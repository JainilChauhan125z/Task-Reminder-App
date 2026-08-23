import { Search, Bell, User } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back, Jainil 👋</p>
      </div>

      <div className="navbar-actions">
        <button className="icon-button">
          <Search size={19} />
        </button>

        <button className="icon-button">
          <Bell size={19} />
        </button>

        <button className="profile-button">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;