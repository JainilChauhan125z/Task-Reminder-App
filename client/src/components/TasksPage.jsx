import { useState } from "react";
import TaskList from "./TaskList";
import { Search, X } from "lucide-react";

function TasksPage({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleImportant,
  onToggleSubtask,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [importantFilter, setImportantFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Default order");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? !task.completed
        : !!task.completed;
        
    const matchesCategory =
      categoryFilter === "All"
        ? true
        : task.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "All"
        ? true
        : task.priority === priorityFilter;

    const matchesImportant = 
      importantFilter === "All"
        ? true
        : importantFilter === "Important only"
        ? !!task.important
        : true;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesImportant;
  });

  const visibleTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "Date: Earliest first") {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(`${a.date}T${a.time || "00:00"}`) - new Date(`${b.date}T${b.time || "00:00"}`);
    }
    if (sortOption === "Date: Latest first") {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(`${b.date}T${b.time || "00:00"}`) - new Date(`${a.date}T${a.time || "00:00"}`);
    }
    if (sortOption === "Priority: High to Low" || sortOption === "Priority: Low to High") {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      const pA = pMap[a.priority] || 0;
      const pB = pMap[b.priority] || 0;
      if (sortOption === "Priority: High to Low") {
        return pB - pA;
      } else {
        return pA - pB;
      }
    }
    return 0;
  });

  const isFiltered = searchQuery.trim() !== "" || statusFilter !== "All" || categoryFilter !== "All" || priorityFilter !== "All" || importantFilter !== "All" || sortOption !== "Default order";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setImportantFilter("All");
    setSortOption("Default order");
  };

  const taskCountText = visibleTasks.length === 1 ? "1 task" : `${visibleTasks.length} tasks`;

  const hasTasks = tasks.length > 0;
  const emptyTitle = hasTasks ? "No matching tasks" : "No tasks found";
  const emptySubtitle = hasTasks ? "Try changing your search or filters." : "You haven't added any tasks yet.";

  return (
    <div className="tasks-page">
      <TaskList
        title="Tasks"
        subtitle="Manage and organize all your tasks."
        tasks={visibleTasks}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        onToggleImportant={onToggleImportant}
        onToggleSubtask={onToggleSubtask}
        emptyTitle={emptyTitle}
        emptySubtitle={emptySubtitle}
      >
        <div className="tasks-filters-container">
          
          <div className="filters-header">
             <span className="task-count">
               {taskCountText}
             </span>
             {isFiltered && (
               <button onClick={clearFilters} className="clear-filters-btn" aria-label="Clear all filters">
                 <X size={14} /> Clear filters
               </button>
             )}
          </div>

          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search tasks"
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
                  aria-label={`Filter by status: ${status}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="filter-select-group">
                <div className="filter-category">
                <label htmlFor="priority-filter">Priority:</label>
                <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                </div>

                <div className="filter-category">
                <label htmlFor="category-filter">Category:</label>
                <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All</option>
                    <option value="Study">Study</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                </select>
                </div>

                <div className="filter-category">
                <label htmlFor="important-filter">Important:</label>
                <select
                    id="important-filter"
                    value={importantFilter}
                    onChange={(e) => setImportantFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All</option>
                    <option value="Important only">Important only</option>
                </select>
                </div>

                <div className="filter-category">
                <label htmlFor="sort-filter">Sort:</label>
                <select
                    id="sort-filter"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="filter-select"
                >
                    <option value="Default order">Default order</option>
                    <option value="Date: Earliest first">Date: Earliest first</option>
                    <option value="Date: Latest first">Date: Latest first</option>
                    <option value="Priority: High to Low">Priority: High to Low</option>
                    <option value="Priority: Low to High">Priority: Low to High</option>
                </select>
                </div>
            </div>
          </div>
        </div>
      </TaskList>
    </div>
  );
}

export default TasksPage;
