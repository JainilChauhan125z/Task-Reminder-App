import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Star,
  GraduationCap,
  Briefcase,
  Gamepad2,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <CheckSquare size={24} />
        <span>TaskFlow</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-title">MENU</p>

        <a href="#" className="nav-item active">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </a>

        <a href="#" className="nav-item">
          <CheckSquare size={19} />
          <span>Tasks</span>
        </a>

        <a href="#" className="nav-item">
          <CalendarDays size={19} />
          <span>Calendar</span>
        </a>

        <a href="#" className="nav-item">
          <Star size={19} />
          <span>Important</span>
        </a>

        <p className="nav-title categories-title">CATEGORIES</p>

        <a href="#" className="nav-item">
          <GraduationCap size={19} />
          <span>Study</span>
        </a>

        <a href="#" className="nav-item">
          <Briefcase size={19} />
          <span>Work</span>
        </a>

        <a href="#" className="nav-item">
          <Gamepad2 size={19} />
          <span>Personal</span>
        </a>
      </nav>

      <div className="sidebar-bottom">
        <a href="#" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;