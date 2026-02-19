import { Shield, Wifi, Coffee, Utensils, BusFront, Star, Zap, Users, Lock, ChevronRight } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Shield size={28} />,
            title: 'Verified Listings',
            description: 'Every boarding house is manually verified by our team to ensure safety and accuracy.',
            color: '#6C63FF',
            gradient: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(108,99,255,0.05))',
        },
        {
            icon: <Star size={28} />,
            title: 'Student Reviews',
            description: 'Read honest reviews from fellow students who have stayed at the boarding house.',
            color: '#FFD700',
            gradient: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))',
        },
        {
            icon: <Wifi size={28} />,
            title: 'Filter Amenities',
            description: 'Filter by WiFi, AC, meals, laundry, parking and 20+ other amenities.',
            color: '#43E97B',
            gradient: 'linear-gradient(135deg, rgba(67,233,123,0.2), rgba(67,233,123,0.05))',
        },
        {
            icon: <BusFront size={28} />,
            title: 'Distance Mapping',
            description: 'See exact walking/bus distances from your university to any listing.',
            color: '#38F9D7',
            gradient: 'linear-gradient(135deg, rgba(56,249,215,0.2), rgba(56,249,215,0.05))',
        },
        {
            icon: <Zap size={28} />,
            title: 'Instant Booking',
            description: 'Contact landlords instantly and book rooms directly through the platform.',
            color: '#FF6584',
            gradient: 'linear-gradient(135deg, rgba(255,101,132,0.2), rgba(255,101,132,0.05))',
        },
        {
            icon: <Lock size={28} />,
            title: 'Secure Payments',
            description: 'Our secure escrow system protects your advance payment until you move in.',
            color: '#a855f7',
            gradient: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))',
        },
    ];

    const extras = [
        { icon: <Coffee size={18} />, label: 'Meals Included' },
        { icon: <Utensils size={18} />, label: 'Kitchen Access' },
        { icon: <Users size={18} />, label: 'Study Rooms' },
        { icon: <Wifi size={18} />, label: 'High-Speed WiFi' },
    ];

    return (
        <section
            id="features"
            style={{
                padding: '100px 24px',
                background: 'linear-gradient(180deg, #0D0D1A 0%, #13132A 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Decoration */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(67,233,123,0.1)',
                            border: '1px solid rgba(67,233,123,0.3)',
                            borderRadius: '100px',
                            padding: '6px 16px',
                            marginBottom: '20px',
                        }}
                    >
                        <Zap size={14} color="#43E97B" />
                        <span style={{ fontSize: '0.8rem', color: '#43E97B', fontWeight: 600 }}>
                            Why Choose BoardingFinder
                        </span>
                    </div>
                    <h2
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '16px',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Everything You Need to{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #43E97B, #38F9D7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Find Your Home
                        </span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' }}>
                        We've built every tool a campus student needs to find, compare, and secure the perfect boarding house.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                        marginBottom: '60px',
                    }}
                    className="features-grid"
                >
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            style={{
                                background: feature.gradient,
                                border: `1px solid ${feature.color}30`,
                                borderRadius: '20px',
                                padding: '28px',
                                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(-6px)';
                                el.style.boxShadow = `0 20px 50px ${feature.color}25`;
                                el.style.borderColor = `${feature.color}60`;
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(0)';
                                el.style.boxShadow = 'none';
                                el.style.borderColor = `${feature.color}30`;
                            }}
                        >
                            {/* Hover glow */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    width: '100px',
                                    height: '100px',
                                    background: `radial-gradient(circle, ${feature.color}20, transparent)`,
                                    borderRadius: '50%',
                                    pointerEvents: 'none',
                                }}
                            />

                            <div
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: `${feature.color}20`,
                                    border: `1px solid ${feature.color}40`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: feature.color,
                                    marginBottom: '18px',
                                }}
                            >
                                {feature.icon}
                            </div>

                            <h3
                                style={{
                                    fontWeight: 700,
                                    fontSize: '1.05rem',
                                    marginBottom: '10px',
                                    fontFamily: "'Outfit', sans-serif",
                                }}
                            >
                                {feature.title}
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                                {feature.description}
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginTop: '16px',
                                    color: feature.color,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                Learn more <ChevronRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Amenity Tags */}
                <div
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '20px',
                        padding: '28px 36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div>
                        <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Filter by Amenities</h4>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>
                            Find exactly what you need
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {extras.map((e, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 18px',
                                    borderRadius: '100px',
                                    background: 'rgba(108,99,255,0.12)',
                                    border: '1px solid rgba(108,99,255,0.25)',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(el) => {
                                    (el.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.25)';
                                    (el.currentTarget as HTMLElement).style.color = '#fff';
                                }}
                                onMouseLeave={(el) => {
                                    (el.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.12)';
                                    (el.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                                }}
                            >
                                <span style={{ color: '#6C63FF' }}>{e.icon}</span>
                                {e.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
};

export default Features;
