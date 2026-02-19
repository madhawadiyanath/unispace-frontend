import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Home, TrendingUp, ShieldCheck, LogOut,
    Bell, Search, Menu, X, Trash2, BarChart2,
    CheckCircle, Clock, AlertCircle, ChevronRight
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

interface User {
    _id: string;
    name: string;
    email: string;
    userType: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Guard: admins only
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (!currentUser || currentUser.userType !== 'admin') {
            navigate('/login');
            return;
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch(`${API_BASE}/users`);
            const data = await res.json();
            setUsers(data.Users || []);
        } catch {
            console.error('Failed to fetch users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
            setUsers(prev => prev.filter(u => u._id !== id));
            setDeleteConfirm(null);
        } catch {
            console.error('Delete failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.userType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Total Users', value: users.length, icon: <Users size={22} />, color: '#6C63FF', bg: 'rgba(108,99,255,0.15)' },
        { label: 'Students', value: users.filter(u => u.userType === 'student').length, icon: <CheckCircle size={22} />, color: '#43E97B', bg: 'rgba(67,233,123,0.15)' },
        { label: 'Landlords', value: users.filter(u => u.userType === 'landlord').length, icon: <Home size={22} />, color: '#38F9D7', bg: 'rgba(56,249,215,0.15)' },
        { label: 'Admins', value: users.filter(u => u.userType === 'admin').length, icon: <ShieldCheck size={22} />, color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
    ];

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
        { id: 'users', label: 'Users', icon: <Users size={18} /> },
        { id: 'listings', label: 'Listings', icon: <Home size={18} /> },
        { id: 'reports', label: 'Reports', icon: <TrendingUp size={18} /> },
    ];

    const typeColor: Record<string, { color: string; bg: string }> = {
        admin: { color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
        student: { color: '#43E97B', bg: 'rgba(67,233,123,0.15)' },
        landlord: { color: '#38F9D7', bg: 'rgba(56,249,215,0.15)' },
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D1A', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

            {/* ── Sidebar ── */}
            <aside
                style={{
                    width: '240px',
                    background: 'rgba(18,18,40,0.95)',
                    borderRight: '1px solid rgba(108,99,255,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0, left: sidebarOpen ? 0 : undefined,
                    height: '100vh',
                    zIndex: 50,
                    transition: 'left 0.3s',
                }}
                className="sidebar"
            >
                {/* Logo */}
                <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(108,99,255,0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(108,99,255,0.4)', flexShrink: 0 }}>
                            <ShieldCheck size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px' }}>Admin Panel</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>BoardingFinder</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '11px 14px', borderRadius: '12px', marginBottom: '4px',
                                background: activeSection === item.id ? 'rgba(108,99,255,0.2)' : 'transparent',
                                border: activeSection === item.id ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                                color: activeSection === item.id ? '#fff' : 'rgba(255,255,255,0.55)',
                                fontSize: '0.9rem', fontWeight: activeSection === item.id ? 600 : 400,
                                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Admin User Info + Logout */}
                <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(108,99,255,0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', marginBottom: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ShieldCheck size={15} color="#fff" />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name || 'Admin'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.25)', color: '#FF6584', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.2)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.1)'; }}
                    >
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main area ── */}
            <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="main-area">

                {/* Top bar */}
                <header style={{ padding: '16px 28px', borderBottom: '1px solid rgba(108,99,255,0.12)', background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '10px', padding: '8px', color: '#fff', cursor: 'pointer' }}>
                            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <div>
                            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
                                {navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
                            </h1>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={17} />
                        </button>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={16} color="#fff" />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>

                    {/* ── Dashboard Overview ── */}
                    {activeSection === 'dashboard' && (
                        <div>
                            {/* Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                                {stats.map((s, i) => (
                                    <div key={i} style={{ background: 'rgba(18,18,40,0.8)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '18px', padding: '22px', display: 'flex', alignItems: 'flex-start', gap: '14px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 30px rgba(0,0,0,0.3)`; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", lineHeight: 1, color: '#fff' }}>{s.value}</div>
                                            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Users Preview */}
                            <div style={{ background: 'rgba(18,18,40,0.8)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '18px', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Users</h2>
                                    <button onClick={() => setActiveSection('users')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#6C63FF', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                        View all <ChevronRight size={15} />
                                    </button>
                                </div>
                                {loadingUsers ? (
                                    <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)' }}>
                                        <div style={{ width: '28px', height: '28px', border: '2px solid rgba(108,99,255,0.3)', borderTopColor: '#6C63FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                                        Loading users...
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {users.slice(0, 5).map(u => (
                                            <UserRow key={u._id} user={u} typeColor={typeColor} onDelete={() => setDeleteConfirm(u._id)} />
                                        ))}
                                        {users.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '20px 0' }}>No users found.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Users Section ── */}
                    {activeSection === 'users' && (
                        <div>
                            {/* Search */}
                            <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '20px' }}>
                                <Search size={16} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ background: 'rgba(18,18,40,0.8)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '18px', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                        All Users <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: '8px' }}>({filteredUsers.length})</span>
                                    </h2>
                                    <button onClick={fetchUsers} style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '10px', padding: '7px 14px', color: '#fff', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
                                        Refresh
                                    </button>
                                </div>

                                {loadingUsers ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                                        <div style={{ width: '28px', height: '28px', border: '2px solid rgba(108,99,255,0.3)', borderTopColor: '#6C63FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                                        Loading users...
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {filteredUsers.map(u => (
                                            <UserRow key={u._id} user={u} typeColor={typeColor} onDelete={() => setDeleteConfirm(u._id)} />
                                        ))}
                                        {filteredUsers.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '30px 0' }}>No users match your search.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Listings / Reports placeholder ── */}
                    {(activeSection === 'listings' || activeSection === 'reports') && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: 'rgba(255,255,255,0.25)' }}>
                            <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h2 style={{ fontFamily: "'Outfit', sans-serif", margin: '0 0 8px', fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)' }}>Coming Soon</h2>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>This section is under development.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* ── Delete Confirmation Modal ── */}
            {deleteConfirm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                    <div style={{ background: '#1a1a30', border: '1px solid rgba(255,101,132,0.4)', borderRadius: '20px', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,101,132,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                            <AlertCircle size={26} color="#FF6584" />
                        </div>
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 700, margin: '0 0 10px' }}>Delete User?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 24px' }}>This action cannot be undone. The user account will be permanently removed.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,101,132,0.15)', border: '1px solid rgba(255,101,132,0.4)', color: '#FF6584', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49 }} className="mobile-overlay" />
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @media (max-width: 768px) {
          .sidebar { left: -240px !important; }
          .sidebar.open { left: 0 !important; }
          .main-area { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </div>
    );
};

// ── Reusable User Row ──
const UserRow = ({
    user,
    typeColor,
    onDelete,
}: {
    user: User;
    typeColor: Record<string, { color: string; bg: string }>;
    onDelete: () => void;
}) => {
    const tc = typeColor[user.userType] || { color: '#fff', bg: 'rgba(255,255,255,0.1)' };
    const initials = user.name?.slice(0, 2).toUpperCase() || '??';

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.08)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `linear-gradient(135deg, ${tc.color}88, ${tc.color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '12px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '100px', background: tc.bg, color: tc.color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {user.userType}
                </span>
                <button onClick={onDelete} title="Delete user" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.2)', color: '#FF6584', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.2)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.1)'; }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
