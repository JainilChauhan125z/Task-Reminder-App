import { Target } from "lucide-react";

function ProgressCard({ todayTotal, todayCompleted }) {
  let content;

  if (todayTotal === 0) {
    content = (
      <div className="progress-info">
        <p className="progress-text">No tasks scheduled for today.</p>
      </div>
    );
  } else {
    const percentage = Math.round((todayCompleted / todayTotal) * 100);
    
    content = (
      <>
        <div className="progress-info">
          <div>
            <p className="progress-label">Today's Progress</p>
            <p className="progress-text">{todayCompleted} of {todayTotal} tasks completed</p>
          </div>
          <h2 className="progress-percentage">{percentage}%</h2>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </>
    );
  }

  return (
    <div className="progress-card">
      <div className="progress-header">
        <div className="progress-icon">
          <Target size={20} />
        </div>
        <h3>Daily Progress</h3>
      </div>
      {content}
    </div>
  );
}

export default ProgressCard;
