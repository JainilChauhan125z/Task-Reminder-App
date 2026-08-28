import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function SettingsPage({ user, theme, onThemeChange }) {
  const [defaultPriority, setDefaultPriority] = useState(
    localStorage.getItem("defaultPriority") || "Medium"
  );
  const [defaultCategory, setDefaultCategory] = useState(
    localStorage.getItem("defaultCategory") || "Study"
  );
  const [defaultReminder, setDefaultReminder] = useState(
    localStorage.getItem("defaultReminder") || "null"
  );
  const [notificationPermission, setNotificationPermission] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );

  function handlePriorityChange(e) {
    const value = e.target.value;
    setDefaultPriority(value);
    localStorage.setItem("defaultPriority", value);
  }

  function handleCategoryChange(e) {
    const value = e.target.value;
    setDefaultCategory(value);
    localStorage.setItem("defaultCategory", value);
  }

  function handleReminderChange(e) {
    const value = e.target.value;
    setDefaultReminder(value);
    localStorage.setItem("defaultReminder", value);
  }

  async function requestNotificationPermission() {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  }

  function handleThemeChange(e) {
    const value = e.target.value;
    onThemeChange(value);
  }

  return (
    <div className="settings-page">
      <div className="section-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your account and application preferences.</p>
        </div>
      </div>

      <div className="settings-content dashboard-column">
        {/* Account Section */}
        <div className="tasks-section settings-section">
          <div className="section-header">
            <h3>Account</h3>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={user?.email || ""} readOnly className="readonly-input" />
          </div>
          <button 
            className="delete-button" 
            onClick={() => signOut(auth)}
            style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>

        {/* Appearance Section */}
        <div className="tasks-section settings-section">
          <div className="section-header">
            <h3>Appearance</h3>
          </div>
          <div className="form-group">
            <label>Theme</label>
            <select value={theme} onChange={handleThemeChange}>
              <option value="system">System Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="tasks-section settings-section">
          <div className="section-header">
            <h3>Notifications</h3>
          </div>
          
          <div className="form-group">
            <label>Browser Permission</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '500', color: notificationPermission === 'granted' ? '#16a34a' : notificationPermission === 'denied' ? '#dc2626' : '#64748b' }}>
                {notificationPermission === 'granted' ? 'Granted' : notificationPermission === 'denied' ? 'Denied' : notificationPermission === 'unsupported' ? 'Unsupported Browser' : 'Not Requested'}
              </span>
              {notificationPermission !== 'granted' && notificationPermission !== 'denied' && notificationPermission !== 'unsupported' && (
                <button onClick={requestNotificationPermission} className="add-task-button" style={{ padding: '6px 12px' }}>
                  Enable
                </button>
              )}
            </div>
            {notificationPermission === 'denied' && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px' }}>
                You have blocked notifications in your browser. Please allow them in your browser settings to receive reminders.
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Default Reminder</label>
            <select value={defaultReminder} onChange={handleReminderChange}>
              <option value="null">None</option>
              <option value="0">At time of event</option>
              <option value="5">5 minutes before</option>
              <option value="10">10 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="1440">1 day before</option>
            </select>
          </div>
        </div>

        {/* Task Preferences Section */}
        <div className="tasks-section settings-section">
          <div className="section-header">
            <h3>Task Preferences</h3>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Default Priority</label>
              <select value={defaultPriority} onChange={handlePriorityChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Category</label>
              <select value={defaultCategory} onChange={handleCategoryChange}>
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
