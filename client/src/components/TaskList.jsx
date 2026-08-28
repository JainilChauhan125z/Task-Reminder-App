import { useState } from "react";
import { Check, Clock, Pencil, Trash2, Star, Repeat, ChevronDown, ChevronUp, ListChecks } from "lucide-react";

function TaskList({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onViewAll,
  onToggleImportant, onToggleSubtask,
  title = "Today's Tasks",
  subtitle = "Stay on top of what needs to be done.",
  emptyTitle = "No tasks found",
  emptySubtitle = "Try changing your search or filters.",
  children
}) {
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  
  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <section className="tasks-section">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="section-actions">
          {onViewAll && (
            <button
              className="view-all-button"
              onClick={onViewAll}
            >
              View All
            </button>
          )}
          {onAddTask && (
            <button
              className="add-task-button"
              onClick={onAddTask}
            >
              + Add Task
            </button>
          )}
        </div>
      </div>

      {children}

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">{emptyTitle}</p>
            <p className="empty-subtitle">{emptySubtitle}</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isOverdue = task.date && task.date < todayISO && !task.completed;
            const subtasksCount = task.subtasks?.length || 0;
            const completedSubtasksCount = task.subtasks?.filter(st => st.completed).length || 0;
            const isExpanded = expandedTasks.has(task.id);
            
            return (
            <div className={`task-item-container ${isOverdue ? "overdue-container" : ""}`} key={task.id}>
            <div className={`task-item ${isOverdue ? "overdue" : ""}`}>
            <button
              className={`task-check ${
                task.completed ? "completed" : ""
              } ${isOverdue ? "overdue" : ""}`}
              onClick={() => onToggleTask(task.id)}
            >
              {task.completed && <Check size={16} />}
            </button>

            <div className="task-info">
              <h3 className={`${task.completed ? "task-done" : ""} ${isOverdue ? "text-overdue" : ""}`}>
                {task.title}
              </h3>

              <div className="task-meta">
                <span>{task.category}</span>

                {task.priority && (
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                )}

                {task.repeat && task.repeat !== 'none' && (
                  <span className="recurrence-indicator">
                    <Repeat size={12} />
                    {task.repeat.charAt(0).toUpperCase() + task.repeat.slice(1)}
                  </span>
                )}

                <span>
                  <Clock size={14} />
                  {task.date ? `${new Date(task.date).toLocaleDateString()} ` : ""}
                  {task.time ? new Date(`1970-01-01T${task.time}`).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  }) : ""}
                </span>

                {subtasksCount > 0 && (
                  <button 
                    className="subtask-toggle-button"
                    onClick={() => toggleExpand(task.id)}
                  >
                    <ListChecks size={14} />
                    {completedSubtasksCount}/{subtasksCount} subtasks
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
              </div>
            </div>
            <div className="task-actions">
                {onToggleImportant && (
                  <button
                    className={`task-action-button ${task.important ? 'important-active' : ''}`}
                    onClick={() => onToggleImportant(task.id)}
                    title={task.important ? "Remove from important" : "Mark as important"}
                  >
                    <Star 
                      size={16} 
                      fill={task.important ? "currentColor" : "none"} 
                      className={task.important ? "text-yellow-500" : ""}
                    />
                  </button>
                )}
                <button
                  className="task-action-button"
                  onClick={() => onEditTask(task)}
                  title="Edit task"
                >
                  <Pencil size={16} />
                </button>
              <button
                className="task-action-button"
                onClick={() => onDeleteTask(task.id)}
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
            </div>
            
            {subtasksCount > 0 && isExpanded && (
              <div className="subtasks-container">
                {task.subtasks.map(subtask => (
                  <div className="subtask-row" key={subtask.id}>
                    <button
                      className={`subtask-check ${subtask.completed ? "completed" : ""}`}
                      onClick={() => onToggleSubtask && onToggleSubtask(task.id, subtask.id)}
                    >
                      {subtask.completed && <Check size={14} />}
                    </button>
                    <span className={`subtask-title ${subtask.completed ? "completed-text" : ""}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
            </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default TaskList;
