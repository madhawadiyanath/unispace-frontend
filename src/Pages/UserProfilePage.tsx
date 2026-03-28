import { useEffect, useMemo, useState } from 'react';
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
  Wrench,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

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

interface IssueReport {
  _id: string;
  boardingId: string;
  boardingTitle: string;
  tenantName: string;
  tenantEmail: string;
  issueType: 'cleaning' | 'plumbing' | 'electrical' | 'repairs';
  priority: 'low' | 'medium' | 'high';
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

type MaintenanceRequestStatus = 'pending' | 'accepted' | 'completed' | 'rejected';

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
  rejectedAt?: string;
}

type ApiMaintenanceRequest = {
  _id: string;
  requesterId: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
  address: string;
  category: string;
  priority: string;
  preferredDate: string;
  preferredTime?: string;
  description: string;
  status: MaintenanceRequestStatus;
  acceptedById?: string;
  acceptedByName?: string;
  acceptedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  createdAt?: string;
};

const mapApiMaintenanceRequest = (r: ApiMaintenanceRequest): MaintenanceRequest => {
  return {
    id: r._id,
    type: r.category,
    status: r.status,
    submittedAt: r.createdAt || '',
    name: r.requesterName || '',
    phone: r.requesterPhone || '',
    email: r.requesterEmail || '',
    address: r.address,
    date: r.preferredDate,
    time: r.preferredTime || '',
    priority: r.priority,
    description: r.description,
    requestedById: r.requesterId,
    requestedByEmail: r.requesterEmail || '',
    acceptedById: r.acceptedById,
    acceptedByName: r.acceptedByName,
    acceptedAt: r.acceptedAt,
    completedAt: r.completedAt,
    rejectedAt: r.rejectedAt,
  };
};

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
  const [issueReports, setIssueReports] = useState<IssueReport[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

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

      // Fetch issue reports for this landlord
      setLoadingIssues(true);
      fetch(`${API_BASE}/issues/landlord/${user._id}`)
        .then(r => r.json())
        .then(data => setIssueReports(data.issues || []))
        .catch(() => {})
        .finally(() => setLoadingIssues(false));

      // Fetch maintenance requests for this owner
      fetch(`${API_BASE}/maintenance/requester/${encodeURIComponent(user._id)}`)
        .then(r => r.json())
        .then(data => {
          const list = (data?.requests || []) as ApiMaintenanceRequest[];
          const mapped = Array.isArray(list) ? list.map(mapApiMaintenanceRequest) : [];
          setMaintenanceRequests(mapped);
        })
        .catch(() => setMaintenanceRequests([]));
    }
  }, [navigate]);

  const acceptedMaintenanceForOwner = useMemo(() => {
    if (!currentUser) return [];
    const id = currentUser._id;
    const email = currentUser.email;
    return maintenanceRequests
      .filter(r => (r.status === 'accepted' || r.status === 'completed'))
      .filter(r => (id && r.requestedById === id) || (email && (r.requestedByEmail === email || r.email === email)))
      .sort((a, b) => (b.acceptedAt || b.submittedAt || '').localeCompare(a.acceptedAt || a.submittedAt || ''));
  }, [maintenanceRequests, currentUser]);

  const handleRemoveFromCart = (id: string) => {
    const updated = cartItems.filter(item => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('boardingCart', JSON.stringify(updated));
  };

  const handleMarkAsRead = (id: string) => {
    fetch(`${API_BASE}/chat/${id}/read`, { method: 'PUT' }).catch(() => {});
    setChatMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
  };

  const handleUpdateIssueStatus = (id: string, status: string) => {
    fetch(`${API_BASE}/issues/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    setIssueReports(prev => prev.map(i => i._id === id ? { ...i, status: status as IssueReport['status'] } : i));
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
                onClick={() => navigate('/profile/edit')}
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

        {/* ── Landlord: Issue Reports section ── */}
        {currentUser.userType === 'landlord' && (
          <div
            style={{
              marginTop: '24px',
              background: 'rgba(18, 18, 40, 0.80)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(252,211,77,0.2)',
              borderRadius: '24px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(252,211,77,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(252,211,77,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <AlertTriangle size={18} color="#FCD34D" />
                  {issueReports.filter(i => i.status === 'open').length > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: '100px', padding: '1px 6px', minWidth: '18px', textAlign: 'center' }}>
                      {issueReports.filter(i => i.status === 'open').length}
                    </span>
                  )}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>Issue Reports</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                    {issueReports.length} report{issueReports.length !== 1 ? 's' : ''}
                    {issueReports.filter(i => i.status === 'open').length > 0 && (
                      <span style={{ color: '#FCD34D', fontWeight: 700 }}> · {issueReports.filter(i => i.status === 'open').length} open</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Issue list */}
            <div style={{ padding: '16px 28px 24px' }}>
              {loadingIssues ? (
                <div style={{ textAlign: 'center', padding: '28px', color: 'rgba(255,255,255,0.35)' }}>
                  <div style={{ width: '24px', height: '24px', border: '2px solid rgba(252,211,77,0.3)', borderTopColor: '#FCD34D', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                  Loading issue reports…
                </div>
              ) : issueReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                  <AlertTriangle size={38} color="rgba(252,211,77,0.2)" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>No issue reports yet.</p>
                  <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.22)', fontSize: '0.8rem' }}>Tenants can report issues from the boarding details page.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {issueReports.map(issue => {
                    const typeConfig: Record<string, { color: string; bg: string; label: string; tab: string }> = {
                      cleaning:   { color: '#6C63FF', bg: 'rgba(108,99,255,0.12)', label: '🧹 Cleaning',   tab: 'cleaning' },
                      plumbing:   { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  label: '💧 Plumbing',   tab: 'plumbing' },
                      electrical: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '⚡ Electrical', tab: 'electrical' },
                      repairs:    { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  label: '🔨 Repairs',    tab: 'repairs' },
                    };
                    const priorityConfig: Record<string, { color: string; bg: string }> = {
                      low:    { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
                      medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                      high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
                    };
                    const statusConfig: Record<string, { color: string; bg: string }> = {
                      open:        { color: '#FCD34D', bg: 'rgba(252,211,77,0.12)' },
                      'in-progress': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
                      resolved:    { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
                    };
                    const tc = typeConfig[issue.issueType] || typeConfig.repairs;
                    const pc = priorityConfig[issue.priority] || priorityConfig.medium;
                    const sc = statusConfig[issue.status] || statusConfig.open;
                    return (
                      <div
                        key={issue._id}
                        style={{
                          padding: '18px 20px',
                          borderRadius: '16px',
                          background: issue.status === 'resolved' ? 'rgba(255,255,255,0.02)' : 'rgba(252,211,77,0.04)',
                          border: `1px solid ${issue.status === 'resolved' ? 'rgba(255,255,255,0.07)' : 'rgba(252,211,77,0.2)'}`,
                          opacity: issue.status === 'resolved' ? 0.65 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        {/* Top row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Boarding tag */}
                            {issue.boardingTitle && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.22)', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
                                🏠 {issue.boardingTitle}
                              </div>
                            )}
                            {/* Sender */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #FCD34D, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 800, color: '#0D0D1A' }}>
                                {issue.tenantName?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>{issue.tenantName || 'Tenant'}</div>
                                <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.4)' }}>{issue.tenantEmail}</div>
                              </div>
                            </div>
                          </div>
                          {/* Right: date + status */}
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>
                              {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', background: sc.bg, color: sc.color, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${sc.color}44`, textTransform: 'capitalize' }}>
                              {issue.status}
                            </span>
                          </div>
                        </div>

                        {/* Badges row */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '100px', background: tc.bg, color: tc.color, fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${tc.color}44` }}>
                            {tc.label}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '100px', background: pc.bg, color: pc.color, fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${pc.color}44`, textTransform: 'capitalize' }}>
                            {issue.priority} Priority
                          </span>
                        </div>

                        {/* Description */}
                        <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.65, background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px 14px', borderLeft: `3px solid ${tc.color}66` }}>
                          {issue.description}
                        </p>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {/* View Boarding */}
                          <button
                            onClick={() => navigate(`/boarding/${issue.boardingId}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', color: '#a78bfa', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.25)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.12)'; }}
                          >
                            <ExternalLink size={12} /> View Boarding
                          </button>

                          {/* Request Maintenance — links to /maintenance?tab=issueType */}
                          {issue.status !== 'resolved' && (
                            <button
                              onClick={() => navigate(`/maintenance?tab=${tc.tab}`)}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', background: `${tc.color}22`, border: `1px solid ${tc.color}55`, color: tc.color, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${tc.color}38`; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${tc.color}22`; }}
                            >
                              <Wrench size={12} /> Request Maintenance
                            </button>
                          )}

                          {/* Mark as in-progress */}
                          {issue.status === 'open' && (
                            <button
                              onClick={() => handleUpdateIssueStatus(issue._id, 'in-progress')}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', color: '#06b6d4', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.2)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.08)'; }}
                            >
                              ⚙ Mark In-Progress
                            </button>
                          )}

                          {/* Mark as resolved */}
                          {issue.status !== 'resolved' && (
                            <button
                              onClick={() => handleUpdateIssueStatus(issue._id, 'resolved')}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.2)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.08)'; }}
                            >
                              ✓ Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Landlord: Accepted Maintenance Requests ── */}
        {currentUser.userType === 'landlord' && (
          <div
            style={{
              marginTop: '24px',
              background: 'rgba(18, 18, 40, 0.80)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(34,211,238,0.18)',
              borderRadius: '24px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(34,211,238,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,211,238,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={18} color="#22d3ee" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem' }}>Maintenance Requests</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                    {acceptedMaintenanceForOwner.length} accepted / completed
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!currentUser?._id) return;
                  fetch(`${API_BASE}/maintenance/requester/${encodeURIComponent(currentUser._id)}`)
                    .then(r => r.json())
                    .then(data => {
                      const list = (data?.requests || []) as ApiMaintenanceRequest[];
                      const mapped = Array.isArray(list) ? list.map(mapApiMaintenanceRequest) : [];
                      setMaintenanceRequests(mapped);
                    })
                    .catch(() => setMaintenanceRequests([]));
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Refresh
              </button>
            </div>

            <div style={{ padding: '16px 28px 24px' }}>
              {acceptedMaintenanceForOwner.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                  <Wrench size={38} color="rgba(34,211,238,0.18)" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>No accepted maintenance requests yet.</p>
                  <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.22)', fontSize: '0.8rem' }}>After staff accepts your request, it will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {acceptedMaintenanceForOwner.map(r => {
                    const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
                      plumbing: { label: '💧 Plumbing', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
                      electrical: { label: '⚡ Electrical', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                      repairs: { label: '🔨 General Repairs', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
                      cleaning: { label: '🧹 Cleaning', color: '#6C63FF', bg: 'rgba(108,99,255,0.12)' },
                    };
                    const tc = typeConfig[r.type] || { label: r.type, color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' };
                    const statusCfg = r.status === 'completed'
                      ? { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' }
                      : { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' };

                    return (
                      <div key={r.id} style={{ padding: '16px 18px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '100px', background: tc.bg, color: tc.color, fontSize: '0.75rem', fontWeight: 800, border: `1px solid ${tc.color}44` }}>
                              {tc.label}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '100px', background: statusCfg.bg, color: statusCfg.color, fontSize: '0.75rem', fontWeight: 800, border: `1px solid ${statusCfg.color}44`, textTransform: 'capitalize' }}>
                              {r.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>
                            {new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>

                        <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,0.78)', fontSize: '0.875rem', lineHeight: 1.6, background: 'rgba(0,0,0,0.18)', borderRadius: '12px', padding: '10px 12px', borderLeft: `3px solid ${tc.color}66` }}>
                          {r.description}
                        </p>

                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color={tc.color} /> {r.address}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color={tc.color} /> {r.date}{r.time ? ` · ${r.time}` : ''}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><User size={14} color={tc.color} /> {r.acceptedByName || 'Staff'}</span>
                        </div>

                        {r.acceptedAt && (
                          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                            Accepted · {new Date(r.acceptedAt).toLocaleString()}
                            {r.completedAt ? ` · Completed · ${new Date(r.completedAt).toLocaleString()}` : ''}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
