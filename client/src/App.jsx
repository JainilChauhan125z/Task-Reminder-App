import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase/firebase";
import { useEffect, useState, useRef } from "react";
import AddTaskModal from "./components/AddTaskModal";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardPage from "./components/DashboardPage";
import ImportantPage from "./components/ImportantPage";
import TasksPage from "./components/TasksPage";
import CalendarPage from "./components/CalendarPage";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import CategoryPage from "./components/CategoryPage";
import SettingsPage from "./components/SettingsPage";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";
import "./Auth.css";

function calculateNextDate(dateStr, repeat) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split('-').map(Number);
  
  if (repeat === 'daily') {
    const dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() + 1);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } else if (repeat === 'weekly') {
    const dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() + 7);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } else if (repeat === 'monthly') {
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
    }
    const daysInNextMonth = new Date(nextYear, nextMonth, 0).getDate();
    const nextDay = Math.min(day, daysInNextMonth);
    return `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
  }
  
  return dateStr;
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddTask, setShowAddTask] = useState(false);
  const [initialTaskDate, setInitialTaskDate] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const processingTogglesRef = useRef(new Set());
  const spawnedRecurrencesRef = useRef(new Set()); // For in-session rapid click protection
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme effect
  useEffect(() => {
    function applyTheme() {
      let activeTheme = theme;
      if (theme === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      if (activeTheme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme();
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  function handleThemeChange(newTheme) {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

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
      setTasksLoading(true);
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
      } finally {
        setTasksLoading(false);
      }
    }

    fetchTasks();
  }, [user]);

  // Notifications Polling Loop
  useEffect(() => {
    if (!user || tasks.length === 0) return;

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      let notifiedTasks = [];
      try {
        notifiedTasks = JSON.parse(sessionStorage.getItem("notifiedTasks")) || [];
      } catch (e) {
        notifiedTasks = [];
      }

      let newNotifications = false;

      tasks.forEach((task) => {
        if (task.completed || !task.date || !task.time || task.reminder === null || task.reminder === undefined) {
          return;
        }

        const taskTime = new Date(`${task.date}T${task.time}`).getTime();
        const targetTime = taskTime - task.reminder * 60000;

        // 2-minute window to account for background throttling
        if (now >= targetTime && now < targetTime + 120000) {
          if (!notifiedTasks.includes(task.id)) {
            notifiedTasks.push(task.id);
            newNotifications = true;

            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Task Reminder", {
                body: `${task.title} is due ${task.reminder === 0 ? "now" : `in ${task.reminder} minutes`}.`,
              });
            }
          }
        }
      });

      if (newNotifications) {
        sessionStorage.setItem("notifiedTasks", JSON.stringify(notifiedTasks));
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [tasks, user]);

  async function handleAddTask(newTask) {
    try {
      const taskData = {
        ...newTask,
        important: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
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

  async function handleToggleTask(id, options = {}) {
    if (processingTogglesRef.current.has(id)) return;
    processingTogglesRef.current.add(id);

    try {
      const taskToToggle = tasks.find((t) => t.id === id);
      if (!taskToToggle) return;

      const isCompleting = options.forceComplete !== undefined ? options.forceComplete : !taskToToggle.completed;
      
      let finalSubtasks = taskToToggle.subtasks || [];
      if (options.newSubtasks) {
        finalSubtasks = options.newSubtasks;
      } else if (finalSubtasks.length > 0) {
        finalSubtasks = finalSubtasks.map(st => ({ ...st, completed: isCompleting }));
      }

      let shouldSpawn = false;

      // Handle recurrence ONLY when transitioning from incomplete to complete
      if (isCompleting && !taskToToggle.completed && taskToToggle.repeat && taskToToggle.repeat !== 'none' && !taskToToggle.hasSpawnedNext) {
        if (!spawnedRecurrencesRef.current.has(id)) {
          shouldSpawn = true;
          spawnedRecurrencesRef.current.add(id);
        }
      }

      let newTaskWithId = null;

      if (shouldSpawn) {
        const nextDate = calculateNextDate(taskToToggle.date, taskToToggle.repeat);
        
        const nextTaskData = {
          title: taskToToggle.title,
          category: taskToToggle.category,
          priority: taskToToggle.priority,
          date: nextDate,
          time: taskToToggle.time,
          reminder: taskToToggle.reminder !== undefined ? taskToToggle.reminder : null,
          repeat: taskToToggle.repeat,
          recurrenceId: taskToToggle.recurrenceId || id,
          subtasks: finalSubtasks.map(st => ({
            ...st,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            completed: false
          })),
          completed: false,
          important: false,
          userId: user.uid,
          createdAt: serverTimestamp(),
        };

        const newDocRef = await addDoc(collection(db, "tasks"), nextTaskData);
        newTaskWithId = {
          id: newDocRef.id,
          ...nextTaskData,
        };
      }

      const updateData = { completed: isCompleting };
      if (finalSubtasks.length > 0 || options.newSubtasks) {
        updateData.subtasks = finalSubtasks;
      }
      if (shouldSpawn) {
        updateData.hasSpawnedNext = true;
      }

      const taskDocRef = doc(db, "tasks", id);
      await updateDoc(taskDocRef, updateData);

      setTasks((currentTasks) => {
        const updatedTasks = currentTasks.map((task) =>
          task.id === id ? { ...task, ...updateData } : task
        );
        if (newTaskWithId) {
          updatedTasks.push(newTaskWithId);
        }
        return updatedTasks;
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
      spawnedRecurrencesRef.current.delete(id);
    } finally {
      processingTogglesRef.current.delete(id);
    }
  }

  async function handleToggleImportant(id) {
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return;

    try {
      const taskDocRef = doc(db, "tasks", id);
      await updateDoc(taskDocRef, {
        important: !taskToToggle.important,
      });
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? { ...task, important: !task.important }
            : task
        )
      );
    } catch (error) {
      console.error("Error toggling task importance:", error);
    }
  }

  async function handleToggleSubtask(taskId, subtaskId) {
    const taskToToggle = tasks.find((t) => t.id === taskId);
    if (!taskToToggle) return;

    const currentSubtasks = taskToToggle.subtasks || [];
    const updatedSubtasks = currentSubtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const allSubtasksCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);

    if (taskToToggle.completed !== allSubtasksCompleted) {
      await handleToggleTask(taskId, { forceComplete: allSubtasksCompleted, newSubtasks: updatedSubtasks });
    } else {
      try {
        const taskDocRef = doc(db, "tasks", taskId);
        await updateDoc(taskDocRef, { subtasks: updatedSubtasks });
        
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, subtasks: updatedSubtasks } : task
          )
        );
      } catch (error) {
        console.error("Error toggling subtask:", error);
      }
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
        date: updatedTask.date,
        time: updatedTask.time,
        priority: updatedTask.priority,
        reminder: updatedTask.reminder,
        repeat: updatedTask.repeat || "none",
        recurrenceId: updatedTask.recurrenceId || null,
        subtasks: updatedTask.subtasks || [],
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
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="main-content">
        <Navbar user={user} onMenuClick={() => setIsMobileMenuOpen(true)} />

        {tasksLoading ? (
          <div className="loading-container" style={{ marginTop: '40px' }}>Loading tasks...</div>
        ) : currentPage === 'dashboard' ? (
          <DashboardPage
            tasks={tasks}
            onAddTask={(date) => { setShowAddTask(true); setInitialTaskDate(typeof date === 'string' ? date : ""); }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleImportant={handleToggleImportant}
            onToggleSubtask={handleToggleSubtask}
            onNavigate={setCurrentPage}
          />
        ) : currentPage === 'important' ? (
          <ImportantPage
            tasks={tasks}
            onAddTask={(date) => { setShowAddTask(true); setInitialTaskDate(typeof date === 'string' ? date : ""); }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleImportant={handleToggleImportant}
            onToggleSubtask={handleToggleSubtask}
          />
        ) : currentPage === 'calendar' ? (
          <CalendarPage
            tasks={tasks}
            onAddTask={(date) => { setShowAddTask(true); setInitialTaskDate(typeof date === 'string' ? date : ""); }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleImportant={handleToggleImportant}
            onToggleSubtask={handleToggleSubtask}
          />
        ) : currentPage === 'study' ? (
          <CategoryPage
            category="Study"
            tasks={tasks}
            onAddTask={(date) => { setShowAddTask(true); setInitialTaskDate(typeof date === 'string' ? date : ""); }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleImportant={handleToggleImportant}
            onToggleSubtask={handleToggleSubtask}
          />
        ) : currentPage === 'work' ? (
          <CategoryPage
            category="Work"
            tasks={tasks}
            onAddTask={(date) => { setShowAddTask(true); setInitialTaskDate(typeof date === 'string' ? date : ""); }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleImportant={handleToggleImportant}
            onToggleSubtask={handleToggleSubtask}
          />
        ) : currentPage === 'personal' ? (
          <CategoryPage
            category="Personal"
            tasks={tasks}
            onAddTask={(date) => { setShowAddTask(true); setInitialTaskDate(typeof date === 'string' ? date : ""); }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleImportant={handleToggleImportant}
            onToggleSubtask={handleToggleSubtask}
          />
        ) : currentPage === 'settings' ? (
          <SettingsPage 
            user={user} 
            theme={theme} 
            onThemeChange={handleThemeChange} 
          />
        ) : (
          <TasksPage
            tasks={tasks}
            onAddTask={(date) => { setShowAddTask(true); setInitialTaskDate(typeof date === 'string' ? date : ""); }}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onToggleImportant={handleToggleImportant}
            onToggleSubtask={handleToggleSubtask}
          />
        )}
      </main>

      {showAddTask && (
          <AddTaskModal
            initialDate={initialTaskDate}
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
