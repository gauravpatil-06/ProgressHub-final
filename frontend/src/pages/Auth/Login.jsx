import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers } from 'lucide-react';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            console.log("User already logged in, redirecting...");
            const isAdmin = user.role === 'admin';
            navigate(isAdmin ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        console.log("Attempting login for:", email);

        try {
            const result = await login(email, password, isRememberMe);
            console.log("Login result:", result);
            if (!result.success) {
                setError(result.message);
            }
        } catch (err) {
            console.error("Login component error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-blob auth-bg-blob-1"></div>
            <div className="auth-bg-blob auth-bg-blob-2"></div>
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo gradient-text">
                        <img src="/ProgressHub.png" alt="ProgressHub Logo" className="auth-logo-img" />
                        ProgressHub
                    </div>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={isRememberMe}
                                onChange={(e) => setIsRememberMe(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </div>
            </div>
        </div>
    );
}
