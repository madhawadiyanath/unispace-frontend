import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Wrench, Sparkles, Droplets, Zap, Hammer,
  CheckCircle, ArrowLeft, Calendar, Clock,
  MapPin, User, Phone, Mail, FileText, Star,
  ClipboardList,
  Wind, ShieldCheck, Layers, AlertCircle, ChevronRight,
  AlertTriangle, Settings,
} from 'lucide-react';
import Navbar from '../Components/Navbar';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

/* ─── Types ─────────────────────────────────────────────── */
interface ServicePackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  icon: ReactNode;
}

interface CleaningForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  time: string;
  packageId: string;
  addOns: string[];
  notes: string;
}

interface MaintenanceForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  time: string;
  priority: string;
  description: string;
}

type MaintenanceRequestStatus = 'pending' | 'accepted' | 'completed' | 'rejected';

interface MaintenanceRequest extends MaintenanceForm {
  id: string;
  type: string;
  status: MaintenanceRequestStatus;
  submittedAt: string;
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

/* ─── Cleaning Data ──────────────────────────────────────── */
const CLEANING_PACKAGES: ServicePackage[] = [
  {
    id: 'basic',
    name: 'Basic Clean',
    price: 1200,
    duration: '2–3 hrs',
    description: 'Perfect for regular weekly upkeep of your room.',
    features: [
      'Sweeping & mopping floors',
      'Dusting surfaces & furniture',
      'Bin emptying',
      'Bathroom wipe-down',
      'Window sill cleaning',
    ],
    color: '#6C63FF',
    icon: <Droplets size={28} color="#6C63FF" />,
  },
  {
    id: 'deep',
    name: 'Deep Clean',
    price: 2500,
    duration: '4–5 hrs',
    description: 'Thorough top-to-bottom cleaning for a fresh start.',
    features: [
      'Everything in Basic Clean',
      'Inside cupboard & wardrobe clean',
      'Under-bed vacuuming',
      'Mattress sanitisation',
      'Full bathroom scrub',
      'Kitchen deep-clean',
    ],
    popular: true,
    color: '#a855f7',
    icon: <Wind size={28} color="#a855f7" />,
  },
  {
    id: 'moveout',
    name: 'Move-Out Clean',
    price: 3800,
    duration: '5–7 hrs',
    description: 'Leave your boarding spotless and get your deposit back.',
    features: [
      'Everything in Deep Clean',
      'Wall spot-cleaning',
      'Full appliance clean',
      'Balcony / outdoor area',
      'Waste disposal',
      'Final inspection checklist',
    ],
    color: '#06b6d4',
    icon: <Layers size={28} color="#06b6d4" />,
  },
];

const ADD_ONS = [
  { id: 'laundry', label: 'Laundry & Folding', price: 400 },
  { id: 'windows', label: 'Window Glass Cleaning', price: 300 },
  { id: 'fridge', label: 'Fridge Interior Clean', price: 250 },
  { id: 'shoes', label: 'Shoe & Rack Organising', price: 200 },
];

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
];

/* ─── Maintenance Categories ─────────────────────────────── */
const CATEGORIES = [
  {
    id: 'cleaning',
    label: 'Cleaning',
    icon: <Sparkles size={18} />,
    color: '#6C63FF',
    description: 'Room & boarding cleaning services',
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    icon: <Droplets size={18} />,
    color: '#06b6d4',
    description: 'Leaks, pipes & water issues',
  },
  {
    id: 'electrical',
    label: 'Electrical',
    icon: <Zap size={18} />,
    color: '#f59e0b',
    description: 'Wiring, switches & power issues',
  },
  {
    id: 'repairs',
    label: 'General Repairs',
    icon: <Hammer size={18} />,
    color: '#22c55e',
    description: 'Furniture, walls & general fixes',
  },
];

