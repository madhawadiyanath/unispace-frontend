import { useEffect, useMemo, useState } from 'react';
import { Bell, ArrowLeft, RefreshCw, CheckCircle, CreditCard, MessageCircle, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const API_BASE = 'http://localhost:5000';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'booking' | 'payment' | 'message' | 'system';
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const queryString = useMemo(() => {
    if (!currentUser) return '';
    const params = new URLSearchParams();
    if (currentUser.email) params.set('email', currentUser.email);
    if (currentUser.userType) params.set('role', String(currentUser.userType).toLowerCase());
    return params.toString();
  }, [currentUser]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!queryString) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/notifications?${queryString}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setNotifications(data.notifications || []);
        } else {
          setError(data.message || 'Failed to load notifications.');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [queryString]);

  const iconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking': return <CheckCircle size={18} />;
      case 'payment': return <CreditCard size={18} />;
      case 'message': return <MessageCircle size={18} />;
      case 'system': return <Shield size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const colorForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking': return '#43E97B';
      case 'payment': return '#FCD34D';
      case 'message': return '#38F9D7';
      case 'system': return '#a855f7';
      default: return '#22d3ee';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 24px 40px' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '12px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-1)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: 700,
            marginBottom: '18px',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'color-mix(in srgb, #22d3ee 12%, transparent)', border: '1px solid color-mix(in srgb, #22d3ee 25%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} color="#22d3ee" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>Notifications</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Booking approvals, payments, and messages will appear here.</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', marginBottom: '14px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {currentUser ? `Signed in as ${currentUser.name || currentUser.email}` : 'Sign in to see your notifications'}
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-1)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div style={{ marginTop: '8px' }}>
          {loading ? (
            <div style={{ padding: '30px', borderRadius: '18px', background: 'var(--card-bg)', border: '1px solid var(--border-1)', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading notifications…
            </div>
          ) : error ? (
            <div style={{ padding: '18px 22px', borderRadius: '18px', background: 'var(--danger-soft-bg)', border: '1px solid var(--danger-soft-border)', color: 'var(--danger-soft-text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          ) : notifications.length === 0 ? (
            <div
              style={{
                marginTop: '22px',
                padding: '22px',
                borderRadius: '18px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-1)',
              }}
            >
              <p style={{ margin: 0, fontWeight: 800 }}>No notifications yet</p>
              <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                When you get a booking approval, payment update, or message, it will show up here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {notifications.map((item) => {
                const color = colorForType(item.type);
                return (
                  <div
                    key={item._id}
                    style={{
                      padding: '18px 20px',
                      borderRadius: '18px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-1)',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: `color-mix(in srgb, ${color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                      {iconForType(item.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{item.title}</h3>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          {item.type}
                        </span>
                      </div>
                      <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.92rem' }}>
                        {item.message}
                      </p>
                      <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(item.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
