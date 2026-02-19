import { useState, useEffect } from 'react';
import { Menu, X, Home, Search, Heart, MessageCircle, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', icon: <Home size={16} /> },
    {
      label: 'Browse',
      href: '#listings',
      icon: <Search size={16} />,
      dropdown: ['All Boardings', 'Near Campus', 'Budget Friendly', 'Premium'],
    },
    { label: 'Favourites', href: '#', icon: <Heart size={16} /> },
    { label: 'Messages', href: '#', icon: <MessageCircle size={16} /> },
  ];

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
          ? 'rgba(13, 13, 26, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(108, 99, 255, 0.2)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
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
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(108,99,255,0.5)',
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          >
            <Home size={20} color="#fff" />
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: '1.4rem',
                background: 'linear-gradient(135deg, #fff, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              BoardingFinder
            </span>
            <div style={{ fontSize: '0.65rem', color: 'rgba(108,99,255,0.8)', letterSpacing: '2px', fontWeight: 600, marginTop: '-4px' }}>
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
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.15)';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
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
                    background: 'rgba(20, 20, 40, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '180px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    animation: 'slideDown 0.2s ease',
                  }}
                >
                  {link.dropdown.map((item) => (
                    <a
                      key={item}
                      href="#"
                      style={{
                        display: 'block',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.2)';
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          <a
            href="#"
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.9rem',
              fontWeight: 500,
              border: '1px solid rgba(108,99,255,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#6C63FF';
              (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <User size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Sign In
          </a>
          <a
            href="#"
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(108,99,255,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(108,99,255,0.6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(108,99,255,0.4)';
            }}
          >
            Post a Room
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'rgba(108,99,255,0.15)',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: '10px',
            padding: '8px',
            color: '#fff',
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
            background: 'rgba(13, 13, 26, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(108,99,255,0.2)',
            padding: '16px 24px 24px',
          }}
          className="mobile-menu"
        >
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
                color: 'rgba(255,255,255,0.85)',
                fontSize: '1rem',
                fontWeight: 500,
                marginBottom: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.15)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {link.icon} {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <a
              href="#"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(108,99,255,0.4)',
                color: '#fff',
                fontWeight: 500,
              }}
            >
              Sign In
            </a>
            <a
              href="#"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Post a Room
            </a>
          </div>
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
