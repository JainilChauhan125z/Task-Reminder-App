import { CheckCircle2 } from "lucide-react";

function StatCard({ title, value, icon: Icon = CheckCircle2 }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;