/* ─── Component ──────────────────────────────────────────── */
const MaintenancePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'cleaning';
  const [activeTab, setActiveTab] = useState(initialTab);

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  /* ── Cleaning state ── */
  const [selectedPackage, setSelectedPackage] = useState('deep');
  const [cleaningForm, setCleaningForm] = useState<CleaningForm>({
    name: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    date: '',
    time: '',
    packageId: 'deep',
    addOns: [],
    notes: '',
  });
  const [cleaningError, setCleaningError] = useState('');
  const [cleaningSubmitted, setCleaningSubmitted] = useState(false);
  const [cleaningLoading, setCleaningLoading] = useState(false);

  /* ── Generic maintenance state ── */
  const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceForm>({
    name: currentUser?.name || '',
    phone: '',
    email: currentUser?.email || '',
    address: '',
    date: '',
    time: '',
    priority: 'medium',
    description: '',
  });
  const [maintenanceError, setMaintenanceError] = useState('');
  const [maintenanceSubmitted, setMaintenanceSubmitted] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

  const isStaffUser = useMemo(() => {
    const t = String(currentUser?.userType || '').toLowerCase();
    return t === 'admin' || t.includes('staff');
  }, [currentUser?.userType]);

  const sanitizePhone10 = (value: string) => value.replace(/\D/g, '').slice(0, 10);
  const sanitizeLettersSpaces = (value: string) => value.replace(/[^A-Za-z\s]/g, '');
  const sanitizeLettersSpacesNewlines = (value: string) => value.replace(/[^A-Za-z\s\n\r]/g, '');

  const isLettersSpaces = (value: string) => /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(value.trim());

  const loadMaintenanceRequests = async () => {
    try {
      if (!currentUser?._id) {
        setMaintenanceRequests([]);
        return;
      }

      // Cleaning is handled separately (local booking workflow), so don't fetch maintenance for that tab.
      if (activeTab === 'cleaning') {
        setMaintenanceRequests([]);
        return;
      }

      const url = isStaffUser
        ? `${API_BASE}/maintenance?category=${encodeURIComponent(activeTab)}`
        : `${API_BASE}/maintenance/requester/${encodeURIComponent(currentUser._id)}`;

      const res = await fetch(url);
      const data = await res.json();
      const list = (data?.requests || []) as ApiMaintenanceRequest[];
      const mapped = Array.isArray(list) ? list.map(mapApiMaintenanceRequest) : [];
      setMaintenanceRequests(isStaffUser ? mapped : mapped.filter(r => r.type === activeTab));
    } catch {
      setMaintenanceRequests([]);
    }
  };

  useEffect(() => {
    void loadMaintenanceRequests();
  }, [activeTab, isStaffUser, currentUser?._id]);

  /* ── Cleaning helpers ── */
  const pkg = CLEANING_PACKAGES.find(p => p.id === selectedPackage)!;
  const addOnTotal = ADD_ONS.filter(a => cleaningForm.addOns.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const totalPrice = (pkg?.price ?? 0) + addOnTotal;

  const handleCleaningChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'phone' ? sanitizePhone10(String(value)) :
      name === 'name' ? sanitizeLettersSpaces(String(value)) :
      value;
    setCleaningForm(prev => ({ ...prev, [name]: nextValue }));
    setCleaningError('');
  };

  const toggleAddOn = (id: string) => {
    setCleaningForm(prev => ({
      ...prev,
      addOns: prev.addOns.includes(id) ? prev.addOns.filter(a => a !== id) : [...prev.addOns, id],
    }));
  };

  const selectPackage = (id: string) => {
    setSelectedPackage(id);
    setCleaningForm(prev => ({ ...prev, packageId: id }));
  };

  const handleCleaningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleaningForm.name || !cleaningForm.phone || !cleaningForm.email || !cleaningForm.address || !cleaningForm.date || !cleaningForm.time) {
      setCleaningError('Please fill in all required fields.'); return;
    }
    if (!isLettersSpaces(cleaningForm.name)) { setCleaningError('Full name must contain letters only.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaningForm.email)) { setCleaningError('Please enter a valid email address.'); return; }
    if (!/^\d{10}$/.test(sanitizePhone10(cleaningForm.phone))) { setCleaningError('Phone number must be exactly 10 digits (numbers only).'); return; }
    setCleaningLoading(true);
    setTimeout(() => {
      const newBooking = { id: Date.now().toString(), ...cleaningForm, status: 'pending', submittedAt: new Date().toISOString() };
      try {
        const existing = JSON.parse(localStorage.getItem('cleaningBookings') || '[]');
        localStorage.setItem('cleaningBookings', JSON.stringify([...existing, newBooking]));
      } catch {}
      setCleaningLoading(false);
      setCleaningSubmitted(true);
    }, 1400);
  };

  /* ── Maintenance helpers ── */
  const handleMaintenanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextValue =
      name === 'phone' ? sanitizePhone10(String(value)) :
      name === 'name' ? sanitizeLettersSpaces(String(value)) :
      name === 'description' ? sanitizeLettersSpacesNewlines(String(value)) :
      value;
    setMaintenanceForm(prev => ({ ...prev, [name]: nextValue }));
    setMaintenanceError('');
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceForm.name || !maintenanceForm.phone || !maintenanceForm.email || !maintenanceForm.address || !maintenanceForm.date || !maintenanceForm.description) {
      setMaintenanceError('Please fill in all required fields.'); return;
    }
    if (!isLettersSpaces(maintenanceForm.name)) { setMaintenanceError('Full name must contain letters only.'); return; }
    if (!/^[A-Za-z\s\n\r]+$/.test(maintenanceForm.description.trim())) { setMaintenanceError('Issue description must contain letters only.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(maintenanceForm.email)) { setMaintenanceError('Please enter a valid email address.'); return; }
    if (!/^\d{10}$/.test(sanitizePhone10(maintenanceForm.phone))) { setMaintenanceError('Phone number must be exactly 10 digits (numbers only).'); return; }
    if (!currentUser?._id) {
      setMaintenanceError('Please log in to submit a request.');
      return;
    }

    setMaintenanceLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/maintenance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterId: currentUser._id,
            requesterName: maintenanceForm.name,
            requesterEmail: maintenanceForm.email,
            requesterPhone: maintenanceForm.phone,
            address: maintenanceForm.address,
            category: activeTab,
            priority: maintenanceForm.priority,
            preferredDate: maintenanceForm.date,
            preferredTime: maintenanceForm.time,
            description: maintenanceForm.description,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setMaintenanceError(data?.message || 'Failed to submit request.');
          return;
        }

        // Refresh list so staff/owner sees the new request immediately.
        await loadMaintenanceRequests();
        setMaintenanceSubmitted(true);
      } catch {
        setMaintenanceError('Failed to submit request.');
      } finally {
        setMaintenanceLoading(false);
      }
    })();
  };

  const activeCat = CATEGORIES.find(c => c.id === activeTab)!;

  const myMaintenanceRequests = useMemo(() => {
    const email = currentUser?.email;
    const id = currentUser?._id;
    if (!email && !id) return [];
    return maintenanceRequests
      .filter(r => (id && r.requestedById === id) || (email && (r.requestedByEmail === email || r.email === email)))
      .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
  }, [maintenanceRequests, currentUser?._id, currentUser?.email]);

  const requestsForUserAndTab = useMemo(() => {
    const base = maintenanceRequests
      .filter(r => r.type === activeTab)
      .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
    if (isStaffUser) return base;
    return myMaintenanceRequests.filter(r => r.type === activeTab);
  }, [maintenanceRequests, activeTab, isStaffUser, myMaintenanceRequests]);

  const updateMaintenanceRequestStatus = (id: string, status: MaintenanceRequestStatus) => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/maintenance/${encodeURIComponent(id)}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            acceptedById: currentUser?._id,
            acceptedByName: currentUser?.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) return;
        const updated = mapApiMaintenanceRequest(data.request as ApiMaintenanceRequest);
        setMaintenanceRequests(prev => prev.map(r => r.id === id ? updated : r));
      } catch {
        // keep UI as-is on failure
      }
    })();
  };

  /* ─── Input style helper ─── */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '10px',
    color: 'var(--input-text)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  };

  const openNativeDatePicker = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
    input.showPicker?.();
  };

  /* ─── Cleaning success ─── */
  if (cleaningSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--app-bg)', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--text-primary)' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(108,99,255,0.5)', animation: 'pulse-glow 3s ease-in-out infinite' }}>
            <CheckCircle size={48} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>Booking Confirmed! 🎉</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 32px' }}>
            Your <strong style={{ color: '#a855f7' }}>{pkg.name}</strong> has been booked for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{cleaningForm.date}</strong> at{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{cleaningForm.time}</strong>.<br />
            A confirmation will be sent to <strong style={{ color: '#6C63FF' }}>{cleaningForm.email}</strong>.
          </p>
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-1)', borderRadius: '16px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              ['Service', pkg.name],
              ['Address', cleaningForm.address],
              ['Date & Time', `${cleaningForm.date} · ${cleaningForm.time}`],
              ['Total', `LKR ${totalPrice.toLocaleString()}`],
            ].map(([label, val], idx, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: idx === arr.length - 1 ? 'none' : '1px solid var(--border-1)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setCleaningSubmitted(false); setCleaningForm({ name: currentUser?.name || '', phone: '', email: currentUser?.email || '', address: '', date: '', time: '', packageId: 'deep', addOns: [], notes: '' }); setSelectedPackage('deep'); }} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              Book Another
            </button>
            <button onClick={() => navigate('/')} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--btn-primary-bg)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', boxShadow: 'var(--btn-primary-shadow-sm)' }}>
              Back to Home
            </button>
          </div>
        </div>
        <style>{`@keyframes pulse-glow { 0%,100%{box-shadow:0 0 30px rgba(108,99,255,0.4)} 50%{box-shadow:0 0 60px rgba(168,85,247,0.7)} }`}</style>
      </div>
    );
  }

  /* ─── Maintenance success ─── */
  if (maintenanceSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--app-bg)', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--text-primary)' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: `linear-gradient(135deg, ${activeCat.color}, ${activeCat.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: `0 0 40px ${activeCat.color}55` }}>
            <CheckCircle size={48} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>Request Submitted! ✅</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 32px' }}>
            Your <strong style={{ color: activeCat.color }}>{activeCat.label}</strong> request has been received.<br />
            Our team will contact you at <strong style={{ color: '#6C63FF' }}>{maintenanceForm.email}</strong> shortly.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setMaintenanceSubmitted(false); setMaintenanceForm({ name: currentUser?.name || '', phone: '', email: currentUser?.email || '', address: '', date: '', time: '', priority: 'medium', description: '' }); }} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              New Request
            </button>
            <button onClick={() => navigate('/')} style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--btn-primary-bg)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', boxShadow: 'var(--btn-primary-shadow-sm)' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Main Page ─── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)', fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)' }}>
      <Navbar />

      {/* ── Hero Banner ── */}
      <div style={{ paddingTop: '120px', paddingBottom: '56px', background: 'var(--gradient-hero)', borderBottom: '1px solid var(--border-1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(108,99,255,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '5%', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(168,85,247,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', background: 'var(--nav-link-hover-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--nav-link)', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '28px' }}>
            <ArrowLeft size={14} /> Back to Home
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--nav-link-hover-bg)', border: '1px solid var(--btn-ghost-border)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px' }}>
            <Wrench size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '1px' }}>MAINTENANCE SERVICES</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15 }}>
            Keep Your Boarding{' '}
            <span style={{ background: 'var(--gradient-purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Well Maintained
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            From routine cleaning to urgent repairs — one place to manage all your boarding maintenance needs.
          </p>
          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {[
              { icon: <ShieldCheck size={15} color="#22d3ee" />, label: 'Verified Technicians' },
              { icon: <Star size={15} color="#f59e0b" />, label: '4.9★ Rated Service' },
              { icon: <Clock size={15} color="#a855f7" />, label: 'On-Time Guarantee' },
              { icon: <CheckCircle size={15} color="#22c55e" />, label: '100% Satisfaction' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Tab Navigation ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '48px' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveTab(cat.id); setMaintenanceError(''); setMaintenanceSubmitted(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: isActive ? `rgba(${cat.id === 'cleaning' ? '108,99,255' : cat.id === 'plumbing' ? '6,182,212' : cat.id === 'electrical' ? '245,158,11' : '34,197,94'},0.15)` : 'var(--surface-1)',
                  border: `2px solid ${isActive ? cat.color : 'var(--border-1)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  boxShadow: isActive ? `0 4px 20px ${cat.color}30` : 'none',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.border = `2px solid ${cat.color}55`; (e.currentTarget as HTMLElement).style.background = isActive ? '' : 'var(--surface-2)'; }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.border = '2px solid var(--border-1)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface-1)'; } }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${cat.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: cat.color }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isActive ? 'var(--text-primary)' : 'var(--text-primary)' }}>{cat.label}</div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>{cat.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ═══════════ CLEANING TAB ═══════════ */}
        {activeTab === 'cleaning' && (
          <div>
            {/* Sub-header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} color="#6C63FF" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Cleaning Service</h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>Professional room & boarding cleaning — affordable, flexible, trusted</p>
              </div>
            </div>

            {/* Packages */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Choose Your Package</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 24px' }}>All prices in LKR · GST included</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '48px' }}>
              {CLEANING_PACKAGES.map(p => {
                const isSelected = selectedPackage === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => selectPackage(p.id)}
                    style={{
                      position: 'relative',
                      background: isSelected ? 'var(--surface-2)' : 'var(--surface-1)',
                      border: `2px solid ${isSelected ? p.color : 'var(--border-1)'}`,
                      borderRadius: '18px', padding: '24px', cursor: 'pointer', transition: 'all 0.25s',
                      boxShadow: isSelected ? `0 10px 34px ${p.color}20` : 'none',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.border = `2px solid ${p.color}55`; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.border = '2px solid var(--border-1)'; }}
                  >
                    {p.popular && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--btn-primary-bg)', borderRadius: '100px', padding: '4px 14px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '1px', color: '#fff' }}>
                        ⭐ MOST POPULAR
                      </div>
                    )}
                    <div style={{ marginBottom: '12px' }}>{p.icon}</div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 14px' }}>{p.description}</p>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: p.color, marginBottom: '4px' }}>LKR {p.price.toLocaleString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '18px' }}>
                      <Clock size={12} /> {p.duration}
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {p.features.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <CheckCircle size={13} color={p.color} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Add-ons */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px' }}>Optional Add-Ons</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '48px' }}>
              {ADD_ONS.map(a => {
                const isSelected = cleaningForm.addOns.includes(a.id);
                return (
                  <div
                    key={a.id}
                    onClick={() => toggleAddOn(a.id)}
                    style={{
                      padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                      background: isSelected ? 'var(--nav-link-hover-bg)' : 'var(--surface-1)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.label}</div>
                      <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)', marginTop: '2px' }}>+LKR {a.price}</div>
                    </div>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isSelected ? 'var(--primary)' : 'var(--border-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <CheckCircle size={14} color="#fff" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Booking Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
              <form onSubmit={handleCleaningSubmit}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#6C63FF" /> Booking Details
                </h3>
                {cleaningError && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                    <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>{cleaningError}</span>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  {[
                    { name: 'name', label: 'Full Name *', icon: <User size={14} />, type: 'text', placeholder: 'Your name' },
                    { name: 'phone', label: 'Phone Number *', icon: <Phone size={14} />, type: 'tel', placeholder: '07X XXX XXXX' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{f.icon} {f.label}</label>
                      <input
                        name={f.name}
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(cleaningForm as any)[f.name]}
                        onChange={handleCleaningChange}
                        inputMode={f.name === 'phone' ? 'numeric' : undefined}
                        pattern={f.name === 'phone' ? '\\d{10}' : undefined}
                        maxLength={f.name === 'phone' ? 10 : undefined}
                        autoComplete={f.name === 'phone' ? 'tel' : undefined}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><Mail size={14} /> Email Address *</label>
                  <input name="email" type="email" placeholder="you@example.com" value={cleaningForm.email} onChange={handleCleaningChange} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><MapPin size={14} /> Boarding Address *</label>
                  <input name="address" type="text" placeholder="No. 12, Temple Road, Nugegoda" value={cleaningForm.address} onChange={handleCleaningChange} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><Calendar size={14} /> Preferred Date *</label>
                    <input name="date" type="date" value={cleaningForm.date} onClick={openNativeDatePicker} onChange={handleCleaningChange} min={new Date().toISOString().split('T')[0]} style={{ ...inputStyle, colorScheme: 'light dark' }} />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><Clock size={14} /> Preferred Time *</label>
                    <select name="time" value={cleaningForm.time} onChange={handleCleaningChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><FileText size={14} /> Special Instructions</label>
                  <textarea name="notes" placeholder="Any specific instructions for the cleaners…" value={cleaningForm.notes} onChange={handleCleaningChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={cleaningLoading} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: cleaningLoading ? 'rgba(108,99,255,0.4)' : 'linear-gradient(135deg, #6C63FF, #a855f7)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: cleaningLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(108,99,255,0.4)', transition: 'all 0.2s' }}>
                  {cleaningLoading ? <><Settings size={18} className="spin" /> Processing…</> : <><Sparkles size={18} /> Confirm Booking — LKR {totalPrice.toLocaleString()}</>}
                </button>
              </form>

              {/* Order Summary */}
              <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-1)', borderRadius: '18px', padding: '24px', position: 'sticky', top: '96px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronRight size={16} color="#6C63FF" /> Order Summary
                </h3>
                <div style={{ background: 'var(--surface-2)', border: `1px solid ${pkg.color}33`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pkg.name}</span>
                    <span style={{ color: pkg.color, fontWeight: 700 }}>LKR {pkg.price.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {pkg.duration}
                  </div>
                </div>
                {cleaningForm.addOns.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px' }}>ADD-ONS</div>
                    {ADD_ONS.filter(a => cleaningForm.addOns.includes(a.id)).map(a => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-1)' }}>
                        <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{a.label}</span>
                        <span style={{ fontSize: '0.83rem', color: 'var(--primary)' }}>+LKR {a.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-1)', paddingTop: '16px' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #6C63FF, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    LKR {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={13} /> Satisfaction guaranteed or we re-clean for free
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ NON-CLEANING TABS ═══════════ */}
        {activeTab !== 'cleaning' && (
          <div style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '80px' }}>
            {/* Tab sub-header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '20px 24px', borderRadius: '16px', background: 'var(--surface-2)', border: `1px solid ${activeCat.color}33` }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${activeCat.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeCat.color, flexShrink: 0 }}>
                {activeCat.icon}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{activeCat.label}</h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{activeCat.description}</p>
              </div>
            </div>

            {/* What's covered */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '36px' }}>
              {(activeTab === 'plumbing'
                ? ['Leaking taps & pipes', 'Blocked drains', 'Water pressure issues', 'Toilet repairs', 'Shower fixing', 'Water heater issues']
                : activeTab === 'electrical'
                  ? ['Power outages', 'Switch & socket repairs', 'Light fitting issues', 'Fuse box problems', 'Fan installation', 'Wiring inspection']
                  : ['Door & window repairs', 'Wall cracks & patches', 'Furniture assembly', 'Ceiling fan fixing', 'Lock & key issues', 'General handyman work']
              ).map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', background: 'var(--surface-1)', border: '1px solid var(--border-1)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={13} color={activeCat.color} /> {item}
                </div>
              ))}
            </div>

            {/* Request Form */}
            <form onSubmit={handleMaintenanceSubmit} style={{ background: 'var(--surface-2)', border: '1px solid var(--border-1)', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={16} color={activeCat.color} /> Submit a Request
              </h3>
              {maintenanceError && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                  <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>{maintenanceError}</span>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {[
                  { name: 'name', label: 'Full Name *', icon: <User size={14} />, type: 'text', placeholder: 'Your name' },
                  { name: 'phone', label: 'Phone Number *', icon: <Phone size={14} />, type: 'tel', placeholder: '07X XXX XXXX' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{f.icon} {f.label}</label>
                    <input
                      name={f.name}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(maintenanceForm as any)[f.name]}
                      onChange={handleMaintenanceChange}
                      inputMode={f.name === 'phone' ? 'numeric' : undefined}
                      pattern={f.name === 'phone' ? '\\d{10}' : undefined}
                      maxLength={f.name === 'phone' ? 10 : undefined}
                      autoComplete={f.name === 'phone' ? 'tel' : undefined}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><Mail size={14} /> Email Address *</label>
                <input name="email" type="email" placeholder="you@example.com" value={maintenanceForm.email} onChange={handleMaintenanceChange} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><MapPin size={14} /> Boarding Address *</label>
                <input name="address" type="text" placeholder="No. 12, Temple Road, Nugegoda" value={maintenanceForm.address} onChange={handleMaintenanceChange} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><Calendar size={14} /> Preferred Date *</label>
                  <input name="date" type="date" value={maintenanceForm.date} onClick={openNativeDatePicker} onChange={handleMaintenanceChange} min={new Date().toISOString().split('T')[0]} style={{ ...inputStyle, colorScheme: 'light dark' }} />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><Clock size={14} /> Preferred Time</label>
                  <select name="time" value={maintenanceForm.time} onChange={handleMaintenanceChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><AlertTriangle size={14} /> Priority Level</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[{ id: 'low', label: 'Low', color: '#22c55e' }, { id: 'medium', label: 'Medium', color: '#f59e0b' }, { id: 'high', label: 'High', color: '#ef4444' }].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setMaintenanceForm(prev => ({ ...prev, priority: p.id }))}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '10px', border: `1.5px solid ${maintenanceForm.priority === p.id ? p.color : 'var(--border-1)'}`,
                        background: maintenanceForm.priority === p.id ? `${p.color}22` : 'transparent',
                        color: maintenanceForm.priority === p.id ? p.color : 'var(--text-muted)',
                        fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}><FileText size={14} /> Issue Description *</label>
                <textarea name="description" placeholder={`Describe the ${activeCat.label.toLowerCase()} issue in detail…`} value={maintenanceForm.description} onChange={handleMaintenanceChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={maintenanceLoading} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: maintenanceLoading ? `${activeCat.color}66` : `linear-gradient(135deg, ${activeCat.color}, ${activeCat.color}bb)`, border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: maintenanceLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 4px 20px ${activeCat.color}44`, transition: 'all 0.2s' }}>
                {maintenanceLoading ? <><Settings size={18} /> Processing…</> : <><Wrench size={18} /> Submit {activeCat.label} Request</>}
              </button>
            </form>

            {/* Requests list (Staff can see/accept; owners can track) */}
            <div style={{ marginTop: '22px', background: 'var(--surface-2)', border: '1px solid var(--border-1)', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${activeCat.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClipboardList size={17} color={activeCat.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                      {isStaffUser ? 'Requests To Handle' : 'My Requests'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {requestsForUserAndTab.length} {activeCat.label.toLowerCase()} request{requestsForUserAndTab.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <button type="button" onClick={loadMaintenanceRequests} style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--surface-1)', border: '1px solid var(--border-1)', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                  Refresh
                </button>
              </div>

              <div style={{ padding: '16px 22px 22px' }}>
                {requestsForUserAndTab.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)' }}>
                    <AlertCircle size={34} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>No requests yet</div>
                    <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                      {isStaffUser
                        ? `When owners submit ${activeCat.label.toLowerCase()} requests, they will appear here.`
                        : `Submit a request above to see it listed here.`}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {requestsForUserAndTab.map((r) => {
                      const statusCfg: Record<MaintenanceRequestStatus, { color: string; bg: string; border: string; label: string }> = {
                        pending: { color: '#FCD34D', bg: 'rgba(252,211,77,0.12)', border: 'rgba(252,211,77,0.3)', label: '● Pending' },
                        accepted: { color: '#22d3ee', bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.3)', label: '◉ Accepted' },
                        completed: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', label: '✓ Completed' },
                        rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.25)', label: '✕ Rejected' },
                      };
                      const sc = statusCfg[r.status] || statusCfg.pending;
                      const prCfg: Record<string, { color: string; bg: string; border: string }> = {
                        low: { color: '#22c55e', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.25)' },
                        medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)' },
                        high: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.25)' },
                      };
                      const pc = prCfg[r.priority] || prCfg.medium;

                      return (
                        <div key={r.id} style={{ padding: '16px 16px', borderRadius: '16px', background: 'var(--surface-1)', border: '1px solid var(--border-1)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '100px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: '0.72rem', fontWeight: 800 }}>
                                  {sc.label}
                                </span>
                                <span style={{ padding: '4px 10px', borderRadius: '100px', background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, fontSize: '0.72rem', fontWeight: 800, textTransform: 'capitalize' }}>
                                  {r.priority} priority
                                </span>
                              </div>
                              <div style={{ marginTop: '8px', fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                {r.name || 'Requester'}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {new Date(r.submittedAt).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {isStaffUser && r.status === 'pending' && (
                                <button type="button" onClick={() => updateMaintenanceRequestStatus(r.id, 'accepted')} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                                  Accept
                                </button>
                              )}
                              {isStaffUser && r.status === 'accepted' && (
                                <button type="button" onClick={() => updateMaintenanceRequestStatus(r.id, 'completed')} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Mail size={14} color={activeCat.color} /> {r.email}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Phone size={14} color={activeCat.color} /> {r.phone}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={14} color={activeCat.color} /> {r.address}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={14} color={activeCat.color} /> {r.date}{r.time ? ` · ${r.time}` : ''}
                            </div>
                          </div>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--surface-3)', border: '1px solid var(--border-1)', borderRadius: '12px', padding: '10px 12px', lineHeight: 1.6 }}>
                            {r.description}
                          </div>

                          {(r.acceptedByName || r.acceptedAt || r.completedAt) && (
                            <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {r.status !== 'pending' && (
                                <div>
                                  Accepted by <strong style={{ color: 'var(--text-primary)' }}>{r.acceptedByName || 'Staff'}</strong>
                                  {r.acceptedAt ? ` · ${new Date(r.acceptedAt).toLocaleString()}` : ''}
                                </div>
                              )}
                              {r.status === 'completed' && r.completedAt && (
                                <div>
                                  Completed · {new Date(r.completedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom spacing */}
        {activeTab === 'cleaning' && <div style={{ height: '80px' }} />}
      </div>

      <style>{`
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 30px rgba(108,99,255,0.4)} 50%{box-shadow:0 0 60px rgba(168,85,247,0.7)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .spin { animation: spin 1s linear infinite; }
        input::placeholder, textarea::placeholder { color: var(--text-muted); }
        input:focus, textarea:focus, select:focus { border-color: var(--input-focus-border) !important; box-shadow: var(--input-focus-ring) !important; }
        select option { background: var(--select-option-bg); color: var(--text-primary); }
        @media (max-width: 768px) {
          .cleaning-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
