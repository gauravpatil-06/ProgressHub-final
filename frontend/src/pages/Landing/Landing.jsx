import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, CheckCircle2, TrendingUp, Users, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Landing.css';

export default function Landing() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="landing-page">
            {/* Navbar purely for landing page */}
            <nav className="landing-nav glass-container">
                <div className="landing-logo">
                    <img src="/ProgressHub.png" alt="ProgressHub Logo" className="app-logo-small" style={{ width: '36px', height: '36px' }} />
                    <span className="gradient-text font-bold text-xl">ProgressHub</span>
                </div>
                <div className="landing-nav-links">
                    <Link to="/login" className="btn btn-outline">Login</Link>
                    <Link to="/register" className="btn btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content animate-fade-in-up">
                    <div className="badge glass-panel">🔥 Now in V2 • Advanced Tracking</div>
                    <h1 className="hero-title">
                        Track Your <span className="gradient-text">Learning Journey</span>
                    </h1>
                    <p className="hero-subtitle">
                        Manage lectures, track progress, and stay consistent with a modern workflow designed for focus.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">Login to Account</Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Everything you need to succeed</h2>
                    <p className="section-subtitle">A comprehensive suite of tools built for serious learners.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card glass-panel stagger-1">
                        <div className="feature-icon bg-accent">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3>Lecture Tracking</h3>
                        <p>Mark lectures as completed, add detailed notes, and upload important attachments right where you need them.</p>
                    </div>

                    <div className="feature-card glass-panel stagger-2">
                        <div className="feature-icon bg-success">
                            <TrendingUp size={24} />
                        </div>
                        <h3>Progress Dashboard</h3>
                        <p>Visualize your consistency with beautiful charts and detailed metrics on your completion rate.</p>
                    </div>

                    <div className="feature-card glass-panel stagger-3">
                        <div className="feature-icon bg-warning">
                            <Users size={24} />
                        </div>
                        <h3>Global Leaderboard</h3>
                        <p>Compete with other learners worldwide. Rank up by completing more lectures and stay motivated.</p>
                    </div>

                    <div className="feature-card glass-panel stagger-4">
                        <div className="feature-icon bg-danger">
                            <Shield size={24} />
                        </div>
                        <h3>Admin Control</h3>
                        <p>Dedicated tools for instructors to manage curriculum size and monitor student engagement signals.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="landing-logo">
                        <img src="/ProgressHub.png" alt="ProgressHub Logo" className="app-logo-small" style={{ opacity: 0.7 }} />
                        <span className="text-secondary font-bold">ProgressHub</span>
                    </div>
                    <p>© {new Date().getFullYear()} ProgressHub. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
