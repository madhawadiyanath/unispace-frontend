import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, Eye, EyeOff, Home, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const LoginPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: form.username, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Login failed. Please check your credentials.');
            } else {
                // Save user info
                localStorage.setItem('user', JSON.stringify(data.user));
                setSuccess('Login successful! Redirecting...');
                const userType = data.user?.userType;
                const destination =
                    userType === 'admin' ? '/admin/dashboard' :
                    userType === 'finance_manager' ? '/finance/dashboard' :
                    userType === 'cleaning_staff' ? '/cleaning-staff/dashboard' :
                    '/';
                setTimeout(() => navigate(destination), 1200);
            }
        } catch {
            setError('Unable to connect to the server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--gradient-hero)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--text-primary)',
            }}
        >
            {/* Background blobs */}
            <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)', top: '-100px', right: '-100px', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', bottom: '-50px', left: '-80px', filter: 'blur(40px)', pointerEvents: 'none' }} />
            {/* Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

            {/* Logo top-left */}
            <Link to="/" style={{ position: 'absolute', top: '24px', left: '28px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--btn-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--btn-primary-shadow-sm)' }}>
                    <Home size={18} color="#fff" />
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'var(--gradient-purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    BoardingFinder
                </span>
            </Link>

            {/* Card */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    background: 'var(--surface-2)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid var(--border-1)',
                    borderRadius: '28px',
                    padding: '44px 40px',
                    boxShadow: 'var(--shadow-card)',
                    position: 'relative',
                    zIndex: 1,
                    animation: 'fadeInUp 0.6s ease forwards',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div
                        style={{
                            width: '64px', height: '64px', borderRadius: '20px',
                            background: 'var(--btn-primary-bg)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 18px',
                            boxShadow: 'var(--btn-primary-shadow)',
                        }}
                    >
                        <LogIn size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.9rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Sign in to your BoardingFinder account
                    </p>
                </div>

                {/* Error / Success Alerts */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--danger-soft-bg)', border: '1px solid var(--danger-soft-border)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
                        <AlertCircle size={17} color="#FF6584" style={{ flexShrink: 0 }} />
                        <span style={{ color: 'var(--danger-soft-text)', fontSize: '0.875rem' }}>{error}</span>
                    </div>
                )}
                {success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(67,233,123,0.12)', border: '1px solid rgba(67,233,123,0.35)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
                        <CheckCircle size={17} color="#43E97B" style={{ flexShrink: 0 }} />
                        <span style={{ color: '#43E97B', fontSize: '0.875rem' }}>{success}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                            USERNAME
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={17} color="#6C63FF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                autoComplete="username"
                                style={{
                                    width: '100%',
                                    padding: '13px 14px 13px 42px',
                                    background: 'var(--input-bg)',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: '12px',
                                    color: 'var(--input-text)',
                                    fontSize: '0.95rem',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--input-focus-border)';
                                    e.target.style.boxShadow = 'var(--input-focus-ring)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--input-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
                                PASSWORD
                            </label>
                            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={17} color="#6C63FF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '13px 44px 13px 42px',
                                    background: 'var(--input-bg)',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: '12px',
                                    color: 'var(--input-text)',
                                    fontSize: '0.95rem',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--input-focus-border)';
                                    e.target.style.boxShadow = 'var(--input-focus-ring)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--input-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '14px',
                            background: 'var(--btn-primary-bg)',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            border: 'none',
                            boxShadow: loading ? 'none' : 'var(--btn-primary-shadow)',
                            opacity: loading ? 0.75 : 1,
                            transition: 'all 0.25s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            fontFamily: "'Inter', sans-serif",
                            letterSpacing: '0.3px',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--btn-primary-shadow-hover)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLElement).style.boxShadow = loading ? 'none' : 'var(--btn-primary-shadow)';
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '28px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-1)' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-1)' }} />
                </div>

                {/* Sign up link */}
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = 'none')}
                    >
                        Create one
                    </Link>
                </p>
            </div>

            <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
                input::placeholder { color: var(--text-muted); }
                select option { background: var(--select-option-bg); color: var(--text-primary); }
      `}</style>
        </div>
    );
};

export default LoginPage;
