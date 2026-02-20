import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign, LogOut, Bell, Menu, X, BarChart2,
    TrendingUp, Users, Home, Eye,
    MapPin, Building2, CheckCircle,
    CreditCard, Wallet, ArrowUpRight, ArrowDownRight,
    FileText, ChevronRight, Search,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

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
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    userType: string;
}

const FinanceManagerDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [boardings, setBoardings] = useState<Boarding[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingBoardings, setLoadingBoardings] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (!currentUser || currentUser.userType !== 'finance_manager') {
            navigate('/login');
            return;
        }
        fetchBoardings();
        fetchUsers();
    }, []);

    const fetchBoardings = async () => {
        setLoadingBoardings(true);
        try {
            const res = await fetch(`${API_BASE}/boardings`);
            const data = await res.json();
            setBoardings(data.boardings || []);
        } catch { console.error('Failed to fetch boardings'); }
        finally { setLoadingBoardings(false); }
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch(`${API_BASE}/users`);
            const data = await res.json();
            setUsers(data.Users || []);
        } catch { console.error('Failed to fetch users'); }
        finally { setLoadingUsers(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // ── Derived financial stats ──
    const publishedListings = boardings.filter(b => b.status === 'published');
    const pendingListings   = boardings.filter(b => b.status === 'pending');
    const totalRevenue      = publishedListings.reduce((sum, b) => sum + (b.price || 0), 0);
    const avgRent           = publishedListings.length ? Math.round(totalRevenue / publishedListings.length) : 0;
    const students          = users.filter(u => u.userType === 'student').length;
    const landlords         = users.filter(u => u.userType === 'landlord').length;

    const filteredBoardings = boardings.filter(b =>
        b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.landlordName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navItems = [
        { id: 'overview',      label: 'Overview',       icon: <BarChart2 size={18} /> },
        { id: 'listings',      label: 'Listings',        icon: <Home size={18} /> },
        { id: 'transactions',  label: 'Transactions',    icon: <CreditCard size={18} /> },
        { id: 'users',         label: 'Users',           icon: <Users size={18} /> },
        { id: 'reports',       label: 'Reports',         icon: <FileText size={18} /> },
    ];

    const statCards = [
        {
            label: 'Total Listing Revenue',
            value: `LKR ${totalRevenue.toLocaleString()}`,
            sub: 'Sum of published rents/mo',
            icon: <Wallet size={22} />,
            color: '#FCD34D',
            bg: 'rgba(252,211,77,0.15)',
            trend: '+12%',
            up: true,
        },
        {
            label: 'Active Listings',
            value: publishedListings.length,
            sub: `${pendingListings.length} pending approval`,
            icon: <CheckCircle size={22} />,
            color: '#43E97B',
            bg: 'rgba(67,233,123,0.15)',
            trend: '+5%',
            up: true,
        },
        {
            label: 'Avg. Monthly Rent',
            value: avgRent ? `LKR ${avgRent.toLocaleString()}` : '—',
            sub: 'Across all published rooms',
            icon: <TrendingUp size={22} />,
            color: '#38F9D7',
            bg: 'rgba(56,249,215,0.15)',
            trend: '+3%',
            up: true,
        },
        {
            label: 'Registered Students',
            value: students,
            sub: `${landlords} landlords registered`,
            icon: <Users size={22} />,
            color: '#a855f7',
            bg: 'rgba(168,85,247,0.15)',
            trend: '-2%',
            up: false,
        },
    ];

    const sectionLabel = navItems.find(n => n.id === activeSection)?.label || 'Overview';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D1A', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

            {/* ══════════════════════════ SIDEBAR ══════════════════════════ */}
            <aside
                style={{
                    width: '240px',
                    background: 'rgba(18,18,40,0.97)',
                    borderRight: '1px solid rgba(252,211,77,0.12)',
                    display: 'flex', flexDirection: 'column',
                    position: 'fixed', top: 0, height: '100vh', zIndex: 50,
                    transition: 'left 0.3s',
                }}
                className="fm-sidebar"
            >
                {/* Logo */}
                <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(252,211,77,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(252,211,77,0.4)', flexShrink: 0 }}>
                            <DollarSign size={20} color="#0D0D1A" />
                        </div>
                        <div>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.3px' }}>Finance Panel</div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>BoardingFinder</div>
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
                                background: activeSection === item.id ? 'rgba(252,211,77,0.15)' : 'transparent',
                                border: activeSection === item.id ? '1px solid rgba(252,211,77,0.3)' : '1px solid transparent',
                                color: activeSection === item.id ? '#FCD34D' : 'rgba(255,255,255,0.55)',
                                fontSize: '0.9rem', fontWeight: activeSection === item.id ? 600 : 400,
                                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                            }}
                            onMouseEnter={(e) => { if (activeSection !== item.id) (e.currentTarget as HTMLElement).style.background = 'rgba(252,211,77,0.07)'; }}
                            onMouseLeave={(e) => { if (activeSection !== item.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                {/* User Info + Logout */}
                <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(252,211,77,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(252,211,77,0.05)', marginBottom: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <DollarSign size={15} color="#0D0D1A" />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name || 'Finance Manager'}</div>
                            <div style={{ fontSize: '0.68rem', color: '#FCD34D', opacity: 0.8 }}>Finance Manager</div>
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

            {/* ══════════════════════════ MAIN ══════════════════════════ */}
            <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="fm-main">

                {/* Top bar */}
                <header style={{ padding: '16px 28px', borderBottom: '1px solid rgba(252,211,77,0.1)', background: 'rgba(13,13,26,0.85)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="fm-menu-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{ display: 'none', background: 'rgba(252,211,77,0.1)', border: '1px solid rgba(252,211,77,0.25)', borderRadius: '10px', padding: '8px', color: '#FCD34D', cursor: 'pointer' }}
                        >
                            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <div>
                            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
                                {sectionLabel}
                            </h1>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.18)', color: '#FCD34D', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={17} />
                        </button>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(252,211,77,0.35)' }}>
                            <DollarSign size={16} color="#0D0D1A" />
                        </div>
                    </div>
                </header>

                {/* ── Page Content ── */}
                <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>

                    {/* ══════ OVERVIEW ══════ */}
                    {activeSection === 'overview' && (
                        <div>
                            {/* Welcome banner */}
                            <div style={{ background: 'linear-gradient(135deg, rgba(252,211,77,0.12) 0%, rgba(245,158,11,0.08) 100%)', border: '1px solid rgba(252,211,77,0.2)', borderRadius: '20px', padding: '24px 28px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px' }}>
                                        Welcome back, {currentUser?.name?.split(' ')[0] || 'Manager'} 👋
                                    </h2>
                                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>
                                        Here's the latest financial snapshot for BoardingFinder.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => setActiveSection('listings')}
                                        style={{ padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #FCD34D, #F59E0B)', border: 'none', color: '#0D0D1A', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}
                                    >
                                        <Eye size={15} /> View Listings
                                    </button>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                                {statCards.map((s, i) => (
                                    <div
                                        key={i}
                                        style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '22px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)'; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                                {s.icon}
                                            </div>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', fontWeight: 700, color: s.up ? '#43E97B' : '#FF6584', padding: '3px 8px', borderRadius: '6px', background: s.up ? 'rgba(67,233,123,0.1)' : 'rgba(255,101,132,0.1)' }}>
                                                {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                                {s.trend}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", lineHeight: 1, color: '#fff', marginBottom: '5px' }}>{s.value}</div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '3px' }}>{s.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Revenue breakdown + recent listings */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="fm-grid">

                                {/* Revenue by room type */}
                                <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(252,211,77,0.12)', borderRadius: '18px', padding: '24px' }}>
                                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BarChart2 size={16} color="#FCD34D" /> Revenue by Room Type
                                    </h3>
                                    {(() => {
                                        const byType: Record<string, { count: number; total: number }> = {};
                                        publishedListings.forEach(b => {
                                            const t = b.roomType || 'Other';
                                            if (!byType[t]) byType[t] = { count: 0, total: 0 };
                                            byType[t].count++;
                                            byType[t].total += b.price || 0;
                                        });
                                        const entries = Object.entries(byType).sort((a, b) => b[1].total - a[1].total);
                                        const maxVal = entries[0]?.[1].total || 1;
                                        const colors = ['#FCD34D', '#43E97B', '#38F9D7', '#a855f7', '#FF6584'];
                                        if (entries.length === 0) return <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px 0', fontSize: '0.88rem' }}>No published listings yet.</p>;
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                {entries.map(([type, data], i) => (
                                                    <div key={type}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                                                            <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{type} <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>({data.count})</span></span>
                                                            <span style={{ color: colors[i % colors.length], fontWeight: 700 }}>LKR {data.total.toLocaleString()}</span>
                                                        </div>
                                                        <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)' }}>
                                                            <div style={{ height: '100%', borderRadius: '4px', background: colors[i % colors.length], width: `${(data.total / maxVal) * 100}%`, transition: 'width 0.8s ease' }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Recent listings */}
                                <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(252,211,77,0.12)', borderRadius: '18px', padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <TrendingUp size={16} color="#FCD34D" /> Recent Listings
                                        </h3>
                                        <button onClick={() => setActiveSection('listings')} style={{ background: 'none', border: 'none', color: '#FCD34D', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            View all <ChevronRight size={14} />
                                        </button>
                                    </div>
                                    {loadingBoardings ? (
                                        <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.3)' }}>
                                            <div style={{ width: '22px', height: '22px', border: '2px solid rgba(252,211,77,0.3)', borderTopColor: '#FCD34D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {boardings.slice(0, 5).map(b => {
                                                const sc: Record<string, string> = { published: '#43E97B', pending: '#FCD34D', rejected: '#FF6584' };
                                                return (
                                                    <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'rgba(252,211,77,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {b.photos?.[0]
                                                                ? <img src={`${API_BASE}${b.photos[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                : <Building2 size={18} color="rgba(252,211,77,0.4)" />}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>LKR {b.price?.toLocaleString()}/mo</div>
                                                        </div>
                                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: sc[b.status] || '#fff', padding: '2px 9px', borderRadius: '6px', background: `${sc[b.status] || '#fff'}18`, border: `1px solid ${sc[b.status] || '#fff'}33`, textTransform: 'capitalize', flexShrink: 0 }}>
                                                            {b.status}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            {boardings.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px 0', fontSize: '0.85rem' }}>No listings found.</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════ LISTINGS ══════ */}
                    {activeSection === 'listings' && (
                        <div>
                            {/* Search */}
                            <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '20px' }}>
                                <Search size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Search listings…"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(252,211,77,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(252,211,77,0.14)', borderRadius: '18px', padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                        All Listings <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: '8px' }}>({filteredBoardings.length})</span>
                                    </h2>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(67,233,123,0.1)', color: '#43E97B', border: '1px solid rgba(67,233,123,0.25)', fontWeight: 600 }}>Published: {publishedListings.length}</span>
                                        <span style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(252,211,77,0.1)', color: '#FCD34D', border: '1px solid rgba(252,211,77,0.25)', fontWeight: 600 }}>Pending: {pendingListings.length}</span>
                                    </div>
                                </div>

                                {loadingBoardings ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                                        <div style={{ width: '28px', height: '28px', border: '2px solid rgba(252,211,77,0.3)', borderTopColor: '#FCD34D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                                        Loading listings…
                                    </div>
                                ) : filteredBoardings.length === 0 ? (
                                    <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '30px 0' }}>No listings found.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {filteredBoardings.map(b => {
                                            const sc: Record<string, { color: string; bg: string }> = {
                                                published: { color: '#43E97B', bg: 'rgba(67,233,123,0.1)' },
                                                pending:   { color: '#FCD34D', bg: 'rgba(252,211,77,0.1)' },
                                                rejected:  { color: '#FF6584', bg: 'rgba(255,101,132,0.1)' },
                                            };
                                            const s = sc[b.status] || sc.pending;
                                            return (
                                                <div key={b._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
                                                    <div style={{ width: '58px', height: '58px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: 'rgba(252,211,77,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {b.photos?.[0]
                                                            ? <img src={`${API_BASE}${b.photos[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            : <Building2 size={22} color="rgba(252,211,77,0.4)" />}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                                                            <MapPin size={11} color="#FCD34D" />{b.location}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                                                            {b.roomType} · By {b.landlordName}
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 800, color: '#FCD34D' }}>LKR {b.price?.toLocaleString()}</div>
                                                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>/month</div>
                                                    </div>
                                                    <span style={{ padding: '4px 12px', borderRadius: '100px', background: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${s.color}44`, flexShrink: 0 }}>
                                                        {b.status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══════ TRANSACTIONS ══════ */}
                    {activeSection === 'transactions' && (
                        <div>
                            <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(252,211,77,0.14)', borderRadius: '18px', padding: '24px', marginBottom: '20px' }}>
                                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={18} color="#FCD34D" /> Transaction Ledger
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                                    {[
                                        { label: 'Total Expected Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, color: '#43E97B', icon: '💰' },
                                        { label: 'Published Listings', value: publishedListings.length, color: '#FCD34D', icon: '✅' },
                                        { label: 'Avg Rent / Room', value: avgRent ? `LKR ${avgRent.toLocaleString()}` : '—', color: '#38F9D7', icon: '📊' },
                                        { label: 'Pending Approvals', value: pendingListings.length, color: '#FF6584', icon: '⏳' },
                                    ].map((c, i) => (
                                        <div key={i} style={{ padding: '18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{c.icon}</div>
                                            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: c.color }}>{c.value}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{c.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Listing ledger table */}
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                                {['Listing', 'Location', 'Room Type', 'Landlord', 'Monthly Rent', 'Status'].map(h => (
                                                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {publishedListings.length === 0 && (
                                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)' }}>No published listings.</td></tr>
                                            )}
                                            {publishedListings.map(b => (
                                                <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(252,211,77,0.04)'; }}
                                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                                >
                                                    <td style={{ padding: '12px 12px', color: '#fff', fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</td>
                                                    <td style={{ padding: '12px 12px', color: 'rgba(255,255,255,0.55)' }}>{b.location}</td>
                                                    <td style={{ padding: '12px 12px', color: 'rgba(255,255,255,0.55)' }}>{b.roomType}</td>
                                                    <td style={{ padding: '12px 12px', color: 'rgba(255,255,255,0.55)' }}>{b.landlordName}</td>
                                                    <td style={{ padding: '12px 12px', color: '#FCD34D', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>LKR {b.price?.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 12px' }}>
                                                        <span style={{ padding: '3px 10px', borderRadius: '8px', background: 'rgba(67,233,123,0.1)', color: '#43E97B', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(67,233,123,0.25)' }}>Active</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════ USERS ══════ */}
                    {activeSection === 'users' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '22px' }}>
                                {[
                                    { label: 'Total Users', value: users.length, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
                                    { label: 'Students', value: students, color: '#43E97B', bg: 'rgba(67,233,123,0.12)' },
                                    { label: 'Landlords', value: landlords, color: '#38F9D7', bg: 'rgba(56,249,215,0.12)' },
                                    { label: 'Finance Managers', value: users.filter(u => u.userType === 'finance_manager').length, color: '#FCD34D', bg: 'rgba(252,211,77,0.12)' },
                                ].map((c, i) => (
                                    <div key={i} style={{ padding: '18px 20px', borderRadius: '16px', background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: c.color }}>{c.value}</div>
                                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>{c.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(252,211,77,0.14)', borderRadius: '18px', padding: '24px' }}>
                                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px' }}>All Users</h2>
                                {loadingUsers ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                                        <div style={{ width: '28px', height: '28px', border: '2px solid rgba(252,211,77,0.3)', borderTopColor: '#FCD34D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                                        Loading users…
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {users.map(u => {
                                            const tc: Record<string, { color: string; bg: string }> = {
                                                admin:           { color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
                                                student:         { color: '#43E97B', bg: 'rgba(67,233,123,0.15)' },
                                                landlord:        { color: '#38F9D7', bg: 'rgba(56,249,215,0.15)' },
                                                finance_manager: { color: '#FCD34D', bg: 'rgba(252,211,77,0.15)' },
                                            };
                                            const c = tc[u.userType] || { color: '#fff', bg: 'rgba(255,255,255,0.1)' };
                                            return (
                                                <div key={u._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(252,211,77,0.04)'; }}
                                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 700, color: c.color, flexShrink: 0 }}>
                                                            {u.name?.slice(0, 2).toUpperCase() || '??'}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</div>
                                                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{u.email}</div>
                                                        </div>
                                                    </div>
                                                    <span style={{ padding: '4px 12px', borderRadius: '100px', background: c.bg, color: c.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${c.color}44` }}>
                                                        {u.userType?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {users.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '30px 0' }}>No users found.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══════ REPORTS ══════ */}
                    {activeSection === 'reports' && (
                        <div>
                            <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(252,211,77,0.14)', borderRadius: '18px', padding: '32px', marginBottom: '20px' }}>
                                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={18} color="#FCD34D" /> Financial Summary Report
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                                    {[
                                        { label: 'Total Listings',       value: boardings.length,            icon: '🏠' },
                                        { label: 'Published',            value: publishedListings.length,     icon: '✅' },
                                        { label: 'Pending Review',       value: pendingListings.length,       icon: '⏳' },
                                        { label: 'Total Monthly Revenue',value: `LKR ${totalRevenue.toLocaleString()}`, icon: '💰' },
                                        { label: 'Average Rent',         value: avgRent ? `LKR ${avgRent.toLocaleString()}` : '—', icon: '📊' },
                                        { label: 'Total Registered Users', value: users.length,             icon: '👥' },
                                    ].map((item, i) => (
                                        <div key={i} style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(252,211,77,0.12)', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#FCD34D', marginBottom: '4px' }}>{item.value}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '18px 20px', borderRadius: '14px', background: 'rgba(252,211,77,0.05)', border: '1px solid rgba(252,211,77,0.15)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                                    <strong style={{ color: '#FCD34D' }}>Report Date:</strong> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br />
                                    <strong style={{ color: '#FCD34D' }}>Generated by:</strong> {currentUser?.name} (Finance Manager)<br />
                                    <strong style={{ color: '#FCD34D' }}>Scope:</strong> All listings across BoardingFinder platform
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49 }} />
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                input::placeholder { color: rgba(255,255,255,0.25); }
                @media (max-width: 768px) {
                    .fm-sidebar { left: -240px !important; }
                    .fm-main { margin-left: 0 !important; }
                    .fm-menu-btn { display: flex !important; }
                    .fm-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default FinanceManagerDashboard;
