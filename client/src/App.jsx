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

import "./App.css";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Practice DSA",
      time: "10:00 AM",
      category: "Study",
      completed: false,
    },
    {
      id: 2,
      title: "Work on TaskFlow",
      time: "2:00 PM",
      category: "Work",
      completed: false,
    },
    {
      id: 3,
      title: "Submit assignment",
      time: "5:00 PM",
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
        />
      </main>

      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}

export default App;