import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Home, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const SignupPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'student',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password strength checker
    const getStrength = (pwd: string) => {
        if (!pwd) return { score: 0, label: '', color: 'transparent' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        const levels = [
            { score: 1, label: 'Weak', color: '#FF6584' },
            { score: 2, label: 'Fair', color: '#FFD700' },
            { score: 3, label: 'Good', color: '#43E97B' },
            { score: 4, label: 'Strong', color: '#38F9D7' },
        ];
        return levels[score - 1] ?? { score: 0, label: '', color: 'transparent' };
    };

    const strength = getStrength(form.password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const validate = () => {
        if (!form.name.trim()) return 'Full name is required.';
        if (!form.email.trim()) return 'Email is required.';
        if (form.password.length < 6) return 'Password must be at least 6 characters.';
        if (form.password !== form.confirmPassword) return 'Passwords do not match.';
        return '';
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    userType: form.userType,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Registration failed. Please try again.');
            } else {
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch {
            setError('Unable to connect to the server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '13px 14px 13px 42px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(108,99,255,0.2)',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '0.95rem',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        outline: 'none',
        boxSizing: 'border-box' as const,
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '8px',
        letterSpacing: '0.4px',
    };

    const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.borderColor = '#6C63FF';
        e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)';
    };
    const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.target.style.borderColor = 'rgba(108,99,255,0.2)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0D0D1A 0%, #1a0533 50%, #0D0D1A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Background blobs */}
            <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)', top: '-80px', right: '-80px', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(108,99,255,0.14) 0%, transparent 70%)', bottom: '-60px', left: '-60px', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

            {/* Logo */}
            <Link to="/" style={{ position: 'absolute', top: '24px', left: '28px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(108,99,255,0.5)' }}>
                    <Home size={18} color="#fff" />
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    BoardingFinder
                </span>
            </Link>

            {/* Card */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '460px',
                    background: 'rgba(18, 18, 40, 0.85)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    borderRadius: '28px',
                    padding: '44px 40px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                    position: 'relative',
                    zIndex: 1,
                    animation: 'fadeInUp 0.6s ease forwards',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #a855f7, #6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 25px rgba(168,85,247,0.5)' }}>
                        <UserPlus size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.85rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', color: '#fff' }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                        Join thousands of students on BoardingFinder
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(255,101,132,0.12)', border: '1px solid rgba(255,101,132,0.35)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
                        <AlertCircle size={17} color="#FF6584" style={{ flexShrink: 0, marginTop: '1px' }} />
                        <span style={{ color: '#FF6584', fontSize: '0.875rem' }}>{error}</span>
                    </div>
                )}
                {success && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(67,233,123,0.12)', border: '1px solid rgba(67,233,123,0.35)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
                        <CheckCircle size={17} color="#43E97B" style={{ flexShrink: 0 }} />
                        <span style={{ color: '#43E97B', fontSize: '0.875rem' }}>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>FULL NAME</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} color="#6C63FF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Kavindi Perera"
                                required
                                style={inputStyle}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>EMAIL ADDRESS</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} color="#6C63FF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                style={inputStyle}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                        </div>
                    </div>

                    {/* User Type */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>I AM A</label>
                        <div style={{ position: 'relative' }}>
                            <GraduationCap size={16} color="#6C63FF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <select
                                name="userType"
                                value={form.userType}
                                onChange={handleChange}
                                style={{
                                    ...inputStyle,
                                    paddingLeft: '42px',
                                    cursor: 'pointer',
                                    appearance: 'none' as const,
                                }}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            >
                                <option value="student">Student (Looking for boarding)</option>
                                <option value="landlord">Landlord (Listing a room)</option>
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#6C63FF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min. 6 characters"
                                required
                                style={{ ...inputStyle, paddingRight: '44px' }}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {/* Password strength bar */}
                        {form.password && (
                            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '3px', background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                                ))}
                                <span style={{ fontSize: '0.7rem', color: strength.color, marginLeft: '6px', fontWeight: 600, minWidth: '40px' }}>{strength.label}</span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '26px' }}>
                        <label style={labelStyle}>CONFIRM PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#6C63FF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                required
                                style={{
                                    ...inputStyle,
                                    paddingRight: '44px',
                                    borderColor: form.confirmPassword
                                        ? form.password === form.confirmPassword
                                            ? 'rgba(67,233,123,0.5)'
                                            : 'rgba(255,101,132,0.5)'
                                        : 'rgba(108,99,255,0.2)',
                                }}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Terms note */}
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '18px', lineHeight: 1.6 }}>
                        By creating an account you agree to our{' '}
                        <a href="#" style={{ color: '#a855f7' }}>Terms of Service</a> and{' '}
                        <a href="#" style={{ color: '#a855f7' }}>Privacy Policy</a>.
                    </p>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '14px',
                            background: loading ? 'rgba(168,85,247,0.45)' : 'linear-gradient(135deg, #a855f7, #6C63FF)',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            border: 'none',
                            boxShadow: loading ? 'none' : '0 8px 25px rgba(168,85,247,0.45)',
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
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(168,85,247,0.6)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLElement).style.boxShadow = loading ? 'none' : '0 8px 25px rgba(168,85,247,0.45)';
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Create My Account
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '26px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* Login link */}
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = 'none')}
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #1a1a35; color: #fff; }
      `}</style>
        </div>
    );
};

export default SignupPage;
