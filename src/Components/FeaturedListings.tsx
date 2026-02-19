import { useState, useEffect } from 'react';
import { Star, MapPin, Wifi, Coffee, ArrowRight, Heart, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

interface Listing {
    id: number | string;
    title: string;
    location: string;
    university: string;
    price: number;
    rating: number;
    reviews: number;
    type: string;
    amenities: string[];
    badge?: string;
    badgeColor?: string;
    emoji: string;
    bgGradient: string;
    available: boolean;
    photoUrl?: string;
    isLive?: boolean;
}

const FeaturedListings = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [likedCards, setLikedCards] = useState<(number | string)[]>([]);
    const [apiListings, setApiListings] = useState<Listing[]>([]);

    // Fetch published boardings from API
    useEffect(() => {
        fetch(`${API_BASE}/boardings/published`)
            .then(r => r.json())
            .then(data => {
                const gradients = [
                    'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(168,85,247,0.1))',
                    'linear-gradient(135deg, rgba(67,233,123,0.25), rgba(56,249,215,0.1))',
                    'linear-gradient(135deg, rgba(255,101,132,0.25), rgba(255,143,163,0.1))',
                    'linear-gradient(135deg, rgba(56,249,215,0.2), rgba(67,233,123,0.05))',
                ];
                const emojis = ['🏡', '🏢', '🏠', '🏘️', '✨', '🌸'];
                const mapped: Listing[] = (data.boardings || []).map((b: {
                    _id: string; title: string; location: string; nearUniversity: string;
                    price: number; roomType: string; amenities: string[]; photos: string[];
                }, i: number) => ({
                    id: b._id,
                    title: b.title,
                    location: b.location,
                    university: b.nearUniversity || 'Nearby',
                    price: b.price,
                    rating: 0,
                    reviews: 0,
                    type: b.roomType,
                    amenities: b.amenities || [],
                    badge: 'New',
                    badgeColor: '#6C63FF',
                    emoji: emojis[i % emojis.length],
                    bgGradient: gradients[i % gradients.length],
                    available: true,
                    photoUrl: b.photos?.[0] ? `${API_BASE}${b.photos[0]}` : undefined,
                    isLive: true,
                }));
                setApiListings(mapped);
            })
            .catch(() => {});
    }, []);

    const filters = ['All', 'Near NSBM', 'Near UOC', 'Near SLIIT', 'Budget', 'Premium'];

    const listings: Listing[] = [
        {
            id: 1,
            title: 'Cozy Single Room',
            location: 'Pittugala, Malabe',
            university: 'SLIIT',
            price: 9500,
            rating: 4.8,
            reviews: 32,
            type: 'Single Room',
            amenities: ['WiFi', 'AC', 'Meals'],
            badge: 'Best Value',
            badgeColor: '#43E97B',
            emoji: '🏡',
            bgGradient: 'linear-gradient(135deg, rgba(67,233,123,0.25), rgba(56,249,215,0.1))',
            available: true,
        },
        {
            id: 2,
            title: 'Modern Studio Apt',
            location: 'Homagama, Colombo',
            university: 'NSBM',
            price: 18000,
            rating: 4.9,
            reviews: 58,
            type: 'Studio',
            amenities: ['WiFi', 'AC', 'Study Room', 'Kitchen'],
            badge: 'Top Rated',
            badgeColor: '#6C63FF',
            emoji: '🏢',
            bgGradient: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(168,85,247,0.1))',
            available: true,
        },
        {
            id: 3,
            title: 'Shared Double Room',
            location: 'Thurstan Road, Colombo 03',
            university: 'UOC',
            price: 6500,
            rating: 4.6,
            reviews: 47,
            type: 'Shared Room',
            amenities: ['WiFi', 'Common Kitchen'],
            badge: 'Budget Pick',
            badgeColor: '#FF6584',
            emoji: '🏠',
            bgGradient: 'linear-gradient(135deg, rgba(255,101,132,0.25), rgba(255,143,163,0.1))',
            available: true,
        },
        {
            id: 4,
            title: 'Luxury Annex Room',
            location: 'Nugegoda, Colombo',
            university: 'UOC',
            price: 25000,
            rating: 5.0,
            reviews: 19,
            type: 'Annex',
            amenities: ['WiFi', 'AC', 'Parking', 'Garden'],
            badge: 'Premium',
            badgeColor: '#FFD700',
            emoji: '✨',
            bgGradient: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,200,0,0.05))',
            available: false,
        },
        {
            id: 5,
            title: 'Girls Hostel Room',
            location: 'Kirulapana, Colombo',
            university: 'SLIIT',
            price: 12000,
            rating: 4.7,
            reviews: 64,
            type: 'Hostel',
            amenities: ['WiFi', 'Security', 'Meals'],
            badge: 'Girls Only',
            badgeColor: '#FF6584',
            emoji: '🌸',
            bgGradient: 'linear-gradient(135deg, rgba(255,101,132,0.2), rgba(168,85,247,0.1))',
            available: true,
        },
        {
            id: 6,
            title: 'Family Boarding House',
            location: 'Wellampitiya, Colombo',
            university: 'Multiple',
            price: 8000,
            rating: 4.5,
            reviews: 38,
            type: 'Single Room',
            amenities: ['WiFi', 'Meals', 'Laundry'],
            emoji: '🏘️',
            bgGradient: 'linear-gradient(135deg, rgba(56,249,215,0.2), rgba(67,233,123,0.05))',
            available: true,
        },
    ];

    const toggleLike = (id: number | string) => {
        setLikedCards((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Combine: API live listings first, then hardcoded as samples
    const allListings = [...apiListings, ...listings];

    const amenityIcons: Record<string, JSX.Element> = {
        WiFi: <Wifi size={12} />,
        AC: <span>❄️</span>,
        Meals: <Coffee size={12} />,
        Security: <Shield size={12} />,
        Kitchen: <span>🍳</span>,
        Parking: <span>🚗</span>,
        Garden: <span>🌿</span>,
        Laundry: <span>👕</span>,
        'Study Room': <span>📚</span>,
        'Common Kitchen': <span>🍳</span>,
    };

    return (
        <section
            id="listings"
            style={{
                padding: '100px 24px',
                background: '#13132A',
                position: 'relative',
            }}
        >
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '40px',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255,101,132,0.1)',
                                border: '1px solid rgba(255,101,132,0.3)',
                                borderRadius: '100px',
                                padding: '6px 16px',
                                marginBottom: '16px',
                            }}
                        >
                            <Heart size={14} color="#FF6584" />
                            <span style={{ fontSize: '0.8rem', color: '#FF6584', fontWeight: 600 }}>
                                Featured Listings
                            </span>
                        </div>
                        <h2
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.5px',
                            }}
                        >
                            Handpicked{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #FF6584, #a855f7)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Boarding Houses
                            </span>
                        </h2>
                    </div>
                    <a
                        href="#"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#6C63FF',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'gap 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.gap = '10px';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.gap = '6px';
                        }}
                    >
                        View All Listings <ArrowRight size={16} />
                    </a>
                </div>

                {/* Filter Tabs */}
                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        marginBottom: '36px',
                        paddingBottom: '4px',
                        scrollbarWidth: 'none',
                    }}
                >
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '100px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background:
                                    activeFilter === filter
                                        ? 'linear-gradient(135deg, #6C63FF, #a855f7)'
                                        : 'rgba(255,255,255,0.05)',
                                border:
                                    activeFilter === filter
                                        ? 'none'
                                        : '1px solid rgba(255,255,255,0.1)',
                                color: activeFilter === filter ? '#fff' : 'rgba(255,255,255,0.6)',
                                boxShadow:
                                    activeFilter === filter
                                        ? '0 4px 15px rgba(108,99,255,0.4)'
                                        : 'none',
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Listings Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                    }}
                    className="listings-grid"
                >
                    {allListings.map((listing) => (
                        <div
                            key={listing.id}
                            style={{
                                background: 'rgba(20, 20, 45, 0.7)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(-6px)';
                                el.style.boxShadow = '0 24px 60px rgba(0,0,0,0.4)';
                                el.style.borderColor = 'rgba(108,99,255,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.transform = 'translateY(0)';
                                el.style.boxShadow = 'none';
                                el.style.borderColor = 'rgba(255,255,255,0.08)';
                            }}
                        >
                            {/* Image Area */}
                            <div
                                style={{
                                    height: '180px',
                                    background: listing.bgGradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '4rem',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {listing.photoUrl
                                    ? <img src={listing.photoUrl} alt={listing.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : listing.emoji
                                }

                                {/* Badge */}
                                {listing.badge && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '14px',
                                            left: '14px',
                                            background: listing.badgeColor,
                                            borderRadius: '8px',
                                            padding: '4px 12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: '#0D0D1A',
                                        }}
                                    >
                                        {listing.badge}
                                    </div>
                                )}

                                {/* Availability */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '14px',
                                        right: '50px',
                                        background: listing.available ? 'rgba(67,233,123,0.9)' : 'rgba(255,101,132,0.9)',
                                        borderRadius: '8px',
                                        padding: '4px 10px',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        color: '#0D0D1A',
                                    }}
                                >
                                    {listing.available ? '● AVAILABLE' : '● OCCUPIED'}
                                </div>

                                {/* Like Button */}
                                <button
                                    onClick={() => toggleLike(listing.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '10px',
                                        background: likedCards.includes(listing.id)
                                            ? 'rgba(255,101,132,0.9)'
                                            : 'rgba(0,0,0,0.4)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Heart
                                        size={15}
                                        color={likedCards.includes(listing.id) ? '#fff' : 'rgba(255,255,255,0.7)'}
                                        fill={likedCards.includes(listing.id) ? '#fff' : 'transparent'}
                                    />
                                </button>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '20px' }}>
                                {/* Type Tag */}
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '3px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(108,99,255,0.15)',
                                        color: '#a855f7',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        marginBottom: '10px',
                                    }}
                                >
                                    {listing.type}
                                </div>

                                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                                    {listing.title}
                                </h3>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: '0.8rem',
                                        marginBottom: '12px',
                                    }}
                                >
                                    <MapPin size={13} color="#6C63FF" />
                                    {listing.location} · Near {listing.university}
                                </div>

                                {/* Amenities */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '6px',
                                        flexWrap: 'wrap',
                                        marginBottom: '16px',
                                    }}
                                >
                                    {listing.amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.06)',
                                                color: 'rgba(255,255,255,0.65)',
                                                fontSize: '0.72rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {amenityIcons[amenity]}
                                            {amenity}
                                        </div>
                                    ))}
                                </div>

                                {/* Price & Rating */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                        paddingTop: '14px',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6C63FF' }}>
                                            LKR {listing.price.toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>/month</span>
                                    </div>
                                    {listing.rating > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Star size={13} color="#FFD700" fill="#FFD700" />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{listing.rating}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                                ({listing.reviews})
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    style={{
                                        width: '100%',
                                        marginTop: '14px',
                                        padding: '11px',
                                        borderRadius: '12px',
                                        background: listing.available
                                            ? 'linear-gradient(135deg, #6C63FF, #a855f7)'
                                            : 'rgba(255,255,255,0.08)',
                                        color: listing.available ? '#fff' : 'rgba(255,255,255,0.4)',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        cursor: listing.available ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                    }}
                                    disabled={!listing.available}
                                    onMouseEnter={(e) => {
                                        if (listing.available) {
                                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                                            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(108,99,255,0.5)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                    }}
                                >
                                    {listing.available ? (
                                        <>View Details <ChevronRight size={15} /></>
                                    ) : (
                                        'Currently Occupied'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '48px',
                    }}
                >
                    <button
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {[1, 2, 3, 4, 5].map((p) => (
                        <button
                            key={p}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background:
                                    p === 1
                                        ? 'linear-gradient(135deg, #6C63FF, #a855f7)'
                                        : 'rgba(255,255,255,0.05)',
                                border: p === 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                color: p === 1 ? '#fff' : 'rgba(255,255,255,0.6)',
                                fontSize: '0.875rem',
                                fontWeight: p === 1 ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .listings-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .listings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
};

export default FeaturedListings;
