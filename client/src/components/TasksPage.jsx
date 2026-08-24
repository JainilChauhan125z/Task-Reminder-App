import { useState } from "react";
import TaskList from "./TaskList";
import { Search } from "lucide-react";

function TasksPage({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? !task.completed
        : task.completed;
    const matchesCategory =
      categoryFilter === "All Categories"
        ? true
        : task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="tasks-page">
      <TaskList
        title="Tasks"
        subtitle="Manage and organize all your tasks."
        tasks={filteredTasks}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
      >
        <div className="tasks-filters-container">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-tabs">
              {["All", "Active", "Completed"].map((status) => (
                <button
                  key={status}
                  className={`filter-tab ${
                    statusFilter === status ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="filter-category">
              <label>Category:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All Categories">All Categories</option>
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>
        </div>
      </TaskList>
    </div>
  );
}

export default TasksPage;
