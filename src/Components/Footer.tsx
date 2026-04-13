import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
    const links = {
        'For Students': ['Find Boarding', 'Browse Map', 'Save Favourites', 'Student Guide', 'Compare Rooms'],
        'For Landlords': ['Post a Room', 'Manage Listings', 'Pricing Plans', 'Verification', 'Dashboard'],
        'Company': ['About Us', 'How It Works', 'Blog', 'Careers', 'Press Kit'],
        'Support': ['Help Center', 'Safety Tips', 'Report Listing', 'Contact Us', 'Terms & Privacy'],
    };

    const socials = [
        { icon: <Facebook size={18} />, color: '#1877F2', label: 'Facebook' },
        { icon: <Instagram size={18} />, color: '#E4405F', label: 'Instagram' },
        { icon: <Twitter size={18} />, color: '#1DA1F2', label: 'Twitter' },
        { icon: <Youtube size={18} />, color: '#FF0000', label: 'YouTube' },
    ];

    return (
        <footer
            style={{
                background: 'var(--footer-bg)',
                borderTop: '1px solid var(--footer-border)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* CTA Section */}
            <div
                style={{
                    background: 'var(--footer-cta-bg)',
                    borderBottom: '1px solid var(--footer-cta-border)',
                    padding: '56px 24px',
                }}
            >
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '32px',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                                fontWeight: 800,
                                marginBottom: '10px',
                            }}
                        >
                            Ready to Find Your{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Perfect Boarding?
                            </span>
                        </h2>
                        <p style={{ color: 'var(--footer-muted)', fontSize: '1rem' }}>
                            Join 8,500+ students who found their ideal home through BoardingFinder.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        <a
                            href="#"
                            style={{
                                padding: '14px 28px',
                                borderRadius: '12px',
                                background: 'var(--btn-primary-bg)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: 'var(--btn-primary-shadow)',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--btn-primary-shadow-hover)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--btn-primary-shadow)';
                            }}
                        >
                            Start Searching <ArrowRight size={16} />
                        </a>
                        <a
                            href="#"
                            style={{
                                padding: '14px 28px',
                                borderRadius: '12px',
                                border: '1px solid var(--btn-ghost-border)',
                                color: 'var(--footer-link)',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--nav-border)';
                                (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--btn-ghost-border)';
                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                            }}
                        >
                            Post Your Room
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 40px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr repeat(4, 1fr)',
                        gap: '40px',
                        marginBottom: '48px',
                    }}
                    className="footer-grid"
                >
                    {/* Brand Column */}
                    <div>
                        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '14px',
                                    background: 'var(--btn-primary-bg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-glow)',
                                }}
                            >
                                <Home size={22} color="#fff" />
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontWeight: 800,
                                        fontSize: '1.2rem',
                                        background: 'linear-gradient(135deg, var(--footer-text), var(--primary))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    BoardingFinder
                                </div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '2px', fontWeight: 600 }}>
                                    CAMPUS EDITION
                                </div>
                            </div>
                        </a>
                        <p style={{ color: 'var(--footer-muted)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '24px' }}>
                            Sri Lanka's most trusted boarding house platform for university students. Safe, verified, and affordable.
                        </p>

                        {/* Contact Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            {[
                                { icon: <Phone size={14} />, text: '+94 11 234 5678' },
                                { icon: <Mail size={14} />, text: 'hello@boardingfinder.lk' },
                                { icon: <MapPin size={14} />, text: 'Colombo, Sri Lanka' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'var(--footer-muted)',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* Socials */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    title={social.label}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '10px',
                                        background: 'var(--surface-2)',
                                        border: '1px solid var(--border-1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--footer-muted)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = `${social.color}20`;
                                        (e.currentTarget as HTMLElement).style.borderColor = social.color;
                                        (e.currentTarget as HTMLElement).style.color = social.color;
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-1)';
                                        (e.currentTarget as HTMLElement).style.color = 'var(--footer-muted)';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category}>
                            <h4
                                style={{
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    marginBottom: '18px',
                                    color: 'var(--footer-text)',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {category}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {items.map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            style={{
                                                color: 'var(--footer-link)',
                                                fontSize: '0.85rem',
                                                transition: 'all 0.2s',
                                                display: 'inline-block',
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                                                (e.currentTarget as HTMLElement).style.paddingLeft = '6px';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.color = 'var(--footer-link)';
                                                (e.currentTarget as HTMLElement).style.paddingLeft = '0';
                                            }}
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        borderTop: '1px solid var(--border-1)',
                        paddingTop: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        © 2025 BoardingFinder. All rights reserved.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Made with <Heart size={13} color="var(--primary)" fill="var(--primary)" style={{ display: 'inline' }} /> for SLIIT students
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map((link) => (
                            <a
                                key={link}
                                href="#"
                                style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
