import {
  CheckSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { useState } from "react";
import AddTaskModal from "./components/AddTaskModal";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import TaskList from "./components/TaskList";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

import "./App.css";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Practice DSA",
      time: "10:00",
      category: "Study",
      completed: false,
    },
    {
      id: 2,
      title: "Work on TaskFlow",
      time: "14:00",
      category: "Work",
      completed: false,
    },
    {
      id: 3,
      title: "Submit assignment",
      time: "17:00",
      category: "Study",
      completed: true,
    },
  ]);

  function handleAddTask(newTask) {
    const taskWithId = {
      ...newTask,
      id: Date.now(),
    };
  
    setTasks((currentTasks) => [
      ...currentTasks,
      taskWithId,
    ]);
  
    setShowAddTask(false);
  }

  function handleToggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function handleDeleteTask(id) {
    setTaskToDelete(id);
  }

  function confirmDeleteTask() {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !==   taskToDelete)
    );

    setTaskToDelete(null);
  }

  function cancelDeleteTask() {
    setTaskToDelete(null);
  }

  function handleEditTask(task) {
    setTaskToEdit(task);
  }

  function handleUpdateTask(updatedTask) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );

  setTaskToEdit(null);
}

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="stats-grid">
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            icon={CheckSquare}
          />

          <StatCard
            title="Due Today"
            value={tasks.length}
            icon={Clock}
          />

          <StatCard
            title="Completed"
            value={tasks.filter((task) => task.completed).length}
            icon={CheckCircle2}
          />
        </section>

        <TaskList
          tasks={tasks}
          onAddTask={() => setShowAddTask(true)}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      </main>

      {showAddTask && (
          <AddTaskModal
            onClose={() => setShowAddTask(false)}
            onAddTask={handleAddTask}
          />
        )}

        {taskToEdit && (
          <AddTaskModal
            task={taskToEdit}
            onClose={() => setTaskToEdit(null)}
            onUpdateTask={handleUpdateTask}
          />
        )}
      {taskToDelete !== null && (
        <ConfirmDeleteModal
          onConfirm={confirmDeleteTask}
          onCancel={cancelDeleteTask}
        />
      )}
    </div>
  );
}

export default App;