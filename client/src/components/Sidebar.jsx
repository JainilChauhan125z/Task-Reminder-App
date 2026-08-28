import { useEffect } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Star,
  GraduationCap,
  Briefcase,
  Gamepad2,
  Settings,
  X
} from "lucide-react";

function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNav = (page) => {
    onNavigate(page);
    if (onClose) onClose();
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} aria-hidden="true"></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckSquare size={24} />
            <span>TaskFlow</span>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-title">MENU</p>

          <a
            href="#"
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('dashboard');
            }}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a
            href="#"
            className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('tasks');
            }}
          >
            <CheckSquare size={19} />
            <span>Tasks</span>
          </a>

          <a
            href="#"
            className={`nav-item ${currentPage === 'calendar' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('calendar');
            }}
          >
            <CalendarDays size={19} />
            <span>Calendar</span>
          </a>

          <a
            href="#"
            className={`nav-item ${currentPage === 'important' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('important');
            }}
          >
            <Star size={19} />
            <span>Important</span>
          </a>

          <p className="nav-title categories-title">CATEGORIES</p>

          <a
            href="#"
            className={`nav-item ${currentPage === 'study' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('study');
            }}
          >
            <GraduationCap size={19} />
            <span>Study</span>
          </a>

          <a
            href="#"
            className={`nav-item ${currentPage === 'work' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('work');
            }}
          >
            <Briefcase size={19} />
            <span>Work</span>
          </a>

          <a
            href="#"
            className={`nav-item ${currentPage === 'personal' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('personal');
            }}
          >
            <Gamepad2 size={19} />
            <span>Personal</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a 
            href="#" 
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav('settings');
            }}
          >
            <Settings size={19} />
            <span>Settings</span>
          </a>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;