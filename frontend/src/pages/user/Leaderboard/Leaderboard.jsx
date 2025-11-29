import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Trophy, Medal, Star } from 'lucide-react';
import './Leaderboard.css';

export default function Leaderboard() {
    const { getAllUsersData, appSettings } = useAuth();
    const [rankedUsers, setRankedUsers] = useState([]);

    useEffect(() => {
        const fetchAndProcess = async () => {
            const data = await getAllUsersData();
            const processed = data
                .filter(u => u.role !== 'admin') // Exclude admin from leaderboard
                .map(u => {
                    let completed = 0;
                    const progress = u.progress || {};
                    Object.keys(progress).forEach(lectureId => {
                        if (progress[lectureId]?.completedAt) completed++;
                    });
                    return {
                        ...u,
                        completed,
                        percentage: appSettings.totalLectures > 0
                            ? Math.round((completed / appSettings.totalLectures) * 100)
                            : 0
                    };
                }).sort((a, b) => b.completed - a.completed);

            setRankedUsers(processed);
        };

        fetchAndProcess();
    }, [appSettings.totalLectures, getAllUsersData]);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy size={28} color="#fbbf24" />; // Gold
            case 1: return <Medal size={28} color="#94a3b8" />; // Silver
            case 2: return <Medal size={28} color="#cd7f32" />; // Bronze
            default: return <span className="rank-number">#{index + 1}</span>;
        }
    };

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-header animate-fade-in">
                <h1 className="leaderboard-title">Global Leaderboard</h1>
                <p className="leaderboard-subtitle">See how you stack up against other learners.</p>
            </div>

            <div className="leaderboard-list glass-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {rankedUsers.length === 0 ? (
                    <div className="empty-state text-center" style={{ padding: '3rem' }}>
                        <Star size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-secondary)' }}>No active learners yet</h3>
                    </div>
                ) : (
                    rankedUsers.map((user, index) => (
                        <div key={user.id} className={`leaderboard-item ${index < 3 ? `top-${index + 1}` : ''}`}>
                            <div className="rank-container">
                                {getRankIcon(index)}
                            </div>

                            <div className="user-profile-info">
                                <div className="avatar-small">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} />
                                    ) : (
                                        <span>{user.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="user-details">
                                    <span className="name">{user.name}</span>
                                    <span className="stats">{user.completed} / {appSettings.totalLectures} Lectures</span>
                                </div>
                            </div>

                            <div className="progress-section">
                                <div className="progress-value-text">{user.percentage}%</div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${user.percentage}%`, backgroundColor: index === 0 ? '#fbbf24' : 'var(--accent-primary)' }}></div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
