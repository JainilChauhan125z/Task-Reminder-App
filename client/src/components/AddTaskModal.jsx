import { X } from "lucide-react";

function AddTaskModal({ onClose, onAddTask }) {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newTask = {
        title: formData.get("title"),
        category: formData.get("category"),
        time: formData.get("time"),
        completed: false,
    };

  onAddTask(newTask);
}

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Add New Task</h2>
            <p>Create a task to stay organized.</p>
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
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-category">Category</label>

              <select id="task-category" name="category" defaultValue="Study">
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-time">Time</label>

              <input
                id="task-time"
                name="time"
                type="time"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="submit-button">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;