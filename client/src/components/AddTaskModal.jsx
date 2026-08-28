import { useState, useEffect } from "react";
import { X } from "lucide-react";

function AddTaskModal({
    task,
    onClose,
    onAddTask,
    onUpdateTask,
    initialDate
  }) {
  const [dateStr, setDateStr] = useState(task?.date || initialDate || "");
  const [timeStr, setTimeStr] = useState(task?.time || "");
  const [repeat, setRepeat] = useState(task?.repeat || "none");
  const [reminder, setReminder] = useState(
    task 
      ? (task.reminder !== undefined && task.reminder !== null ? String(task.reminder) : "null") 
      : localStorage.getItem("defaultReminder") || "null"
  );
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);

  const hasDateTime = dateStr !== "" && timeStr !== "";

  useEffect(() => {
    if (!hasDateTime) {
      setReminder("null");
    }
  }, [hasDateTime]);

  function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

    const taskData = {
      title: formData.get("title"),
      category: formData.get("category"),
      date: formData.get("date"),
      time: formData.get("time"),
      priority: formData.get("priority"),
      reminder: hasDateTime && reminder !== "null" ? Number(reminder) : null,
      repeat: formData.get("repeat"),
      recurrenceId: task?.recurrenceId || (formData.get("repeat") !== "none" ? Date.now().toString(36) + Math.random().toString(36).substring(2) : null),
      subtasks: subtasks.filter(st => st.title.trim() !== ""),
    };

    if (task) {
      onUpdateTask({
        ...task,
        ...taskData,
      });
    } else {
      onAddTask({
        ...taskData,
        completed: false,
      });
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>{task ? "Edit Task" : "Add New Task"}</h2>
            <p>
              {task
              ? "Update the details of your task."
              : "Create a task to stay organized."}
            </p>
          </div>

          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              name="title"
              type="text"
              placeholder="e.g. Practice DSA"
              defaultValue={task?.title || ""}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-category">Category</label>

              <select
                id="task-category"
                name="category"
                defaultValue={task?.category || localStorage.getItem("defaultCategory") || "Study"}
              >
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>

              <select
                id="task-priority"
                name="priority"
                defaultValue={task?.priority || localStorage.getItem("defaultPriority") || "Medium"}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-date">Date</label>

              <input
                id="task-date"
                name="date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-time">Time</label>

              <input
                id="task-time"
                name="time"
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="task-repeat">Repeat</label>
              <select
                id="task-repeat"
                name="repeat"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {hasDateTime && (
            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label htmlFor="task-reminder">Reminder</label>
                <select
                  id="task-reminder"
                  name="reminder"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                >
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
          )}

          <div className="form-group" style={{ marginTop: '24px' }}>
            <label>Subtasks</label>
            <div className="subtasks-list">
              {subtasks.map((st) => (
                <div key={st.id} className="subtask-edit-row">
                  <input
                    type="text"
                    value={st.title}
                    placeholder="Subtask description"
                    onChange={(e) => setSubtasks(subtasks.map(s => s.id === st.id ? { ...s, title: e.target.value } : s))}
                    className="subtask-input"
                  />
                  <button type="button" className="remove-subtask-button" onClick={() => setSubtasks(subtasks.filter(s => s.id !== st.id))}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-subtask-button"
              onClick={() => setSubtasks([...subtasks, { id: Date.now().toString(36) + Math.random().toString(36).substring(2), title: "", completed: false }])}
            >
              + Add Subtask
            </button>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit"                   className="submit-button">
              {task ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;