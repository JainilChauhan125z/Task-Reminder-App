import {
  CheckSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase/firebase";
import { useEffect, useState } from "react";
import AddTaskModal from "./components/AddTaskModal";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import TaskList from "./components/TaskList";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import TasksPage from "./components/TasksPage";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";
import "./Auth.css";

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Auth States
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authPage, setAuthPage] = useState('login');

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,  (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (!user) return;

  async function fetchTasks() {
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(tasksQuery);

        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTasks(fetchedTasks);

        console.log("Tasks fetched:", fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, [user]);

  async function handleAddTask(newTask) {
    try {
      const taskData = {
        ...newTask,
        userId: user.uid,
      };

      const docRef = await addDoc(
        collection(db, "tasks"),
        taskData
      );

      const taskWithId = {
        id: docRef.id,
        ...taskData,
      };

      setTasks((currentTasks) => [
        ...currentTasks,
        taskWithId,
      ]);

      setShowAddTask(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  async function handleToggleTask(id) {
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return;

    try {
      const taskDocRef = doc(db, "tasks", id);
      await updateDoc(taskDocRef, {
        completed: !taskToToggle.completed,
      });
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? { ...task, completed: !task.completed }
            : task
        )
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  }

  function handleDeleteTask(id) {
    setTaskToDelete(id);
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;

    try {
      await deleteDoc(doc(db, "tasks", taskToDelete));
      
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskToDelete)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }

    setTaskToDelete(null);
  }

  function cancelDeleteTask() {
    setTaskToDelete(null);
  }

  function handleEditTask(task) {
    setTaskToEdit(task);
  }

  async function handleUpdateTask(updatedTask) {
    try {
      const taskDocRef = doc(db, "tasks", updatedTask.id);
      await updateDoc(taskDocRef, {
        title: updatedTask.title,
        category: updatedTask.category,
        time: updatedTask.time,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setTaskToEdit(null);
  }

  if (authLoading) {
    return <div className="loading-container">Loading TaskFlow...</div>;
  }

  if (!user) {
    return authPage === 'login' ? (
      <Login onSwitchToRegister={() => setAuthPage('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthPage('login')} />
    );
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="main-content">
        <Navbar user={user} />

        {currentPage === 'dashboard' ? (
          <>
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
          </>
        ) : (
          <TasksPage
            tasks={tasks}
            onAddTask={() => setShowAddTask(true)}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        )}
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