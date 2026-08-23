import { X } from "lucide-react";

function AddTaskModal({
    task,
    onClose,
    onAddTask,
    onUpdateTask,
  }) {
  function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const taskData = {
      title: formData.get("title"),
      category: formData.get("category"),
      time: formData.get("time"),
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
                defaultValue={task?.category || "Study"}
              >
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
                defaultValue={task?.time || ""}
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