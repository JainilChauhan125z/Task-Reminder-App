import { Check, Clock, Pencil, Trash2 } from "lucide-react";

function TaskList({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  }) {
  return (
    <section className="tasks-section">
      <div className="section-header">
        <div>
          <h2>Today's Tasks</h2>
          <p>Stay on top of what needs to be done.</p>
        </div>

        <button
          className="add-task-button"
          onClick={onAddTask}
        >
          + Add Task
        </button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
        <div className="task-item" key={task.id}>
            <button
              className={`task-check ${
                task.completed ? "completed" : ""
              }`}
              onClick={() => onToggleTask(task.id)}
            >
              {task.completed && <Check size={16} />}
            </button>

            <div className="task-info">
              <h3 className={task.completed ? "task-done" : ""}>
                {task.title}
              </h3>

              <div className="task-meta">
                <span>{task.category}</span>

                <span>
                  <Clock size={14} />
                  {new Date(`1970-01-01T${task.time}`).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="task-actions">
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
        ))}
      </div>
    </section>
  );
}

export default TaskList;