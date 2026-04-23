import { Bell, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const NotificationsPage = () => {
  const navigate = useNavigate();

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
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={20} color="#22d3ee" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>Notifications</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Updates about your activity will appear here.</p>
          </div>
        </div>

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
            When you receive updates (maintenance status, bookings, messages), they’ll show up here.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
