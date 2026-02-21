import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Home,
  LogOut,
  Edit3,
  ArrowLeft,
  Calendar,
  BadgeCheck,
  PlusCircle,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Trash2,
  ExternalLink,
  MessageSquare,
  MailOpen,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

interface Boarding {
  _id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  roomType: string;
  createdAt: string;
}

interface CartItem {
  _id: string;
  title: string;
  price: number;
  location: string;
  photos: string[];
  timestamp: number;
}

interface ChatMessage {
  _id: string;
  boardingId: string;
  boardingTitle: string;
  senderName: string;
  senderEmail: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [myBoardings, setMyBoardings] = useState<Boarding[]>([]);
  const [loadingBoardings, setLoadingBoardings] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(stored);
    setCurrentUser(user);

    // Load cart items from localStorage
    const savedCart = localStorage.getItem('boardingCart');
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch {}
    }

    // Fetch landlord's own boarding submissions
    if (user.userType === 'landlord') {
      setLoadingBoardings(true);
      fetch(`${API_BASE}/boardings/landlord/${user._id}`)
        .then(r => r.json())
        .then(data => setMyBoardings(data.boardings || []))
        .catch(() => {})
        .finally(() => setLoadingBoardings(false));

      // Fetch messages sent to this landlord
      setLoadingMessages(true);
      fetch(`${API_BASE}/chat/owner/${user._id}`)
        .then(r => r.json())
        .then(data => setChatMessages(data.messages || []))
        .catch(() => {})
        .finally(() => setLoadingMessages(false));
    }
  }, [navigate]);

  const handleRemoveFromCart = (id: string) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('boardingCart', JSON.stringify(updated));
  };

  const handleMarkAsRead = (id: string) => {
    fetch(`${API_BASE}/chat/${id}/read`, { method: 'PUT' }).catch(() => {});
    setChatMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (!currentUser) return null;

  const avatarLetter = currentUser.name?.[0]?.toUpperCase() || 'U';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D0D1A 0%, #1a0533 50%, #0D0D1A 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', top: '-150px', right: '-150px', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', bottom: '-100px', left: '-100px', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(13,13,26,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(108,99,255,0.18)',
          padding: '0 32px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(108,99,255,0.5)' }}>
            <Home size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BoardingFinder
          </span>
        </Link>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 16px', borderRadius: '10px',
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.25)',
            color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem',
            fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.2)';
            (e.currentTarget as HTMLElement).style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.1)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
          }}
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '48px 24px 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Page title */}
        <div style={{ marginBottom: '36px' }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #fff 30%, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            My Profile
          </h1>
          <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
            Manage your account details
          </p>
        </div>

        {/* Profile card */}
        <div
          style={{
            background: 'rgba(18, 18, 40, 0.80)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Banner */}
          <div
            style={{
              height: '120px',
              background: 'linear-gradient(135deg, #6C63FF 0%, #a855f7 60%, #ec4899 100%)',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          {/* Avatar + name row */}
          <div style={{ padding: '0 36px 36px', position: 'relative' }}>
            {/* Avatar */}
            <div
              style={{
                width: '88px', height: '88px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
                border: '4px solid rgba(13,13,26,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: '#fff',
                boxShadow: '0 0 30px rgba(108,99,255,0.5)',
                position: 'absolute',
                top: '-44px',
              }}
            >
              {avatarLetter}
            </div>

            {/* Edit button top-right */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 18px', borderRadius: '10px',
                  background: 'rgba(108,99,255,0.12)',
                  border: '1px solid rgba(108,99,255,0.3)',
                  color: '#a855f7', fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.22)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.12)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            </div>

            {/* Name & badge */}
            <div style={{ marginTop: '28px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800, fontSize: '1.6rem', color: '#fff',
                  }}
                >
                  {currentUser.name}
                </h2>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '3px 12px',
                    borderRadius: '100px',
                    background: currentUser.userType === 'admin'
                      ? 'rgba(239,68,68,0.15)'
                      : 'rgba(108,99,255,0.15)',
                    border: `1px solid ${currentUser.userType === 'admin' ? 'rgba(239,68,68,0.35)' : 'rgba(108,99,255,0.35)'}`,
                    color: currentUser.userType === 'admin' ? '#f87171' : '#a78bfa',
                    fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}
                >
                  <BadgeCheck size={12} />
                  {currentUser.userType || 'student'}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                {currentUser.email}
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(108,99,255,0.15)', marginBottom: '28px' }} />

            {/* Info rows */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {/* Name */}
              <InfoRow
                icon={<User size={16} color="#a855f7" />}
                label="Full Name"
                value={currentUser.name}
              />
              {/* Email */}
              <InfoRow
                icon={<Mail size={16} color="#a855f7" />}
                label="Email Address"
                value={currentUser.email}
              />
              {/* Role */}
              <InfoRow
                icon={<Shield size={16} color="#a855f7" />}
                label="Account Type"
                value={currentUser.userType || 'student'}
                capitalize
              />
              {/* Member since */}
              <InfoRow
                icon={<Calendar size={16} color="#a855f7" />}
                label="Member Since"
                value={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              />
            </div>
          </div>
        </div>

        {/* ── Landlord: My Boardings section ── */}
        {currentUser.userType === 'landlord' && (
          <div
            style={{
              marginTop: '24px',
              background: 'rgba(18, 18, 40, 0.80)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: '24px',
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} color="#a855f7" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>My Boarding Listings</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{myBoardings.length} submission{myBoardings.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/boarding/add')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
                  color: '#fff', fontSize: '0.875rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 22px rgba(108,99,255,0.6)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(108,99,255,0.4)'; }}
              >
                <PlusCircle size={16} />
                Add New Boarding
              </button>
            </div>

            {/* Listing rows */}
            <div style={{ padding: '16px 28px 24px' }}>
              {loadingBoardings ? (
                <div style={{ textAlign: 'center', padding: '28px', color: 'rgba(255,255,255,0.35)' }}>
                  <div style={{ width: '24px', height: '24px', border: '2px solid rgba(108,99,255,0.3)', borderTopColor: '#6C63FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                  Loading your listings…
                </div>
              ) : myBoardings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                  <Building2 size={38} color="rgba(108,99,255,0.3)" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>No submissions yet.</p>
                  <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.22)', fontSize: '0.8rem' }}>Click "Add New Boarding" to get started.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {myBoardings.map(b => {
                    const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
                      pending:   { color: '#FCD34D', bg: 'rgba(252,211,77,0.12)',  icon: <Clock size={12} /> },
                      published: { color: '#43E97B', bg: 'rgba(67,233,123,0.12)', icon: <CheckCircle size={12} /> },
                      rejected:  { color: '#FF6584', bg: 'rgba(255,101,132,0.12)', icon: <XCircle size={12} /> },
                    };
                    const sc = statusConfig[b.status] || statusConfig.pending;
                    return (
                      <div key={b._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{b.location} · LKR {b.price.toLocaleString()}/mo · {b.roomType}</div>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '100px', background: sc.bg, color: sc.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${sc.color}44`, flexShrink: 0 }}>
                          {sc.icon}{b.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Landlord: Messages Inbox section ── */}
        {currentUser.userType === 'landlord' && (
          <div
            style={{
              marginTop: '24px',
              background: 'rgba(18, 18, 40, 0.80)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(56,249,215,0.2)',
              borderRadius: '24px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(56,249,215,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56,249,215,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <MessageSquare size={18} color="#38F9D7" />
                  {chatMessages.filter(m => !m.isRead).length > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#FF6584', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: '100px', padding: '1px 6px', minWidth: '18px', textAlign: 'center' }}>
                      {chatMessages.filter(m => !m.isRead).length}
                    </span>
                  )}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>Messages Inbox</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                    {chatMessages.length} message{chatMessages.length !== 1 ? 's' : ''}
                    {chatMessages.filter(m => !m.isRead).length > 0 && (
                      <span style={{ color: '#FF6584', fontWeight: 700 }}> · {chatMessages.filter(m => !m.isRead).length} unread</span>
                    )}
                  </p>
                </div>
              </div>
              {chatMessages.some(m => !m.isRead) && (
                <button
                  onClick={() => {
                    chatMessages.filter(m => !m.isRead).forEach(m => handleMarkAsRead(m._id));
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', background: 'rgba(56,249,215,0.08)', border: '1px solid rgba(56,249,215,0.25)', color: '#38F9D7', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(56,249,215,0.18)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(56,249,215,0.08)'; }}
                >
                  <MailOpen size={13} /> Mark all as read
                </button>
              )}
            </div>

            {/* Message list */}
            <div style={{ padding: '16px 28px 24px' }}>
              {loadingMessages ? (
                <div style={{ textAlign: 'center', padding: '28px', color: 'rgba(255,255,255,0.35)' }}>
                  <div style={{ width: '24px', height: '24px', border: '2px solid rgba(56,249,215,0.3)', borderTopColor: '#38F9D7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                  Loading messages…
                </div>
              ) : chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                  <MessageSquare size={38} color="rgba(56,249,215,0.2)" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>No messages yet.</p>
                  <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.22)', fontSize: '0.8rem' }}>Students will appear here once they chat about your listings.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {chatMessages.map(msg => (
                    <div
                      key={msg._id}
                      style={{
                        padding: '16px 18px',
                        borderRadius: '16px',
                        background: msg.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(56,249,215,0.06)',
                        border: `1px solid ${msg.isRead ? 'rgba(255,255,255,0.07)' : 'rgba(56,249,215,0.25)'}`,
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                    >
                      {/* Unread dot */}
                      {!msg.isRead && (
                        <span style={{ position: 'absolute', top: '16px', right: '16px', width: '8px', height: '8px', borderRadius: '50%', background: '#38F9D7', boxShadow: '0 0 8px rgba(56,249,215,0.8)' }} />
                      )}

                      {/* Sender info row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                          {msg.senderName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{msg.senderName || 'Unknown Student'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{msg.senderEmail}</div>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', flexShrink: 0, textAlign: 'right' }}>
                          {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}<br />
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Boarding tag */}
                      {msg.boardingTitle && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.22)', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600, marginBottom: '10px' }}>
                          🏠 {msg.boardingTitle}
                        </div>
                      )}

                      {/* Message body */}
                      <p style={{ margin: '0 0 12px', color: 'rgba(255,255,255,0.78)', fontSize: '0.875rem', lineHeight: 1.65, background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px 14px', borderLeft: '3px solid rgba(56,249,215,0.35)' }}>
                        {msg.message}
                      </p>

                      {/* Actions row */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => navigate(`/boarding/${msg.boardingId}`)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', color: '#a78bfa', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.25)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.12)'; }}
                        >
                          <ExternalLink size={12} /> View Boarding
                        </button>
                        {msg.senderEmail && (
                          <a
                            href={`mailto:${msg.senderEmail}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(56,249,215,0.08)', border: '1px solid rgba(56,249,215,0.22)', color: '#38F9D7', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(56,249,215,0.18)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(56,249,215,0.08)'; }}
                          >
                            ✉️ Reply via Email
                          </a>
                        )}
                        {!msg.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(msg._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                          >
                            ✓ Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Saved Boardings (Cart) section ── */}
        <div
          style={{
            marginTop: '24px',
            background: 'rgba(18, 18, 40, 0.80)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        >
          {/* Section header */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={18} color="#a855f7" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>Saved Boardings</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} saved</p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={() => { setCartItems([]); localStorage.setItem('boardingCart', '[]'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', background: 'rgba(255,101,132,0.08)', border: '1px solid rgba(255,101,132,0.25)', color: '#FF6584', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.18)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.08)'; }}
              >
                <Trash2 size={13} /> Clear All
              </button>
            )}
          </div>

          {/* Cart items list */}
          <div style={{ padding: '16px 28px 24px' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <ShoppingCart size={40} color="rgba(108,99,255,0.25)" style={{ marginBottom: '12px' }} />
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>No saved boardings yet.</p>
                <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.22)', fontSize: '0.8rem' }}>Browse listings and click "Add to Cart" to save them here.</p>
                <button
                  onClick={() => navigate('/')}
                  style={{ marginTop: '18px', padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(108,99,255,0.4)' }}
                >
                  Browse Boardings
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map(item => (
                  <div
                    key={item._id}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '16px', background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.14)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.1)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.05)'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: '72px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.photos && item.photos.length > 0 ? (
                        <img src={`${API_BASE}${item.photos[0]}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Home size={22} color="rgba(108,99,255,0.4)" />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>{item.location}</div>
                      <div style={{ fontSize: '0.82rem', color: '#a78bfa', fontWeight: 700, marginTop: '3px' }}>LKR {item.price?.toLocaleString()} / mo</div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => navigate(`/boarding/${item._id}`)}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.3)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.15)'; }}
                        title="View Listing"
                      >
                        <ExternalLink size={15} />
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item._id)}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,101,132,0.08)', border: '1px solid rgba(255,101,132,0.25)', color: '#FF6584', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.2)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.08)'; }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Logout card */}
        <div
          style={{
            marginTop: '24px',
            background: 'rgba(18, 18, 40, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,101,132,0.15)',
            borderRadius: '18px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Sign Out</h3>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              You will be returned to the home page.
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '12px',
              background: 'rgba(255,101,132,0.1)',
              border: '1px solid rgba(255,101,132,0.3)',
              color: '#FF6584', fontSize: '0.9rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.2)';
              (e.currentTarget as HTMLElement).style.borderColor = '#FF6584';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,101,132,0.1)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,101,132,0.3)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Small helper component ─────────────────────────────── */
const InfoRow = ({
  icon,
  label,
  value,
  capitalize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      padding: '16px 18px',
      borderRadius: '14px',
      background: 'rgba(108,99,255,0.06)',
      border: '1px solid rgba(108,99,255,0.12)',
    }}
  >
    <div
      style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'rgba(108,99,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 500, textTransform: capitalize ? 'capitalize' : 'none' }}>
        {value}
      </div>
    </div>
  </div>
);

// Add spin keyframe via a style tag appended to the component
const _style = document.createElement('style');
_style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
if (!document.head.querySelector('[data-profile-spin]')) {
  _style.setAttribute('data-profile-spin', '1');
  document.head.appendChild(_style);
}

export default UserProfilePage;
