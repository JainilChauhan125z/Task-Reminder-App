import { Search, Bell, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Navbar({ user }) {
  return (
    <header className="navbar">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.email || "User"} 👋</p>
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