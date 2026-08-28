import { useMemo } from "react";
import StatCard from "./StatCard";
import TaskList from "./TaskList";
import ProgressCard from "./ProgressCard";
import { CheckSquare, Clock, CheckCircle2, AlertCircle, Flame } from "lucide-react";

function DashboardPage({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onToggleImportant,
  onToggleSubtask,
  onNavigate,
}) {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 1. TODAY'S PROGRESS
  const todayTasks = tasks.filter((task) => task.date === todayString);
  const todayTotal = todayTasks.length;
  const todayCompleted = todayTasks.filter((task) => task.completed).length;

  // 2. PRODUCTIVITY SUMMARY (Quick Stats)
  const completedToday = todayCompleted;
  const remainingToday = todayTotal - todayCompleted;
  const overdueTasksCount = tasks.filter(
    (task) => task.date && task.date < todayString && !task.completed
  ).length;
  const importantPendingCount = tasks.filter(
    (task) => task.important && !task.completed
  ).length;

  // 3. PRIORITY / FOCUS SECTION
  const priorityScore = {
    "High": 3,
    "Medium": 2,
    "Low": 1
  };

  const focusTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          !task.completed &&
          (task.important || (task.date && task.date <= todayString))
      )
      .sort((a, b) => {
        const aIsOverdue = a.date && a.date < todayString;
        const bIsOverdue = b.date && b.date < todayString;

        const aGroup = a.important && aIsOverdue ? 4 
                     : a.important && a.date === todayString ? 3 
                     : !a.important && aIsOverdue ? 2 
                     : 1;

        const bGroup = b.important && bIsOverdue ? 4 
                     : b.important && b.date === todayString ? 3 
                     : !b.important && bIsOverdue ? 2 
                     : 1;

        if (aGroup !== bGroup) return bGroup - aGroup;

        const aPriority = priorityScore[a.priority] || 0;
        const bPriority = priorityScore[b.priority] || 0;
        if (aPriority !== bPriority) return bPriority - aPriority;

        return (a.date || "").localeCompare(b.date || "");
      })
      .slice(0, 5);
  }, [tasks, todayString]);

  // 4. UPCOMING TASKS
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((task) => task.date && task.date > todayString && !task.completed)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [tasks, todayString]);

  // 5. COMPLETION STREAK
  const streak = useMemo(() => {
    const datedTasks = tasks.filter(t => t.date && t.date <= todayString);
    const tasksByDate = {};
    
    datedTasks.forEach(t => {
      if (!tasksByDate[t.date]) tasksByDate[t.date] = [];
      tasksByDate[t.date].push(t);
    });

    const datesDescending = Object.keys(tasksByDate).sort((a, b) => b.localeCompare(a));
    
    let currentStreak = 0;
    for (const date of datesDescending) {
      const dayTasks = tasksByDate[date];
      if (dayTasks.length > 0) {
        const allCompleted = dayTasks.every(t => t.completed);
        if (allCompleted) {
          currentStreak++;
        } else {
          if (date === todayString) {
            continue;
          } else {
            break;
          }
        }
      }
    }
    return currentStreak;
  }, [tasks, todayString]);

  return (
    <>
      <div className="dashboard-top-widgets">
        <div className="dashboard-progress-widget">
          <ProgressCard
            todayTotal={todayTotal}
            todayCompleted={todayCompleted}
          />
        </div>
        <div className="streak-card">
          <div className="streak-icon">
            <Flame size={28} />
          </div>
          <div className="streak-info">
            <h3>{streak} Day{streak !== 1 ? 's' : ''}</h3>
            <p>Active Streak</p>
          </div>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard
          title="Completed Today"
          value={completedToday}
          icon={CheckCircle2}
        />
        <StatCard
          title="Remaining Today"
          value={remainingToday}
          icon={Clock}
        />
        <StatCard
          title="Overdue"
          value={overdueTasksCount}
          icon={AlertCircle}
        />
        <StatCard
          title="Important Pending"
          value={importantPendingCount}
          icon={CheckSquare}
        />
      </section>

      <div className="dashboard-content">
        <div className="dashboard-column">
          <TaskList
            title="Focus Tasks"
            subtitle="Prioritized incomplete tasks needing attention."
            tasks={focusTasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onToggleImportant={onToggleImportant}
            onToggleSubtask={onToggleSubtask}
            emptyTitle="All caught up!"
            emptySubtitle="No priority tasks currently pending."
          />
        </div>
        <div className="dashboard-column">
          <TaskList
            title="Upcoming Tasks"
            subtitle="Here's what's scheduled next."
            tasks={upcomingTasks}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onToggleImportant={onToggleImportant}
            onToggleSubtask={onToggleSubtask}
            onViewAll={() => onNavigate('tasks')}
            emptyTitle="No upcoming tasks"
            emptySubtitle="Your schedule is clear."
          />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
