import { useState } from 'react';
import { Search, MapPin, Star, Users, Home, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState('any');
    const [roomType, setRoomType] = useState('any');

    const stats = [
        { icon: <Home size={20} />, value: '2,400+', label: 'Listings' },
        { icon: <Users size={20} />, value: '8,500+', label: 'Students' },
        { icon: <Star size={20} />, value: '4.8', label: 'Avg Rating' },
        { icon: <MapPin size={20} />, value: '15+', label: 'Campus Areas' },
    ];

    const floatingCards = [
        {
            icon: '🏠',
            title: 'Studio Apartment',
            price: 'LKR 18,000/mo',
            badge: 'New',
            badgeColor: '#43E97B',
            top: '20%',
            left: '-5%',
            delay: '0s',
        },
        {
            icon: '🛏️',
            title: 'Single Room',
            price: 'LKR 9,500/mo',
            badge: 'Popular',
            badgeColor: '#6C63FF',
            top: '55%',
            right: '-5%',
            delay: '2s',
        },
        {
            icon: '⭐',
            title: 'Top Rated',
            price: '4.9 / 5.0',
            badge: 'Verified',
            badgeColor: '#FF6584',
            top: '75%',
            left: '5%',
            delay: '1s',
        },
    ];

    return (
        <section
            id="home"
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: 'var(--gradient-hero)',
                paddingTop: '72px',
            }}
        >
            {/* Background Blobs */}
            <div
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.16) 0%, transparent 70%)',
                    top: '-100px',
                    right: '-100px',
                    filter: 'blur(40px)',
                    animation: 'blob 8s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
                    bottom: '-50px',
                    left: '-100px',
                    filter: 'blur(40px)',
                    animation: 'blob 10s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(67,233,123,0.12) 0%, transparent 70%)',
                    top: '60%',
                    left: '40%',
                    filter: 'blur(30px)',
                    pointerEvents: 'none',
                }}
            />

            {/* Grid Pattern */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
            linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '60px 24px',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '60px',
                        alignItems: 'center',
                    }}
                    className="hero-grid"
                >
                    {/* Left: Content */}
                    <div style={{ animation: 'fadeInLeft 0.8s ease forwards' }}>
                        {/* Badge */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'var(--nav-link-hover-bg)',
                                border: '1px solid var(--nav-border)',
                                borderRadius: '100px',
                                padding: '6px 16px',
                                marginBottom: '24px',
                            }}
                        >
                            <Sparkles size={14} color="var(--primary)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                                #1 Campus Boarding Platform in Sri Lanka
                            </span>
                        </div>

                        {/* Heading */}
                        <h1
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                fontWeight: 900,
                                lineHeight: 1.1,
                                marginBottom: '20px',
                                letterSpacing: '-1px',
                            }}
                        >
                            Find Your{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block',
                                }}
                            >
                                Perfect Boarding
                            </span>
                            <br />
                            Near Campus
                        </h1>

                        <p
                            style={{
                                fontSize: '1.1rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.8,
                                marginBottom: '36px',
                                maxWidth: '480px',
                            }}
                        >
                            Discover safe, affordable, and comfortable boarding houses tailored
                            for students. Compare listings, read reviews, and move in with confidence.
                        </p>

                        {/* Search Box */}
                        <div
                            style={{
                                background: 'var(--search-panel-bg)',
                                backdropFilter: 'blur(22px)',
                                border: '1px solid var(--search-panel-border)',
                                borderRadius: '20px',
                                padding: '20px',
                                boxShadow: 'var(--search-panel-shadow)',
                                marginBottom: '36px',
                            }}
                        >
                            {/* Location Search */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'var(--search-field-bg)',
                                    border: '1px solid var(--search-field-border)',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    marginBottom: '12px',
                                }}
                            >
                                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="Search by location, university or area..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--input-text)',
                                        fontSize: '0.95rem',
                                        flex: 1,
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            {/* Filters Row */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }} className="filter-row">
                                <div
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'var(--search-filter-bg)',
                                        border: '1px solid var(--search-filter-border)',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                    }}
                                >
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0, letterSpacing: '0.3px' }}>Rs.</span>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            flex: 1,
                                        }}
                                    >
                                        <option value="any" style={{ background: 'var(--select-option-bg)' }}>Any Price</option>
                                        <option value="5000" style={{ background: 'var(--select-option-bg)' }}>Under LKR 5,000</option>
                                        <option value="10000" style={{ background: 'var(--select-option-bg)' }}>LKR 5,000 – 10,000</option>
                                        <option value="20000" style={{ background: 'var(--select-option-bg)' }}>LKR 10,000 – 20,000</option>
                                        <option value="20000+" style={{ background: 'var(--select-option-bg)' }}>LKR 20,000+</option>
                                    </select>
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'var(--search-filter-bg)',
                                        border: '1px solid var(--search-filter-border)',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                    }}
                                >
                                    <Home size={16} color="var(--primary)" />
                                    <select
                                        value={roomType}
                                        onChange={(e) => setRoomType(e.target.value)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            flex: 1,
                                        }}
                                    >
                                        <option value="any" style={{ background: 'var(--select-option-bg)' }}>Any Type</option>
                                        <option value="single" style={{ background: 'var(--select-option-bg)' }}>Single Room</option>
                                        <option value="shared" style={{ background: 'var(--select-option-bg)' }}>Shared Room</option>
                                        <option value="studio" style={{ background: 'var(--select-option-bg)' }}>Studio</option>
                                        <option value="apartment" style={{ background: 'var(--select-option-bg)' }}>Apartment</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: 'var(--btn-primary-bg)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    boxShadow: 'var(--btn-primary-shadow)',
                                    transition: 'all 0.3s ease',
                                    letterSpacing: '0.5px',
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
                                <Search size={18} />
                                Search Boarding Houses
                            </button>
                        </div>

                        {/* Popular Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '4px' }}>Popular:</span>
                            {['NSBM', 'UOC', 'USJP', 'SLIIT', 'MoratuwaUni'].map((tag) => (
                                <button
                                    key={tag}
                                    style={{
                                        padding: '5px 14px',
                                        borderRadius: '100px',
                                        background: 'var(--surface-2)',
                                        border: '1px solid var(--btn-ghost-border)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                                        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '500px',
                            animation: 'fadeInRight 0.8s ease forwards 0.2s',
                            opacity: 0,
                        }}
                    >
                        {/* Central Card */}
                        <div
                            style={{
                                width: '280px',
                                background: 'var(--card-bg)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '24px',
                                padding: '24px',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(108,99,255,0.15)',
                                animation: 'float 6s ease-in-out infinite',
                                zIndex: 2,
                            }}
                        >
                            {/* Image placeholder with gradient */}
                            <div
                                style={{
                                    width: '100%',
                                    height: '160px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, rgba(108,99,255,0.4), rgba(168,85,247,0.4))',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                🏘️
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '10px',
                                        background: 'var(--badge-success-bg)',
                                        borderRadius: '8px',
                                        padding: '4px 10px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: 'var(--badge-success-text)',
                                    }}
                                >
                                    AVAILABLE
                                </div>
                            </div>
                            <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1rem' }}>
                                Modern Studio Room
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '12px' }}>
                                📍 2 min walk from NSBM
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>LKR 18K</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/month</span>
                                </div>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <Star size={14} color="#FFD700" fill="#FFD700" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>4.9</span>
                                </div>
                            </div>
                            <button
                                style={{
                                    width: '100%',
                                    marginTop: '14px',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    background: 'var(--btn-primary-bg)',
                                    color: '#fff',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                }}
                            >
                                View Details <ArrowRight size={14} />
                            </button>
                        </div>

                        {/* Floating Mini Cards */}
                        {floatingCards.map((card) => (
                            <div
                                key={card.title}
                                style={{
                                    position: 'absolute',
                                    ...(card.top ? { top: card.top } : {}),
                                    ...(card.left !== undefined ? { left: card.left } : {}),
                                    ...(card.right !== undefined ? { right: card.right } : {}),
                                    background: 'var(--card-bg)',
                                    backdropFilter: 'blur(15px)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    padding: '14px 18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                    animation: `float 6s ease-in-out infinite ${card.delay}`,
                                    zIndex: 3,
                                    minWidth: '170px',
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '2px' }}>{card.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{card.price}</div>
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: card.badgeColor,
                                        borderRadius: '8px',
                                        padding: '2px 8px',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        color: 'var(--badge-success-text)',
                                    }}
                                >
                                    {card.badge}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '20px',
                        marginTop: '64px',
                        animation: 'fadeInUp 0.8s ease forwards 0.4s',
                        opacity: 0,
                    }}
                    className="stats-grid"
                >
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                background: 'var(--surface-1)',
                                border: '1px solid var(--border-1)',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--nav-border)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = 'var(--surface-1)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-1)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            }}
                        >
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'var(--btn-primary-bg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                }}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .filter-row { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
        </section>
    );
};

export default Hero;
