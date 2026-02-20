import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, CheckCircle, ArrowLeft, Calendar, Clock,
  MapPin, User, Phone, Mail, FileText, Star,
  Droplets, Wind, ShieldCheck, Layers, ChevronRight,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../Components/Navbar';

/* ─── Types ───────────────────────────────────────────────── */
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

interface BookingForm {
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

/* ─── Data ────────────────────────────────────────────────── */
const PACKAGES: ServicePackage[] = [
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

const TESTIMONIALS = [
  { name: 'Kavindra P.', uni: 'SLIIT', rating: 5, text: 'Booked the Deep Clean before my parents visited — the team was professional and my room has never looked better!' },
  { name: 'Thilini R.', uni: 'NSBM', rating: 5, text: 'Move-out clean was worth every rupee. Got my full deposit back from my landlord with zero complaints.' },
  { name: 'Dhanush M.', uni: 'UOC', rating: 4, text: 'Basic Clean every fortnight keeps stress away. Easy to book, always on time.' },
];

/* ─── Component ───────────────────────────────────────────── */
const CleaningServicePage = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [selectedPackage, setSelectedPackage] = useState<string>('deep');
  const [form, setForm] = useState<BookingForm>({
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
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ── Helpers ── */
  const pkg = PACKAGES.find(p => p.id === selectedPackage)!;

  const addOnTotal = ADD_ONS.filter(a => form.addOns.includes(a.id))
    .reduce((s, a) => s + a.price, 0);

  const totalPrice = (pkg?.price ?? 0) + addOnTotal;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const toggleAddOn = (id: string) => {
    setForm(prev => ({
      ...prev,
      addOns: prev.addOns.includes(id)
        ? prev.addOns.filter(a => a !== id)
        : [...prev.addOns, id],
    }));
  };

  const selectPackage = (id: string) => {
    setSelectedPackage(id);
    setForm(prev => ({ ...prev, packageId: id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.address || !form.date || !form.time) {
      setError('Please fill in all required fields.');
      return;
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(form.email)) { setError('Please enter a valid email address.'); return; }
    if (!/^\d{9,12}$/.test(form.phone.replace(/[\s\-+]/g, ''))) {
      setError('Please enter a valid phone number.'); return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Persist booking to localStorage for cleaning staff dashboard
      const newBooking = {
        id: Date.now().toString(),
        ...form,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      try {
        const existing = JSON.parse(localStorage.getItem('cleaningBookings') || '[]');
        localStorage.setItem('cleaningBookings', JSON.stringify([...existing, newBooking]));
      } catch {}
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D1A', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(108,99,255,0.5)', animation: 'pulse-glow 3s ease-in-out infinite' }}>
            <CheckCircle size={48} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Booking Confirmed! 🎉</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 32px' }}>
            Your <strong style={{ color: '#a855f7' }}>{pkg.name}</strong> has been booked for{' '}
            <strong style={{ color: '#fff' }}>{form.date}</strong> at{' '}
            <strong style={{ color: '#fff' }}>{form.time}</strong>.<br />
            A confirmation will be sent to <strong style={{ color: '#6C63FF' }}>{form.email}</strong>.
          </p>

          {/* Summary card */}
          <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
            {[
              ['Service', pkg.name],
              ['Address', form.address],
              ['Date & Time', `${form.date} · ${form.time}`],
              ['Total', `LKR ${totalPrice.toLocaleString()}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>{label}</span>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: currentUser?.name || '', phone: '', email: currentUser?.email || '', address: '', date: '', time: '', packageId: 'deep', addOns: [], notes: '' }); setSelectedPackage('deep'); }}
              style={{ padding: '12px 24px', borderRadius: '12px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Book Another
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Back to Home
            </button>
          </div>
        </div>
        <style>{`@keyframes pulse-glow { 0%,100%{box-shadow:0 0 30px rgba(108,99,255,0.4)} 50%{box-shadow:0 0 60px rgba(168,85,247,0.7)} }`}</style>
      </div>
    );
  }

  /* ── Main Page ── */
  return (
    <div style={{ minHeight: '100vh', background: '#0D0D1A', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
      <Navbar />

      {/* ── Hero Banner ── */}
      <div
        style={{
          paddingTop: '120px',
          paddingBottom: '64px',
          background: 'linear-gradient(160deg, rgba(108,99,255,0.15) 0%, rgba(168,85,247,0.08) 50%, transparent 100%)',
          borderBottom: '1px solid rgba(108,99,255,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '10%', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(108,99,255,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '5%', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(168,85,247,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '28px' }}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px' }}>
            <Sparkles size={14} color="#a855f7" />
            <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600, letterSpacing: '1px' }}>CAMPUS CLEANING SERVICE</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.15 }}>
            Keep Your Boarding{' '}
            <span style={{ background: 'linear-gradient(135deg, #6C63FF, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Spotless
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Professional cleaning tailored for student boardings. Affordable packages, flexible scheduling, trained cleaners.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {[
              { icon: <ShieldCheck size={16} color="#22d3ee" />, label: 'Verified Cleaners' },
              { icon: <Star size={16} color="#f59e0b" />, label: '4.9★ Average Rating' },
              { icon: <Clock size={16} color="#a855f7" />, label: 'On-Time Guarantee' },
              { icon: <CheckCircle size={16} color="#22c55e" />, label: '100% Satisfaction' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* ── Service Packages ── */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px', textAlign: 'center' }}>Choose Your Package</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: '0 0 36px', fontSize: '0.9rem' }}>All prices are in LKR. GST included.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          {PACKAGES.map(p => {
            const isSelected = selectedPackage === p.id;
            return (
              <div
                key={p.id}
                onClick={() => selectPackage(p.id)}
                style={{
                  position: 'relative',
                  background: isSelected
                    ? `rgba(${p.id === 'basic' ? '108,99,255' : p.id === 'deep' ? '168,85,247' : '6,182,212'},0.12)`
                    : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isSelected ? p.color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '20px',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: isSelected ? `0 8px 30px ${p.color}30` : 'none',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.border = `2px solid ${p.color}55`; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.border = '2px solid rgba(255,255,255,0.08)'; }}
              >
                {p.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', borderRadius: '100px', padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '1px' }}>
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>{p.icon}</div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 700 }}>{p.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: '0 0 16px' }}>{p.description}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: p.color }}>LKR {p.price.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '20px' }}>
                  <Clock size={13} /> {p.duration}
                </div>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)' }}>
                      <CheckCircle size={14} color={p.color} style={{ flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: p.color, borderRadius: '10px', padding: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
                    <CheckCircle size={16} /> Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Two-Column Layout: Add-ons + Form ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: '32px', alignItems: 'start' }}>

          {/* ── Left: Add-ons + Summary ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Add-ons */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Optional Add-ons</h3>
              {ADD_ONS.map(addon => {
                const checked = form.addOns.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', background: checked ? 'rgba(108,99,255,0.12)' : 'transparent', border: `1px solid ${checked ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', marginBottom: '8px', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddOn(addon.id)}
                        style={{ accentColor: '#6C63FF', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.8)' }}>{addon.label}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#a855f7', fontWeight: 600 }}>+LKR {addon.price}</span>
                  </label>
                );
              })}
            </div>

            {/* Price Summary */}
            <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#6C63FF" /> Price Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{pkg.name}</span>
                  <span>LKR {pkg.price.toLocaleString()}</span>
                </div>
                {ADD_ONS.filter(a => form.addOns.includes(a.id)).map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{a.label}</span>
                    <span>LKR {a.price}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#a855f7' }}>LKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                Payment collected on the day of service. Cash or online transfer accepted.
              </div>
            </div>

            {/* Why Us */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Why Students Love Us</h3>
              {[
                { icon: <Star size={15} color="#f59e0b" />, text: 'Rated 4.9 / 5 by 200+ students' },
                { icon: <Clock size={15} color="#a855f7" />, text: 'Always on time, never cancel' },
                { icon: <ShieldCheck size={15} color="#22d3ee" />, text: 'Background-checked cleaners' },
                { icon: <CheckCircle size={15} color="#22c55e" />, text: 'Eco-friendly cleaning products' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                  {item.icon} {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Booking Form ── */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '32px' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 800 }}>Book Your Cleaning</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: '0 0 28px' }}>Fill in your details and we'll confirm within 2 hours.</p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#FF6584', fontSize: '0.875rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Row: Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <div style={inputWrapStyle}>
                    <User size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <div style={inputWrapStyle}>
                    <Phone size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="07X XXXXXXX" required style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address *</label>
                <div style={inputWrapStyle}>
                  <Mail size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle} />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={labelStyle}>Boarding Address *</label>
                <div style={inputWrapStyle}>
                  <MapPin size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                  <input name="address" value={form.address} onChange={handleChange} placeholder="No. 12, Galle Road, Colombo 03" required style={inputStyle} />
                </div>
              </div>

              {/* Row: Date + Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Preferred Date *</label>
                  <div style={inputWrapStyle}>
                    <Calendar size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Preferred Time *</label>
                  <div style={inputWrapStyle}>
                    <Clock size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                    <select name="time" value={form.time} onChange={handleChange} required style={{ ...inputStyle, appearance: 'none' as const }}>
                      <option value="">Select slot</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Additional Notes <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span></label>
                <div style={{ ...inputWrapStyle, alignItems: 'flex-start', padding: '10px 14px' }}>
                  <FileText size={15} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="E.g. focus on bathroom, have a pet, need eco products…"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                  />
                </div>
              </div>

              {/* Booking summary pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.85rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Selected: <strong style={{ color: '#fff' }}>{pkg.name}</strong></span>
                <span style={{ color: '#a855f7', fontWeight: 700 }}>LKR {totalPrice.toLocaleString()}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', background: loading ? 'rgba(108,99,255,0.4)' : 'linear-gradient(135deg, #6C63FF, #a855f7)', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.25s', boxShadow: loading ? 'none' : '0 6px 20px rgba(108,99,255,0.4)' }}
                onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(108,99,255,0.55)'; }}}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = loading ? 'none' : '0 6px 20px rgba(108,99,255,0.4)'; }}
              >
                {loading ? (
                  <>
                    <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Confirming Booking…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Confirm Booking
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, textAlign: 'center', margin: '0 0 8px' }}>What Students Say</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '0 0 36px', fontSize: '0.9rem' }}>Real reviews from real boarders.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.7, margin: '0 0 16px' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>{t.uni} Student</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 30px rgba(108,99,255,0.4)} 50%{box-shadow:0 0 60px rgba(168,85,247,0.7)} }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #1a1a2e; color: #fff; }
        @media (max-width: 768px) {
          .booking-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ─── Shared input styles ─────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '7px',
  letterSpacing: '0.3px',
};

const inputWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '11px 14px',
  transition: 'border-color 0.2s',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#fff',
  fontSize: '0.9rem',
  width: '100%',
};

export default CleaningServicePage;
