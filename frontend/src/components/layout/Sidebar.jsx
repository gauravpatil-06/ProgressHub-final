import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    BookOpen,
    TrendingUp,
    Settings,
    LogOut,
    Layers,
    Users
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, isAdmin }) {
    const { logout } = useAuth();

    const userNavItems = [
        { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/progress', name: 'Progress', icon: <TrendingUp size={20} /> },
        { path: '/leaderboard', name: 'Leaderboard', icon: <TrendingUp size={20} /> },
        { path: '/profile', name: 'Profile', icon: <Settings size={20} /> }
    ];

    const adminNavItems = [
        { path: '/admin', name: 'User Management', icon: <Users size={20} /> },
        { path: '/admin/leaderboard', name: 'Leaderboard', icon: <TrendingUp size={20} /> },
        { path: '/admin/lectures', name: 'Lecture Control', icon: <Settings size={20} /> }
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <img src="/ProgressHub.png" alt="ProgressHub Logo" className="app-logo-small" />
                    <span className="gradient-text">ProgressHub</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'} // Ensure exactly matching parent child route
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={logout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
