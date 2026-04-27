import { useState, useEffect } from 'react';
import { Menu, X, Home, Search, Heart, Bell, LogIn, UserPlus, ChevronDown, LogOut, User, Sparkles, Wrench, Droplets, Zap, Hammer, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)')?.matches;
    return prefersLight ? 'light' : 'dark';
  });

  // Read logged-in user from localStorage
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const userType = String(currentUser?.userType || '').toLowerCase();
  const canSeeMaintenance = Boolean(
    currentUser && (userType === 'landlord' || userType === 'admin' || userType.includes('staff')),
  );

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsOpen(false);
    navigate('/');
    // Force re-render by reloading
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const navLinksBase = [
    { label: 'Home', href: '/', icon: <Home size={16} /> },
    {
      label: 'Browse',
      href: '/boardings',
      icon: <Search size={16} />,
      dropdown: ['All Boardings', 'Near Campus', 'Budget Friendly', 'Premium'],
      dropdownLinks: ['/boardings', '/boardings', '/boardings', '/boardings'],
    },
    { label: 'Favourites', href: '/favourites', icon: <Heart size={16} /> },
    { label: 'Notification', href: '/notifications', icon: <Bell size={16} /> },
    {
      label: 'Maintenance',
      href: '/maintenance',
      icon: <Wrench size={16} />,
      dropdown: ['Cleaning Service', 'Plumbing', 'Electrical', 'General Repairs'],
      dropdownLinks: ['/maintenance?tab=cleaning', '/maintenance?tab=plumbing', '/maintenance?tab=electrical', '/maintenance?tab=repairs'],
      dropdownIcons: [<Sparkles size={14} />, <Droplets size={14} />, <Zap size={14} />, <Hammer size={14} />],
    },
  ];

  const navLinks = navLinksBase.filter((link) =>
    link.label === 'Maintenance' ? canSeeMaintenance : true,
  );

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: scrolled
          ? 'var(--nav-bg-scrolled)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none',
        boxShadow: scrolled ? 'var(--nav-shadow)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Logo */}
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="http://localhost:5000/uploads/1.png"
              alt="UniSpace logo"
              style={{ width: '90%', height: '90%', objectFit: 'contain', imageRendering: 'auto' }}
            />
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.4rem',
                background: 'linear-gradient(135deg, var(--text-primary), var(--primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              UniSpace
             
            </span>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: 600, marginTop: '-4px' }}>
              CAMPUS EDITION
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <div
              key={link.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                    color: 'var(--nav-link)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--nav-link-hover)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--nav-link)';
                }}
              >
                {link.icon}
                {link.label}
                {link.dropdown && <ChevronDown size={14} />}
              </a>

              {/* Dropdown */}
              {link.dropdown && activeDropdown === link.label && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    background: 'var(--nav-dropdown-bg)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--nav-dropdown-border)',
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '180px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    animation: 'slideDown 0.2s ease',
                  }}
                >
                  {link.dropdown.map((item, idx) => (
                    <a
                      key={item}
                      href={(link as any).dropdownLinks ? (link as any).dropdownLinks[idx] : '#'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        color: 'var(--nav-dropdown-item)',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--nav-dropdown-item-hover-bg)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--nav-dropdown-item-hover)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'var(--nav-dropdown-item)';
                      }}
                    >
                      {(link as any).dropdownIcons?.[idx] && (
                        <span style={{ opacity: 0.7 }}>{(link as any).dropdownIcons[idx]}</span>
                      )}
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Auth Section — conditional on login state */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-nav">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-1)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {currentUser ? (
            // ── Logged-in state ──
            <>
              {/* User pill — click to open profile */}
              <button
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px 6px 8px',
                  borderRadius: '100px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--nav-border)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-1)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'var(--btn-primary-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={14} color="#fff" />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name || 'User'}
                </span>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 16px', borderRadius: '10px',
                  background: 'rgba(255, 101, 132, 0.10)',
                  border: '1px solid rgba(255, 101, 132, 0.30)',
                  color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 101, 132, 0.16)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 101, 132, 0.10)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 101, 132, 0.30)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            // ── Guest state ──
            <>
              <a
                href="/login"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 18px', borderRadius: '10px',
                  color: 'var(--nav-link)', fontSize: '0.9rem', fontWeight: 500,
                  border: '1px solid var(--btn-ghost-border)', transition: 'all 0.25s', background: 'var(--btn-ghost-bg)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--nav-border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-link-hover)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--btn-ghost-border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--btn-ghost-bg)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--nav-link)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <LogIn size={15} />
                Login
              </a>
              <a
                href="/register"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 20px', borderRadius: '10px',
                  background: 'var(--btn-primary-bg)',
                  color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                  boxShadow: 'var(--btn-primary-shadow-sm)', transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--btn-primary-shadow-sm-hover)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--btn-primary-shadow-sm)';
                }}
              >
                <UserPlus size={15} />
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-1)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{
            background: 'var(--nav-bg-scrolled)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--nav-border)',
            padding: '16px 24px 24px',
          }}
          className="mobile-menu"
        >
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border-1)',
              color: 'var(--text-primary)',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{theme === 'dark' ? 'Off' : 'On'}</span>
          </button>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                borderRadius: '10px',
                color: 'var(--nav-link)',
                fontSize: '1rem',
                fontWeight: 500,
                marginBottom: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {link.icon} {link.label}
            </a>
          ))}
          {/* Mobile auth — conditional */}
          {currentUser ? (
            <div style={{ marginTop: '16px', padding: '14px 16px', borderRadius: '12px', background: 'var(--surface-2)', border: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => { setIsOpen(false); navigate('/profile'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--btn-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{currentUser.name || 'User'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View Profile</div>
                </div>
              </button>
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'var(--danger-soft-bg)', border: '1px solid var(--danger-soft-border)', color: 'var(--danger-soft-text)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a
                href="/login"
                style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: '10px', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: 'var(--btn-ghost-bg)' }}
              >
                <LogIn size={15} />
                Login
              </a>
              <a
                href="/register"
                style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: '10px', background: 'var(--btn-primary-bg)', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: 'var(--btn-primary-shadow-sm)' }}
              >
                <UserPlus size={15} />
                Sign Up
              </a>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          .mobile-menu { display: block; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
