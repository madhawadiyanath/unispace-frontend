import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, LogOut, Bell, Calendar, Clock,
  CheckCircle, User, Mail, MapPin, Phone,
  ClipboardList, ChevronRight, Wrench, Droplets, Zap, Hammer, AlertCircle,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────── */
interface BookingRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  time: string;
  packageId: string;
  addOns: string[];
  notes: string;
  status: 'pending' | 'accepted' | 'completed';
  submittedAt: string;
}

type MaintenanceRequestStatus = 'pending' | 'accepted' | 'completed';

interface MaintenanceRequest {
  id: string;
  type: string;
  status: MaintenanceRequestStatus;
  submittedAt: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  time: string;
  priority: string;
  description: string;
  requestedById?: string;
  requestedByEmail?: string;
  acceptedById?: string;
  acceptedByName?: string;
  acceptedAt?: string;
  completedAt?: string;
}

const PACKAGE_NAMES: Record<string, string> = {
  basic: 'Basic Clean',
  deep: 'Deep Clean',
  moveout: 'Move-Out Clean',
};

const PACKAGE_COLORS: Record<string, string> = {
  basic: '#6C63FF',
  deep: '#a855f7',
  moveout: '#06b6d4',
};

/* ─── Component ──────────────────────────────────────────── */
const CleaningStaffDashboard = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

  useEffect(() => {
    const userType = String(currentUser?.userType || '').toLowerCase();
    const isStaff = userType === 'admin' || userType.includes('staff');
    if (!currentUser || !isStaff) {
      navigate('/login');
      return;
    }
    const saved = localStorage.getItem('cleaningBookings');
    if (saved) {
      try { setBookings(JSON.parse(saved)); } catch {}
    }

    const maintenanceSaved = localStorage.getItem('maintenanceRequests');
    if (maintenanceSaved) {
      try { setMaintenanceRequests(JSON.parse(maintenanceSaved)); } catch {}
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'maintenanceRequests') {
        try {
          const raw = localStorage.getItem('maintenanceRequests');
          const parsed = raw ? JSON.parse(raw) : [];
          setMaintenanceRequests(Array.isArray(parsed) ? parsed : []);
        } catch {
          setMaintenanceRequests([]);
        }
      }
      if (e.key === 'cleaningBookings') {
        try {
          const raw = localStorage.getItem('cleaningBookings');
          const parsed = raw ? JSON.parse(raw) : [];
          setBookings(Array.isArray(parsed) ? parsed : []);
        } catch {
          setBookings([]);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* ── Helpers ── */
  const updateStatus = (id: string, status: BookingRequest['status']) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    localStorage.setItem('cleaningBookings', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceRequestStatus) => {
    const now = new Date().toISOString();
    const updated = maintenanceRequests.map(r => {
      if (r.id !== id) return r;
      if (status === 'accepted') {
        return {
          ...r,
          status,
          acceptedById: currentUser?._id,
          acceptedByName: currentUser?.name,
          acceptedAt: now,
        };
      }
      if (status === 'completed') {
        return {
          ...r,
          status,
          completedAt: now,
        };
      }
      return { ...r, status };
    });
    setMaintenanceRequests(updated);
    localStorage.setItem('maintenanceRequests', JSON.stringify(updated));
  };

  const pending   = bookings.filter(b => b.status === 'pending');
  const accepted  = bookings.filter(b => b.status === 'accepted');
  const completed = bookings.filter(b => b.status === 'completed');

  const displayed =
    activeTab === 'pending'   ? pending   :
    activeTab === 'accepted'  ? accepted  :
    activeTab === 'completed' ? completed :
    bookings;

  const maintenanceForStaff = maintenanceRequests
    .filter(r => r.type !== 'cleaning')
    .slice()
    .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));

  const pendingMaintenanceCount = maintenanceForStaff.filter(r => r.status === 'pending').length;

  /* ─────────────────────────── JSX ─────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

      {/* ── Top Header ── */}
      <header style={{
        background: 'rgba(18,18,40,0.97)',
        borderBottom: '1px solid rgba(34,211,238,0.15)',
        padding: '0 28px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(34,211,238,0.4)' }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px' }}>Staff Dashboard</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>UniSpace Cleaning</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px 5px 6px', borderRadius: '100px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#0D0D1A' }}>
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'CS'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.name || 'Staff'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.25)', color: '#FF6584', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.2)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.1)'}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* ── Welcome Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(6,182,212,0.06) 100%)',
          border: '1px solid rgba(34,211,238,0.2)',
          borderRadius: '22px',
          padding: '28px 32px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(34,211,238,0.07)', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={15} color="#22d3ee" />
              <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: 700, letterSpacing: '1.5px' }}>CLEANING STAFF PORTAL</span>
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, margin: '0 0 6px' }}>
              Welcome, {currentUser?.name || 'Staff'}! 👋
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.87rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} /> {currentUser?.email}
            </p>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'New Requests', count: pending.length,   color: '#FCD34D', bg: 'rgba(252,211,77,0.12)',  border: 'rgba(252,211,77,0.3)'  },
              { label: 'In Progress',  count: accepted.length,  color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.3)'  },
              { label: 'Completed',    count: completed.length, color: '#43E97B', bg: 'rgba(67,233,123,0.12)', border: 'rgba(67,233,123,0.3)'  },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '14px 22px', textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab Filter ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {([
            { id: 'all',       label: `All Bookings (${bookings.length})`,   icon: <ClipboardList size={14} /> },
            { id: 'pending',   label: `New Requests (${pending.length})`,    icon: <Bell size={14} /> },
            { id: 'accepted',  label: `In Progress (${accepted.length})`,    icon: <Calendar size={14} /> },
            { id: 'completed', label: `Completed (${completed.length})`,     icon: <CheckCircle size={14} /> },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '10px',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #22d3ee, #06b6d4)' : 'rgba(255,255,255,0.05)',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: activeTab === tab.id ? '#0D0D1A' : 'rgba(255,255,255,0.6)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Booking Cards ── */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ marginBottom: '14px', opacity: 0.4 }}><Sparkles size={40} /></div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              {activeTab === 'all' ? 'No booking requests yet. Share the cleaning page with students!' : `No ${activeTab} bookings.`}
            </p>
            {activeTab === 'all' && (
              <button
                onClick={() => navigate('/cleaning-service')}
                style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                View Cleaning Page <ChevronRight size={14} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {displayed.map(booking => {
              const pkgColor = PACKAGE_COLORS[booking.packageId] || '#6C63FF';
              const statusMap = {
                pending:   { color: '#FCD34D', bg: 'rgba(252,211,77,0.12)',  border: 'rgba(252,211,77,0.3)',  label: '● New Request'  },
                accepted:  { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.3)', label: '◉ In Progress'  },
                completed: { color: '#43E97B', bg: 'rgba(67,233,123,0.12)', border: 'rgba(67,233,123,0.3)', label: '✓ Completed'    },
              };
              const s = statusMap[booking.status];

              return (
                <div
                  key={booking.id}
                  style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${pkgColor}44`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.3)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  {/* Card Top Accent */}
                  <div style={{ height: '4px', background: `linear-gradient(90deg, ${pkgColor}, ${pkgColor}88)` }} />

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                          {PACKAGE_NAMES[booking.packageId] || booking.packageId}
                        </div>
                        {booking.addOns?.length > 0 && (
                          <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                            + {booking.addOns.join(', ')}
                          </div>
                        )}
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '100px', background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${s.border}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {s.label}
                      </span>
                    </div>

                    {/* Customer Details */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { icon: <User    size={13} color={pkgColor} />, text: booking.name    },
                        { icon: <Phone   size={13} color={pkgColor} />, text: booking.phone   },
                        { icon: <Mail    size={13} color={pkgColor} />, text: booking.email   },
                        { icon: <MapPin  size={13} color={pkgColor} />, text: booking.address },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)' }}>
                          {item.icon}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Schedule */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                        <Calendar size={13} color={pkgColor} /> {booking.date}
                      </div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                        <Clock size={13} color={pkgColor} /> {booking.time}
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, borderLeft: `3px solid ${pkgColor}55` }}>
                        📝 {booking.notes}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'accepted')}
                          style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 700, cursor: 'pointer', fontSize: '0.87rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.22)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.12)'}
                        >
                          <CheckCircle size={15} /> Accept Job
                        </button>
                      )}
                      {booking.status === 'accepted' && (
                        <button
                          onClick={() => updateStatus(booking.id, 'completed')}
                          style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(67,233,123,0.12)', border: '1px solid rgba(67,233,123,0.35)', color: '#43E97B', fontWeight: 700, cursor: 'pointer', fontSize: '0.87rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(67,233,123,0.22)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(67,233,123,0.12)'}
                        >
                          <CheckCircle size={15} /> Mark Complete
                        </button>
                      )}
                      {booking.status === 'completed' && (
                        <div style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)', color: '#43E97B', fontSize: '0.87rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <CheckCircle size={15} /> Done
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Maintenance Requests (Plumbing/Electrical/Repairs) ── */}
        <div style={{ marginTop: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(108,99,255,0.10)', border: '1px solid rgba(108,99,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wrench size={18} color="#a78bfa" />
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem' }}>Maintenance Requests</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                  {maintenanceForStaff.length} total
                  {pendingMaintenanceCount > 0 && (
                    <span style={{ color: '#FCD34D', fontWeight: 800 }}> · {pendingMaintenanceCount} pending</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/maintenance?tab=plumbing')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '12px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', color: '#a78bfa', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Open Maintenance Page <ChevronRight size={14} />
              </button>
              <button
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('maintenanceRequests');
                    const parsed = raw ? JSON.parse(raw) : [];
                    setMaintenanceRequests(Array.isArray(parsed) ? parsed : []);
                  } catch {
                    setMaintenanceRequests([]);
                  }
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.65)', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Refresh
              </button>
            </div>
          </div>

          {maintenanceForStaff.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '34px 18px', borderRadius: '18px', background: 'rgba(18,18,40,0.75)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}>
              <AlertCircle size={38} color="rgba(255,255,255,0.2)" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 800, color: 'rgba(255,255,255,0.55)' }}>No maintenance requests yet</div>
              <div style={{ fontSize: '0.85rem', marginTop: '6px' }}>When owners submit requests, they will appear here.</div>
            </div>
          ) : (
            <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
              {maintenanceForStaff.map(req => {
                const typeCfg: Record<string, { label: string; icon: ReactNode; color: string }> = {
                  plumbing: { label: 'Plumbing', icon: <Droplets size={16} />, color: '#06b6d4' },
                  electrical: { label: 'Electrical', icon: <Zap size={16} />, color: '#f59e0b' },
                  repairs: { label: 'Repairs', icon: <Hammer size={16} />, color: '#22c55e' },
                };
                const tc = typeCfg[req.type] || { label: req.type, icon: <Wrench size={16} />, color: '#a78bfa' };
                const statusMap: Record<MaintenanceRequestStatus, { color: string; bg: string; border: string; label: string }> = {
                  pending: { color: '#FCD34D', bg: 'rgba(252,211,77,0.12)', border: 'rgba(252,211,77,0.3)', label: '● Pending' },
                  accepted: { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.3)', label: '◉ Accepted' },
                  completed: { color: '#43E97B', bg: 'rgba(67,233,123,0.12)', border: 'rgba(67,233,123,0.3)', label: '✓ Completed' },
                };
                const s = statusMap[req.status];

                return (
                  <div key={req.id} style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '4px', background: `linear-gradient(90deg, ${tc.color}, ${tc.color}88)` }} />

                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: 800, color: '#fff' }}>
                            <span style={{ color: tc.color, opacity: 0.95 }}>{tc.icon}</span> {tc.label}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                            {new Date(req.submittedAt).toLocaleString()}
                          </div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '100px', background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 800, border: `1px solid ${s.border}` }}>
                          {s.label}
                        </span>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { icon: <User size={13} color={tc.color} />, text: req.name },
                          { icon: <Phone size={13} color={tc.color} />, text: req.phone },
                          { icon: <Mail size={13} color={tc.color} />, text: req.email },
                          { icon: <MapPin size={13} color={tc.color} />, text: req.address },
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)' }}>
                            {item.icon}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                          <Calendar size={13} color={tc.color} /> {req.date}
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                          <Clock size={13} color={tc.color} /> {req.time || '—'}
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, borderLeft: `3px solid ${tc.color}55` }}>
                        {req.description}
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        {req.status === 'pending' && (
                          <button
                            onClick={() => updateMaintenanceStatus(req.id, 'accepted')}
                            style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', fontWeight: 700, cursor: 'pointer', fontSize: '0.87rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.22)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.12)'}
                          >
                            <CheckCircle size={15} /> Accept
                          </button>
                        )}
                        {req.status === 'accepted' && (
                          <button
                            onClick={() => updateMaintenanceStatus(req.id, 'completed')}
                            style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(67,233,123,0.12)', border: '1px solid rgba(67,233,123,0.35)', color: '#43E97B', fontWeight: 700, cursor: 'pointer', fontSize: '0.87rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(67,233,123,0.22)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(67,233,123,0.12)'}
                          >
                            <CheckCircle size={15} /> Complete
                          </button>
                        )}
                        {req.status === 'completed' && (
                          <div style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)', color: '#43E97B', fontSize: '0.87rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <CheckCircle size={15} /> Done
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CleaningStaffDashboard;
