import TaskList from "./TaskList";

function CategoryPage({
  category,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleImportant,
  onToggleSubtask,
}) {
  const categoryTasks = tasks.filter((task) => task.category === category);

  return (
    <div className={`${category.toLowerCase()}-page category-page`}>
      <TaskList
        title={category}
        subtitle={`Manage your ${category.toLowerCase()} tasks.`}
        tasks={categoryTasks}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        onToggleImportant={onToggleImportant}
        onToggleSubtask={onToggleSubtask}
        emptyTitle={`No ${category.toLowerCase()} tasks yet`}
        emptySubtitle={`Add a new task in the ${category} category.`}
      />
    </div>
  );
}

export default CategoryPage;
