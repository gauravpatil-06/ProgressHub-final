import { Target, Award, List } from 'lucide-react';

export default function ProgressSummary({ total, completed }) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="progress-summary glass-container">
            <div className="summary-stats">
                <div className="stat-box">
                    <span className="stat-label">
                        <Target size={16} color="var(--accent-primary)" />
                        Total Lectures
                    </span>
                    <span className="stat-value">{total}</span>
                </div>

                <div className="stat-box">
                    <span className="stat-label">
                        <Award size={16} color="var(--success)" />
                        Completed
                    </span>
                    <span className="stat-value">{completed}</span>
                </div>

                <div className="stat-box">
                    <span className="stat-label">
                        <List size={16} color="var(--warning)" />
                        Remaining
                    </span>
                    <span className="stat-value">{total - completed}</span>
                </div>
            </div>

            <div className="progress-bar-container" title={`${percentage}% Completed`}>
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
