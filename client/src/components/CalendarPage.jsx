import { useState, useMemo } from "react";
import TaskList from "./TaskList";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

// Helper to format local date to YYYY-MM-DD
function toLocalISOString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function CalendarPage({ tasks, onAddTask, onToggleTask, onDeleteTask, onEditTask, onToggleImportant, onToggleSubtask }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    // set to 1st of the month
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [selectedDate, setSelectedDate] = useState(() => toLocalISOString(new Date()));

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of current month
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Last day of current month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Previous month overflow days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        dateString: toLocalISOString(d),
        dayNum: d.getDate(),
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        dateString: toLocalISOString(d),
        dayNum: i,
        isCurrentMonth: true,
      });
    }
    
    // Next month overflow days (fill grid to 42 cells = 6 weeks)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        dateString: toLocalISOString(d),
        dayNum: i,
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
    setSelectedDate(toLocalISOString(newMonth));
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
    setSelectedDate(toLocalISOString(newMonth));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(toLocalISOString(today));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Selected date tasks for TaskList
  const selectedTasks = tasks.filter(task => task.date === selectedDate);
  const undatedTasks = tasks.filter(task => !task.date);
  
  const completedCount = selectedTasks.filter(t => t.completed).length;
  const remainingCount = selectedTasks.length - completedCount;
  
  // Format selected date for display without dealing with strict timezones
  const selectedDateObj = new Date(selectedDate + "T00:00:00");
  const todayStr = toLocalISOString(new Date());

  return (
    <div className="calendar-page">
      <div className="calendar-header-section section-header">
        <div>
          <h2>Calendar</h2>
          <p>Plan your schedule and view upcoming tasks.</p>
        </div>
        <div className="calendar-controls">
          <button className="icon-button" onClick={handlePrevMonth} title="Previous Month">
            <ChevronLeft size={20} />
          </button>
          <h3 className="current-month-display">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button className="icon-button" onClick={handleNextMonth} title="Next Month">
            <ChevronRight size={20} />
          </button>
          <button className="add-task-button today-button" onClick={handleToday}>
            Today
          </button>
        </div>
      </div>

      <div className="calendar-grid-container">
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {calendarDays.map((dayObj) => {
            const dayTasks = tasks.filter(t => t.date === dayObj.dateString);
            const isSelected = selectedDate === dayObj.dateString;
            const isToday = dayObj.dateString === todayStr;

            return (
              <div 
                key={dayObj.dateString} 
                className={`calendar-cell ${!dayObj.isCurrentMonth ? 'overflow-day' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => setSelectedDate(dayObj.dateString)}
              >
                <div className="cell-header">
                  <span className="day-number">{dayObj.dayNum}</span>
                </div>
                <div className="cell-tasks">
                  {dayTasks.slice(0, 2).map(task => {
                    const isOverdue = task.date < todayStr && !task.completed;
                    return (
                      <div key={task.id} className={`mini-task ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`} title={task.title}>
                        <span className={`mini-priority-dot priority-${task.priority?.toLowerCase() || 'none'}`}></span>
                        <span className="mini-task-title">{task.title}</span>
                      </div>
                    );
                  })}
                  {dayTasks.length > 2 && (
                    <div className="more-tasks-indicator">+{dayTasks.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-tasks-section">
        <div className="selected-date-summary">
          <div className="summary-header">
            <h3>Tasks for {selectedDateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <button className="add-task-button" onClick={() => onAddTask(selectedDate)}>+ Add Task</button>
          </div>
          <div className="summary-stats">
            <span className="stat-pill">{selectedTasks.length} tasks</span>
            <span className="stat-pill success">✓ {completedCount} completed</span>
            <span className="stat-pill pending">{remainingCount} remaining</span>
          </div>
        </div>
        
        <TaskList
          tasks={selectedTasks}
          title=""
          subtitle=""
          emptyTitle="No tasks scheduled"
          emptySubtitle="Enjoy your free time or add a new task for this day."
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onToggleImportant={onToggleImportant}
          onToggleSubtask={onToggleSubtask}
        />
      </div>

      {undatedTasks.length > 0 && (
        <div className="calendar-tasks-section undated-section">
          <div className="selected-date-summary">
            <div className="summary-header">
              <h3><AlertCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Undated Tasks ({undatedTasks.length})</h3>
            </div>
            <TaskList
              tasks={undatedTasks}
              title=""
              subtitle=""
              emptyTitle=""
              emptySubtitle=""
              onAddTask={() => onAddTask("")}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onToggleImportant={onToggleImportant}
              onToggleSubtask={onToggleSubtask}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
