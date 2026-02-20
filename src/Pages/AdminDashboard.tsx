import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Home, TrendingUp, ShieldCheck, LogOut,
    Bell, Search, Menu, X, Trash2, BarChart2,
    CheckCircle, Clock, AlertCircle, ChevronRight,
    Eye, MapPin, Building2, UserPlus, DollarSign,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

interface User {
    _id: string;
    name: string;
    email: string;
    userType: string;
}

interface Boarding {
    _id: string;
    title: string;
    location: string;
    price: number;
    roomType: string;
    nearUniversity: string;
    status: string;
    landlordName: string;
    photos: string[];
    amenities: string[];
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    description: string;
    createdAt: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Finance Manager form state
    const [fmName, setFmName] = useState('');
    const [fmEmail, setFmEmail] = useState('');
    const [fmPassword, setFmPassword] = useState('');
    const [fmSubmitting, setFmSubmitting] = useState(false);
    const [fmSuccess, setFmSuccess] = useState('');
    const [fmError, setFmError] = useState('');

    // Boardings state
    const [boardings, setBoardings] = useState<Boarding[]>([]);
    const [loadingBoardings, setLoadingBoardings] = useState(false);
    const [boardingSearch, setBoardingSearch] = useState('');
    const [boardingFilter, setBoardingFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');
    const [selectedBoarding, setSelectedBoarding] = useState<Boarding | null>(null);

    // Guard: admins only
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (!currentUser || currentUser.userType !== 'admin') {
            navigate('/login');
            return;
        }
        fetchUsers();
        fetchBoardings();
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

    const fetchBoardings = async () => {
        setLoadingBoardings(true);
        try {
            const res = await fetch(`${API_BASE}/boardings`);
            const data = await res.json();
            setBoardings(data.boardings || []);
        } catch {
            console.error('Failed to fetch boardings');
        } finally {
            setLoadingBoardings(false);
        }
    };

    const updateBoardingStatus = async (id: string, status: 'published' | 'rejected' | 'pending') => {
        try {
            const res = await fetch(`${API_BASE}/boardings/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (res.ok) {
                setBoardings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
                if (selectedBoarding?._id === id) setSelectedBoarding(prev => prev ? { ...prev, status } : null);
            } else {
                console.error(data.message);
            }
        } catch {
            console.error('Status update failed');
        }
    };

    const deleteBoarding = async (id: string) => {
        try {
            await fetch(`${API_BASE}/boardings/${id}`, { method: 'DELETE' });
            setBoardings(prev => prev.filter(b => b._id !== id));
            if (selectedBoarding?._id === id) setSelectedBoarding(null);
        } catch {
            console.error('Boarding delete failed');
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

    const handleAddFinanceManager = async (e: React.FormEvent) => {
        e.preventDefault();
        setFmError('');
        setFmSuccess('');
        if (!fmName.trim() || !fmEmail.trim() || !fmPassword.trim()) {
            setFmError('All fields are required.');
            return;
        }
        setFmSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fmName, email: fmEmail, password: fmPassword, userType: 'finance_manager' }),
            });
            const data = await res.json();
            if (res.ok) {
                setFmSuccess(`Finance Manager "${fmName}" added successfully!`);
                setFmName('');
                setFmEmail('');
                setFmPassword('');
                fetchUsers();
            } else {
                setFmError(data.message || 'Failed to add Finance Manager.');
            }
        } catch {
            setFmError('Network error. Please try again.');
        } finally {
            setFmSubmitting(false);
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
        { label: 'Pending Listings', value: boardings.filter(b => b.status === 'pending').length, icon: <Clock size={22} />, color: '#FCD34D', bg: 'rgba(252,211,77,0.15)' },
    ];

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={18} />, sub: false },
        { id: 'users', label: 'Users', icon: <Users size={18} />, sub: false },
        { id: 'add-finance-manager', label: 'Add Finance Manager', icon: <DollarSign size={15} />, sub: true },
        { id: 'listings', label: 'Listings', icon: <Home size={18} />, sub: false },
        { id: 'reports', label: 'Reports', icon: <TrendingUp size={18} />, sub: false },
    ];

    const typeColor: Record<string, { color: string; bg: string }> = {
        admin: { color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
        student: { color: '#43E97B', bg: 'rgba(67,233,123,0.15)' },
        landlord: { color: '#38F9D7', bg: 'rgba(56,249,215,0.15)' },
        finance_manager: { color: '#FCD34D', bg: 'rgba(252,211,77,0.15)' },
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
                                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                padding: item.sub ? '9px 12px 9px 30px' : '11px 14px',
                                borderRadius: '12px', marginBottom: '3px',
                                background: activeSection === item.id
                                    ? item.sub ? 'rgba(252,211,77,0.12)' : 'rgba(108,99,255,0.2)'
                                    : 'transparent',
                                border: activeSection === item.id
                                    ? item.sub ? '1px solid rgba(252,211,77,0.3)' : '1px solid rgba(108,99,255,0.3)'
                                    : '1px solid transparent',
                                color: activeSection === item.id
                                    ? item.sub ? '#FCD34D' : '#fff'
                                    : item.sub ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.55)',
                                fontSize: item.sub ? '0.82rem' : '0.9rem',
                                fontWeight: activeSection === item.id ? 600 : 400,
                                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                            }}
                            onMouseEnter={(e) => { if (activeSection !== item.id) (e.currentTarget as HTMLElement).style.background = item.sub ? 'rgba(252,211,77,0.06)' : 'rgba(108,99,255,0.08)'; }}
                            onMouseLeave={(e) => { if (activeSection !== item.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                            {item.sub && (
                                <span style={{ width: '14px', height: '14px', borderLeft: '1.5px solid rgba(252,211,77,0.35)', borderBottom: '1.5px solid rgba(252,211,77,0.35)', borderRadius: '0 0 0 4px', flexShrink: 0, marginLeft: '-12px' }} />
                            )}
                            <span style={{ color: activeSection === item.id && item.sub ? '#FCD34D' : 'inherit', flexShrink: 0 }}>{item.icon}</span>
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
                                {activeSection === 'add-finance-manager' ? 'Finance Manager' : navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
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

                    {/* ── Listings Section ── */}
                    {activeSection === 'listings' && (() => {
                        const filtered = boardings.filter(b => {
                            const matchSearch =
                                b.title?.toLowerCase().includes(boardingSearch.toLowerCase()) ||
                                b.location?.toLowerCase().includes(boardingSearch.toLowerCase()) ||
                                b.landlordName?.toLowerCase().includes(boardingSearch.toLowerCase());
                            const matchFilter = boardingFilter === 'all' || b.status === boardingFilter;
                            return matchSearch && matchFilter;
                        });

                        return (
                            <div>
                                {/* Toolbar */}
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '360px' }}>
                                        <Search size={15} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                        <input type="text" placeholder="Search listings…" value={boardingSearch} onChange={e => setBoardingSearch(e.target.value)} style={{ width: '100%', padding: '10px 14px 10px 38px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                    {(['all', 'pending', 'published', 'rejected'] as const).map(f => (
                                        <button key={f} onClick={() => setBoardingFilter(f)} style={{ padding: '8px 18px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: boardingFilter === f ? 'linear-gradient(135deg, #6C63FF, #a855f7)' : 'rgba(255,255,255,0.05)', border: boardingFilter === f ? 'none' : '1px solid rgba(255,255,255,0.1)', color: boardingFilter === f ? '#fff' : 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>
                                            {f} {f !== 'all' && <span style={{ marginLeft: '4px', opacity: 0.7 }}>({boardings.filter(b => b.status === f).length})</span>}
                                        </button>
                                    ))}
                                    <button onClick={fetchBoardings} style={{ marginLeft: 'auto', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '10px', padding: '8px 14px', color: '#fff', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>Refresh</button>
                                </div>

                                <div style={{ background: 'rgba(18,18,40,0.8)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '18px', padding: '24px' }}>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px' }}>
                                        Boarding Submissions <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: '8px' }}>({filtered.length})</span>
                                    </h2>

                                    {loadingBoardings ? (
                                        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                                            <div style={{ width: '28px', height: '28px', border: '2px solid rgba(108,99,255,0.3)', borderTopColor: '#6C63FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                                            Loading…
                                        </div>
                                    ) : filtered.length === 0 ? (
                                        <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '30px 0' }}>No listings found.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {filtered.map(b => {
                                                const sc: Record<string, { color: string; bg: string }> = {
                                                    pending:   { color: '#FCD34D', bg: 'rgba(252,211,77,0.12)' },
                                                    published: { color: '#43E97B', bg: 'rgba(67,233,123,0.12)' },
                                                    rejected:  { color: '#FF6584', bg: 'rgba(255,101,132,0.12)' },
                                                };
                                                const s = sc[b.status] || sc.pending;
                                                return (
                                                    <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
                                                        {/* Thumbnail */}
                                                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {b.photos?.[0]
                                                                ? <img src={`${API_BASE}${b.photos[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                : <Building2 size={24} color="rgba(108,99,255,0.5)" />}
                                                        </div>
                                                        {/* Info */}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>
                                                                <MapPin size={11} color="#6C63FF" />{b.location}
                                                            </div>
                                                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                                                                {b.roomType} · LKR {b.price?.toLocaleString()}/mo · By {b.landlordName}
                                                            </div>
                                                        </div>
                                                        {/* Status */}
                                                        <span style={{ padding: '4px 12px', borderRadius: '100px', background: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${s.color}44`, flexShrink: 0 }}>
                                                            {b.status}
                                                        </span>
                                                        {/* Actions */}
                                                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                            <button onClick={() => setSelectedBoarding(b)} title="View details" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', color: '#a855f7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Eye size={14} />
                                                            </button>
                                                            {b.status !== 'published' && (
                                                                <button onClick={() => updateBoardingStatus(b._id, 'published')} title="Publish" style={{ padding: '0 12px', height: '32px', borderRadius: '8px', background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.3)', color: '#43E97B', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                                                    Publish
                                                                </button>
                                                            )}
                                                            {b.status !== 'rejected' && (
                                                                <button onClick={() => updateBoardingStatus(b._id, 'rejected')} title="Reject" style={{ padding: '0 12px', height: '32px', borderRadius: '8px', background: 'rgba(255,101,132,0.08)', border: '1px solid rgba(255,101,132,0.25)', color: '#FF6584', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                                                    Reject
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteBoarding(b._id)} title="Delete" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.2)', color: '#FF6584', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* ── Add Finance Manager Section ── */}
                    {activeSection === 'add-finance-manager' && (
                        <div style={{ maxWidth: '640px' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(252,211,77,0.12)', border: '1px solid rgba(252,211,77,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <DollarSign size={24} color="#FCD34D" />
                                </div>
                                <div>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Add Finance Manager</h2>
                                    <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Create a new Finance Manager account</p>
                                </div>
                            </div>

                            {/* Form Card */}
                            <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(252,211,77,0.18)', borderRadius: '22px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

                                {/* Success banner */}
                                {fmSuccess && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.3)', color: '#43E97B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
                                        <CheckCircle size={18} /> {fmSuccess}
                                    </div>
                                )}

                                {/* Error banner */}
                                {fmError && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', color: '#FF6584', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
                                        <AlertCircle size={18} /> {fmError}
                                    </div>
                                )}

                                <form onSubmit={handleAddFinanceManager}>
                                    {/* Full Name */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <UserPlus size={16} color="rgba(252,211,77,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                            <input
                                                type="text"
                                                placeholder="e.g. Kasun Perera"
                                                value={fmName}
                                                onChange={e => setFmName(e.target.value)}
                                                style={{ width: '100%', padding: '13px 14px 13px 42px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(252,211,77,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(252,211,77,0.55)'; }}
                                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(252,211,77,0.2)'; }}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <Search size={16} color="rgba(252,211,77,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                            <input
                                                type="email"
                                                placeholder="e.g. kasun@company.com"
                                                value={fmEmail}
                                                onChange={e => setFmEmail(e.target.value)}
                                                style={{ width: '100%', padding: '13px 14px 13px 42px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(252,211,77,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(252,211,77,0.55)'; }}
                                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(252,211,77,0.2)'; }}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div style={{ marginBottom: '28px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <ShieldCheck size={16} color="rgba(252,211,77,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                            <input
                                                type="password"
                                                placeholder="Min. 8 characters"
                                                value={fmPassword}
                                                onChange={e => setFmPassword(e.target.value)}
                                                style={{ width: '100%', padding: '13px 14px 13px 42px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(252,211,77,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(252,211,77,0.55)'; }}
                                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(252,211,77,0.2)'; }}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={fmSubmitting}
                                        style={{ width: '100%', padding: '14px', borderRadius: '14px', background: fmSubmitting ? 'rgba(252,211,77,0.3)' : 'linear-gradient(135deg, #FCD34D, #F59E0B)', border: 'none', color: '#0D0D1A', fontWeight: 800, fontSize: '1rem', cursor: fmSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: fmSubmitting ? 'none' : '0 8px 24px rgba(252,211,77,0.3)', transition: 'all 0.25s' }}
                                        onMouseEnter={e => { if (!fmSubmitting) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 32px rgba(252,211,77,0.45)'; } }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = fmSubmitting ? 'none' : '0 8px 24px rgba(252,211,77,0.3)'; }}
                                    >
                                        {fmSubmitting ? (
                                            <><div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(13,13,26,0.3)', borderTopColor: '#0D0D1A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Adding…</>
                                        ) : (
                                            <><UserPlus size={18} /> Add Finance Manager</>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Finance Managers list */}
                            <div style={{ marginTop: '28px', background: 'rgba(18,18,40,0.8)', border: '1px solid rgba(252,211,77,0.14)', borderRadius: '18px', padding: '24px' }}>
                                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <DollarSign size={16} color="#FCD34D" /> Existing Finance Managers
                                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: '4px' }}>({users.filter(u => u.userType === 'finance_manager').length})</span>
                                </h3>
                                {loadingUsers ? (
                                    <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.3)' }}>
                                        <div style={{ width: '22px', height: '22px', border: '2px solid rgba(252,211,77,0.3)', borderTopColor: '#FCD34D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                                    </div>
                                ) : users.filter(u => u.userType === 'finance_manager').length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '28px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>
                                        No Finance Managers added yet.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {users.filter(u => u.userType === 'finance_manager').map(u => (
                                            <UserRow key={u._id} user={u} typeColor={typeColor} onDelete={() => setDeleteConfirm(u._id)} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Reports placeholder ── */}
                    {activeSection === 'reports' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: 'rgba(255,255,255,0.25)' }}>
                            <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h2 style={{ fontFamily: "'Outfit', sans-serif", margin: '0 0 8px', fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)' }}>Coming Soon</h2>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Reports section is under development.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* ── Boarding Detail Modal ── */}
            {selectedBoarding && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setSelectedBoarding(null)}>
                    <div style={{ background: '#1a1a30', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '24px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>{selectedBoarding.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}><MapPin size={12} color="#6C63FF" />{selectedBoarding.location}</div>
                            </div>
                            <button onClick={() => setSelectedBoarding(null)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={15} /></button>
                        </div>
                        {/* Photo */}
                        {selectedBoarding.photos?.[0] && (
                            <img src={`${API_BASE}${selectedBoarding.photos[0]}`} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '14px', marginBottom: '16px' }} />
                        )}
                        {/* Details grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                            {[
                                ['Type', selectedBoarding.roomType],
                                ['Price', `LKR ${selectedBoarding.price?.toLocaleString()}/mo`],
                                ['University', selectedBoarding.nearUniversity],
                                ['Landlord', selectedBoarding.landlordName],
                                ['Contact', selectedBoarding.contactName],
                                ['Phone', selectedBoarding.contactPhone || '—'],
                                ['Email', selectedBoarding.contactEmail || '—'],
                                ['Status', selectedBoarding.status],
                            ].map(([k, v]) => (
                                <div key={k} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{k}</div>
                                    <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 500, textTransform: k === 'Status' ? 'capitalize' : 'none' }}>{v}</div>
                                </div>
                            ))}
                        </div>
                        {/* Description */}
                        <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Description</div>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{selectedBoarding.description}</p>
                        </div>
                        {/* Amenities */}
                        {selectedBoarding.amenities?.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                {selectedBoarding.amenities.map(a => <span key={a} style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)', color: '#a78bfa', fontSize: '0.78rem' }}>{a}</span>)}
                            </div>
                        )}
                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {selectedBoarding.status !== 'published' && (
                                <button onClick={() => updateBoardingStatus(selectedBoarding._id, 'published')} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(67,233,123,0.12)', border: '1px solid rgba(67,233,123,0.3)', color: '#43E97B', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                                    ✓ Publish
                                </button>
                            )}
                            {selectedBoarding.status !== 'rejected' && (
                                <button onClick={() => updateBoardingStatus(selectedBoarding._id, 'rejected')} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', color: '#FF6584', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                                    ✕ Reject
                                </button>
                            )}
                            {selectedBoarding.status === 'published' && (
                                <button onClick={() => updateBoardingStatus(selectedBoarding._id, 'pending')} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(252,211,77,0.1)', border: '1px solid rgba(252,211,77,0.3)', color: '#FCD34D', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                                    ↩ Unpublish
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
