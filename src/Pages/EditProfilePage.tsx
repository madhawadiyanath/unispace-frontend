import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Home,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

interface UserData {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

interface FormState {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FieldError {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    const user: UserData = JSON.parse(stored);
    setCurrentUser(user);
    setForm(prev => ({ ...prev, name: user.name, email: user.email }));
  }, [navigate]);

  const validate = (): boolean => {
    const newErrors: FieldError = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (changePassword) {
      if (!form.currentPassword) newErrors.currentPassword = 'Please enter your current password.';
      if (!form.newPassword) {
        newErrors.newPassword = 'New password is required.';
      } else if (form.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters.';
      }
      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password.';
      } else if (form.newPassword !== form.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !currentUser) return;

    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      };

      if (changePassword) {
        payload.currentPassword = form.currentPassword;
        payload.password = form.newPassword;
      }

      const res = await fetch(`${API_BASE}/users/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Failed to update profile. Please try again.');
        return;
      }

      // Update localStorage with new user info
      const updatedUser: UserData = {
        ...currentUser,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setSuccessMsg('Profile updated successfully!');
      setChangePassword(false);
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));

      // Navigate back to profile after a short delay
      setTimeout(() => navigate('/profile'), 1500);
    } catch {
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) return null;

  const avatarLetter = currentUser.name?.[0]?.toUpperCase() || 'U';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D0D1A 0%, #1a0533 50%, #0D0D1A 100%)',
        fontFamily: "'Inter', sans-serif",
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
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(13,13,26,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(108,99,255,0.18)',
          padding: '0 32px', height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(108,99,255,0.5)' }}>
            <Home size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BoardingFinder
          </span>
        </Link>

        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 16px', borderRadius: '10px',
            background: 'rgba(108,99,255,0.1)',
            border: '1px solid rgba(108,99,255,0.25)',
            color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem',
            fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.2)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
        >
          <ArrowLeft size={15} />
          Back to Profile
        </button>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
        {/* Page title */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg, #fff 30%, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            Edit Profile
          </h1>
          <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
            Update your personal information
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile card */}
          <div style={{ background: 'rgba(18,18,40,0.80)', backdropFilter: 'blur(24px)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>

            {/* Banner + Avatar */}
            <div style={{ height: '100px', background: 'linear-gradient(135deg, #6C63FF 0%, #a855f7 60%, #ec4899 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>
            <div style={{ padding: '0 32px 36px', position: 'relative' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', border: '4px solid rgba(13,13,26,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', boxShadow: '0 0 30px rgba(108,99,255,0.5)', position: 'absolute', top: '-40px' }}>
                {avatarLetter}
              </div>
              <div style={{ paddingTop: '52px' }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                  Role: <span style={{ color: '#a78bfa', fontWeight: 600, textTransform: 'capitalize' }}>{currentUser.userType || 'student'}</span>
                </p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(108,99,255,0.15)', margin: '0 32px' }} />

            {/* Form fields */}
            <div style={{ padding: '32px' }}>

              {/* Success / Error banners */}
              {successMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: '0.9rem', marginBottom: '24px' }}>
                  <CheckCircle size={18} />
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.9rem', marginBottom: '24px' }}>
                  <AlertCircle size={18} />
                  {errorMsg}
                </div>
              )}

              {/* Full Name */}
              <FieldGroup label="Full Name" icon={<User size={16} color="#a855f7" />} error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Enter your full name"
                  style={inputStyle(!!errors.name)}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.7)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = errors.name ? 'rgba(239,68,68,0.4)' : 'rgba(108,99,255,0.2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                />
              </FieldGroup>

              {/* Email */}
              <FieldGroup label="Email Address" icon={<Mail size={16} color="#a855f7" />} error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="Enter your email"
                  style={inputStyle(!!errors.email)}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.7)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = errors.email ? 'rgba(239,68,68,0.4)' : 'rgba(108,99,255,0.2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                />
              </FieldGroup>

              {/* Change password toggle */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => { setChangePassword(p => !p); setErrors({}); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '12px',
                    background: changePassword ? 'rgba(108,99,255,0.2)' : 'rgba(108,99,255,0.08)',
                    border: `1px solid ${changePassword ? 'rgba(108,99,255,0.5)' : 'rgba(108,99,255,0.2)'}`,
                    color: changePassword ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <KeyRound size={15} />
                  {changePassword ? 'Cancel password change' : 'Change Password'}
                </button>
              </div>

              {/* Password section */}
              {changePassword && (
                <div
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'rgba(108,99,255,0.06)',
                    border: '1px solid rgba(108,99,255,0.15)',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Lock size={16} color="#a855f7" />
                    <span style={{ color: '#c4b5fd', fontWeight: 600, fontSize: '0.9rem' }}>Password Change</span>
                  </div>

                  {/* Current Password */}
                  <FieldGroup label="Current Password" icon={<Lock size={16} color="#a855f7" />} error={errors.currentPassword}>
                    <PasswordInput
                      value={form.currentPassword}
                      onChange={handleChange('currentPassword')}
                      placeholder="Enter current password"
                      show={showCurrentPw}
                      onToggle={() => setShowCurrentPw(p => !p)}
                      hasError={!!errors.currentPassword}
                    />
                  </FieldGroup>

                  {/* New Password */}
                  <FieldGroup label="New Password" icon={<Lock size={16} color="#a855f7" />} error={errors.newPassword}>
                    <PasswordInput
                      value={form.newPassword}
                      onChange={handleChange('newPassword')}
                      placeholder="Enter new password (min. 6 characters)"
                      show={showNewPw}
                      onToggle={() => setShowNewPw(p => !p)}
                      hasError={!!errors.newPassword}
                    />
                  </FieldGroup>

                  {/* Confirm New Password */}
                  <FieldGroup label="Confirm New Password" icon={<Lock size={16} color="#a855f7" />} error={errors.confirmPassword} noMargin>
                    <PasswordInput
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      placeholder="Re-enter new password"
                      show={showConfirmPw}
                      onToggle={() => setShowConfirmPw(p => !p)}
                      hasError={!!errors.confirmPassword}
                    />
                  </FieldGroup>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1, minWidth: '160px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '13px 28px', borderRadius: '14px',
                    background: submitting
                      ? 'rgba(108,99,255,0.4)'
                      : 'linear-gradient(135deg, #6C63FF, #a855f7)',
                    color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                    border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: submitting ? 'none' : '0 4px 20px rgba(108,99,255,0.45)',
                    transition: 'all 0.2s',
                    opacity: submitting ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(108,99,255,0.6)'; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = submitting ? 'none' : '0 4px 20px rgba(108,99,255,0.45)'; }}
                >
                  <Save size={17} />
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  disabled={submitting}
                  style={{
                    flex: 1, minWidth: '120px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '13px 24px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!submitting) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#fff'; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Helpers ── */

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? 'rgba(239,68,68,0.4)' : 'rgba(108,99,255,0.2)'}`,
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
});

interface FieldGroupProps {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  noMargin?: boolean;
}

const FieldGroup = ({ label, icon, error, children, noMargin }: FieldGroupProps) => (
  <div style={{ marginBottom: noMargin ? 0 : '20px' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.3px' }}>
      {icon}
      {label}
    </label>
    {children}
    {error && (
      <p style={{ margin: '6px 0 0', color: '#f87171', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <AlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
);

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  hasError: boolean;
}

const PasswordInput = ({ value, onChange, placeholder, show, onToggle, hasError }: PasswordInputProps) => (
  <div style={{ position: 'relative' }}>
    <input
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...inputStyle(hasError), paddingRight: '48px' }}
      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.7)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(108,99,255,0.12)'; }}
      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = hasError ? 'rgba(239,68,68,0.4)' : 'rgba(108,99,255,0.2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    />
    <button
      type="button"
      onClick={onToggle}
      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', display: 'flex', alignItems: 'center' }}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
);

export default EditProfilePage;
