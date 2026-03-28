import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home, ArrowLeft, Upload, X, CheckCircle,
  MapPin, Phone, Mail, User,
  FileText, Building2, Image, AlertCircle,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const ROOM_TYPES = ['Single Room', 'Double Room', 'Studio', 'Annex', 'Hostel Room', 'Shared Room'];
const UNIVERSITIES = ['SLIIT', 'NSBM', 'UOC (University of Colombo)', 'IIT', 'NIBM', 'Informatics', 'Other'];
const ALL_AMENITIES = ['WiFi', 'AC', 'Meals', 'Parking', 'Study Room', 'Kitchen', 'Laundry', 'Security', 'Hot Water', 'Garden', 'CCTV', 'Balcony'];

interface StoredUser {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

const BoardingFormPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stored = localStorage.getItem('user');
  const currentUser: StoredUser | null = stored ? JSON.parse(stored) : null;

  const [form, setForm] = useState({
    title: '',
    description: '',
    roomType: 'Single Room',
    price: '',
    location: '',
    nearUniversity: 'SLIIT',
    contactName: currentUser?.name || '',
    contactPhone: '',
    contactEmail: currentUser?.email || '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!currentUser || currentUser.userType !== 'landlord') {
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Inter', sans-serif", flexDirection: 'column', gap: '16px' }}>
        <AlertCircle size={48} color="#FF6584" />
        <h2 style={{ margin: 0 }}>Access Denied</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Only landlords can submit boarding listings.</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Go Home</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);
    setPhotos(prev => [...prev, ...toAdd]);
    const newPreviews = toAdd.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.location || !form.contactName) {
      setError('Please fill in all required fields.');
      return;
    }
    if (Number(form.price) <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('roomType', form.roomType);
      fd.append('price', form.price);
      fd.append('location', form.location);
      fd.append('nearUniversity', form.nearUniversity);
      fd.append('contactName', form.contactName);
      fd.append('contactPhone', form.contactPhone);
      fd.append('contactEmail', form.contactEmail);
      fd.append('amenities', JSON.stringify(selectedAmenities));
      fd.append('landlordId', currentUser._id);
      fd.append('landlordName', currentUser.name);
      photos.forEach(photo => fd.append('photos', photo));

      const res = await fetch(`${API_BASE}/boardings`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Submission failed. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Unable to connect to the server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D0D1A, #1a0533, #0D0D1A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(67,233,123,0.15)', border: '1px solid rgba(67,233,123,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={38} color="#43E97B" />
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.9rem', color: '#fff', margin: '0 0 12px' }}>Submitted!</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', margin: '0 0 32px', lineHeight: 1.6 }}>
            Your boarding listing has been submitted and is awaiting admin review. You'll be notified once it's published.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/profile')} style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
              Back to Profile
            </button>
            <button onClick={() => { setSuccess(false); setForm({ title: '', description: '', roomType: 'Single Room', price: '', location: '', nearUniversity: 'SLIIT', contactName: currentUser.name, contactPhone: '', contactEmail: currentUser.email }); setSelectedAmenities([]); setPhotos([]); setPreviews([]); }} style={{ padding: '12px 28px', borderRadius: '12px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', color: '#a855f7', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D0D1A 0%, #1a0533 50%, #0D0D1A 100%)', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,13,26,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(108,99,255,0.18)', padding: '0 32px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(108,99,255,0.5)' }}>
            <Home size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BoardingFinder</span>
        </Link>
        <button onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
          <ArrowLeft size={15} /> Back to Profile
        </button>
      </div>

      {/* Main */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
        {/* Page heading */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg, #fff 30%, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            Add Boarding Listing
          </h1>
          <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
            Fill in the details below. Your listing will be reviewed by admin before publishing.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Section 1: Basic Info ── */}
          <FormSection icon={<FileText size={18} color="#a855f7" />} title="Basic Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Listing Title <Req /></Label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Cozy Single Room near SLIIT" style={inputStyle} />
              </div>
              <div>
                <Label>Room Type <Req /></Label>
                <select name="roomType" value={form.roomType} onChange={handleChange} style={inputStyle}>
                  {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label>Nearest University <Req /></Label>
                <select name="nearUniversity" value={form.nearUniversity} onChange={handleChange} style={inputStyle}>
                  {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Description <Req /></Label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the boarding: facilities, rules, surroundings…" rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} />
              </div>
            </div>
          </FormSection>

          {/* ── Section 2: Location & Price ── */}
          <FormSection icon={<MapPin size={18} color="#a855f7" />} title="Location & Price">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Full Address / Location <Req /></Label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. 45/B Malabe Road, Pittugala" style={inputStyle} />
              </div>
              <div>
                <Label>Monthly Rent (LKR) <Req /></Label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3px' }}>Rs.</span>
                  <input name="price" type="number" min="1" value={form.price} onChange={handleChange} placeholder="12000" style={{ ...inputStyle, paddingLeft: '44px' }} />
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── Section 3: Amenities ── */}
          <FormSection icon={<Building2 size={18} color="#a855f7" />} title="Amenities">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {ALL_AMENITIES.map(amenity => {
                const selected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    style={{
                      padding: '8px 18px', borderRadius: '100px',
                      background: selected ? 'linear-gradient(135deg, #6C63FF, #a855f7)' : 'rgba(255,255,255,0.05)',
                      border: selected ? 'none' : '1px solid rgba(255,255,255,0.12)',
                      color: selected ? '#fff' : 'rgba(255,255,255,0.65)',
                      fontSize: '0.85rem', fontWeight: selected ? 600 : 400,
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: selected ? '0 4px 14px rgba(108,99,255,0.4)' : 'none',
                    }}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* ── Section 4: Contact Info ── */}
          <FormSection icon={<Phone size={18} color="#a855f7" />} title="Contact Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Label>Contact Name <Req /></Label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Your full name" style={{ ...inputStyle, paddingLeft: '38px' }} />
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="07X XXX XXXX" style={{ ...inputStyle, paddingLeft: '38px' }} />
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label>Contact Email</Label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} placeholder="your@email.com" style={{ ...inputStyle, paddingLeft: '38px' }} />
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── Section 5: Photos ── */}
          <FormSection icon={<Image size={18} color="#a855f7" />} title={`Photos (${photos.length}/5)`}>
            {/* Upload area */}
            {photos.length < 5 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(108,99,255,0.35)', borderRadius: '16px',
                  padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.2s', marginBottom: photos.length ? '16px' : 0,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#6C63FF'; (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.06)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Upload size={28} color="#a855f7" style={{ marginBottom: '10px' }} />
                <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Click to upload photos</p>
                <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Up to 5 photos · JPG, PNG, WEBP · Max 5 MB each</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />

            {/* Photo previews */}
            {previews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', border: '1px solid rgba(108,99,255,0.2)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      style={{ position: 'absolute', top: '6px', right: '6px', width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(0,0,0,0.65)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={14} />
                    </button>
                    {i === 0 && (
                      <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(108,99,255,0.9)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>COVER</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          {/* Error message */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', color: '#FF6584', marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px',
              background: loading ? 'rgba(108,99,255,0.4)' : 'linear-gradient(135deg, #6C63FF, #a855f7)',
              color: '#fff', fontSize: '1rem', fontWeight: 700, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(108,99,255,0.5)',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Submitting…
              </>
            ) : 'Submit Boarding Listing'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #1a1a30; color: #fff; }
      `}</style>
    </div>
  );
};

/* ── Helpers ── */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(108,99,255,0.2)',
  borderRadius: '12px', color: '#fff',
  fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
  fontFamily: "'Inter', sans-serif",
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '7px' }}>{children}</div>
);

const Req = () => <span style={{ color: '#FF6584', marginLeft: '2px' }}>*</span>;

const FormSection = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div style={{ background: 'rgba(18,18,40,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: '20px', padding: '28px', marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <h3 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{title}</h3>
    </div>
    {children}
  </div>
);

export default BoardingFormPage;
