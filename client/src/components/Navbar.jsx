import { Search, Bell, LogOut, Menu } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Navbar({ user, onMenuClick }) {
  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
        <button className="icon-button menu-button" onClick={onMenuClick} aria-label="Open navigation menu">
          <Menu size={19} />
        </button>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dashboard</h1>
          <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Welcome back, {user?.email || "User"} 👋</p>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="icon-button">
          <Search size={19} />
        </button>

        <button className="icon-button">
          <Bell size={19} />
        </button>

        <button 
          className="icon-button" 
          onClick={() => signOut(auth)} 
          title="Log Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;