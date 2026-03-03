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
                background: 'linear-gradient(135deg, #0D0D1A 0%, #1a0533 50%, #0D0D1A 100%)',
                paddingTop: '72px',
            }}
        >
            {/* Background Blobs */}
            <div
                style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)',
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
                    background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
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
                    background: 'radial-gradient(circle, rgba(67,233,123,0.1) 0%, transparent 70%)',
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
                                background: 'rgba(108,99,255,0.15)',
                                border: '1px solid rgba(108,99,255,0.4)',
                                borderRadius: '100px',
                                padding: '6px 16px',
                                marginBottom: '24px',
                            }}
                        >
                            <Sparkles size={14} color="#a855f7" />
                            <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600 }}>
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
                                    background: 'linear-gradient(135deg, #6C63FF, #a855f7, #FF6584)',
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
                                color: 'rgba(255,255,255,0.65)',
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
                                background: 'rgba(20, 20, 45, 0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(108,99,255,0.25)',
                                borderRadius: '20px',
                                padding: '20px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                marginBottom: '36px',
                            }}
                        >
                            {/* Location Search */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(108,99,255,0.2)',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    marginBottom: '12px',
                                }}
                            >
                                <MapPin size={18} color="#6C63FF" style={{ flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="Search by location, university or area..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#fff',
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
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(108,99,255,0.2)',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                    }}
                                >
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#43E97B', flexShrink: 0, letterSpacing: '0.3px' }}>Rs.</span>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '0.875rem',
                                            flex: 1,
                                        }}
                                    >
                                        <option value="any" style={{ background: '#1a1a35' }}>Any Price</option>
                                        <option value="5000" style={{ background: '#1a1a35' }}>Under LKR 5,000</option>
                                        <option value="10000" style={{ background: '#1a1a35' }}>LKR 5,000 – 10,000</option>
                                        <option value="20000" style={{ background: '#1a1a35' }}>LKR 10,000 – 20,000</option>
                                        <option value="20000+" style={{ background: '#1a1a35' }}>LKR 20,000+</option>
                                    </select>
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(108,99,255,0.2)',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                    }}
                                >
                                    <Home size={16} color="#FF6584" />
                                    <select
                                        value={roomType}
                                        onChange={(e) => setRoomType(e.target.value)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '0.875rem',
                                            flex: 1,
                                        }}
                                    >
                                        <option value="any" style={{ background: '#1a1a35' }}>Any Type</option>
                                        <option value="single" style={{ background: '#1a1a35' }}>Single Room</option>
                                        <option value="shared" style={{ background: '#1a1a35' }}>Shared Room</option>
                                        <option value="studio" style={{ background: '#1a1a35' }}>Studio</option>
                                        <option value="apartment" style={{ background: '#1a1a35' }}>Apartment</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    boxShadow: '0 8px 25px rgba(108,99,255,0.5)',
                                    transition: 'all 0.3s ease',
                                    letterSpacing: '0.5px',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 35px rgba(108,99,255,0.7)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(108,99,255,0.5)';
                                }}
                            >
                                <Search size={18} />
                                Search Boarding Houses
                            </button>
                        </div>

                        {/* Popular Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginRight: '4px' }}>Popular:</span>
                            {['NSBM', 'UOC', 'USJP', 'SLIIT', 'MoratuwaUni'].map((tag) => (
                                <button
                                    key={tag}
                                    style={{
                                        padding: '5px 14px',
                                        borderRadius: '100px',
                                        background: 'rgba(108,99,255,0.12)',
                                        border: '1px solid rgba(108,99,255,0.25)',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.25)';
                                        (e.currentTarget as HTMLElement).style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.12)';
                                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
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
                                background: 'rgba(20,20,50,0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(108,99,255,0.3)',
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
                                        background: '#43E97B',
                                        borderRadius: '8px',
                                        padding: '4px 10px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: '#0D0D1A',
                                    }}
                                >
                                    AVAILABLE
                                </div>
                            </div>
                            <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1rem' }}>
                                Modern Studio Room
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '12px' }}>
                                📍 2 min walk from NSBM
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#6C63FF' }}>LKR 18K</span>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>/month</span>
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
                                    background: 'linear-gradient(135deg, #6C63FF, #a855f7)',
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
                                    background: 'rgba(20,20,50,0.9)',
                                    backdropFilter: 'blur(15px)',
                                    border: '1px solid rgba(108,99,255,0.25)',
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
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{card.price}</div>
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
                                        color: '#0D0D1A',
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
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px',
                                padding: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.1)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            }}
                        >
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(168,85,247,0.2))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#a855f7',
                                }}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{stat.label}</div>
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
