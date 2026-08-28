import TaskList from "./TaskList";

function ImportantPage({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleImportant,
  onToggleSubtask,
}) {
  const importantTasks = tasks.filter((task) => task.important === true);

  return (
    <div className="important-page">
      <TaskList
        title="Important"
        subtitle="Tasks you've marked as important."
        tasks={importantTasks}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        onToggleImportant={onToggleImportant}
        onToggleSubtask={onToggleSubtask}
        emptyTitle="No important tasks"
        emptySubtitle="Star a task to keep it here for quick access."
      />
    </div>
  );
}

export default ImportantPage;
