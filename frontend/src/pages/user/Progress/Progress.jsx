import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';
import './Progress.css';

export default function Progress() {
    const { appSettings, userProgress, isInitialLoad } = useAuth();

    const TOTAL_LECTURES = appSettings?.totalLectures || 200;

    const stats = useMemo(() => {
        let completed = 0;
        const completedLectures = [];

        for (let i = 1; i <= TOTAL_LECTURES; i++) {
            if (userProgress[i]?.completedAt) {
                completed++;
                completedLectures.push({
                    id: i,
                    completedAt: new Date(userProgress[i].completedAt)
                });
            }
        }

        // Sort by recent completed first
        completedLectures.sort((a, b) => b.completedAt - a.completedAt);

        return {
            completed,
            percentage: Math.round((completed / TOTAL_LECTURES) * 100) || 0,
            recent: completedLectures.slice(0, 5) // Last 5 completed
        };
    }, [userProgress, TOTAL_LECTURES]);

    // Use inline style for CSS variables to power the conic gradient
    const progressStyle = {
        '--progress': `${stats.percentage}%`
    };

    if (isInitialLoad && !Object.keys(userProgress).length) {
        return (
            <div className="progress-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>Instant loading...</div>
            </div>
        );
    }

    return (
        <div className="progress-page">
            <div className="progress-header animate-fade-in">
                <h1 className="progress-title">Your Progress Report</h1>
                <p className="progress-subtitle">Detailed breakdown of your learning journey.</p>
            </div>

            <div className="progress-overview glass-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Course Completion</h2>

                <div className="progress-chart-container">
                    <div className="circular-progress" style={progressStyle}>
                        <div className="progress-value">
                            {stats.percentage}%
                            <span>Completed</span>
                        </div>
                    </div>

                    <div className="detailed-stats">
                        <div className="stat-item">
                            <span className="value">{TOTAL_LECTURES}</span>
                            <span className="label">Total Lectures</span>
                        </div>
                        <div className="stat-item">
                            <span className="value" style={{ color: 'var(--success)' }}>{stats.completed}</span>
                            <span className="label">Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="value" style={{ color: 'var(--warning)' }}>{TOTAL_LECTURES - stats.completed}</span>
                            <span className="label">Remaining</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recent-activity glass-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Recent Completions</h2>

                {stats.recent.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No lectures completed yet.</p>
                ) : (
                    <div className="activity-list">
                        {stats.recent.map(l => (
                            <div key={l.id} className="activity-item">
                                <div className="activity-icon">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div className="activity-content">
                                    <span className="activity-title">Lecture {l.id} Completed</span>
                                    <span className="activity-time">{l.completedAt.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
