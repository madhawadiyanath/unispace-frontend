import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Share2, Heart, ChevronLeft, ChevronRight,
    Phone, Mail, User, MessageCircle, Home, GraduationCap,
    Check, ShoppingCart, Send, X, AlertTriangle, Wrench, CreditCard,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

interface Boarding {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    nearUniversity: string;
    roomType: string;
    amenities: string[];
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    photos: string[];
    status: string;
    landlordId: string;
    landlordName: string;
    createdAt: string;
}

const amenityMap: Record<string, { icon: string; color: string }> = {
    WiFi:            { icon: '📶', color: '#6C63FF' },
    AC:              { icon: '❄️', color: '#38F9D7' },
    Meals:           { icon: '🍽️', color: '#FCD34D' },
    Security:        { icon: '🔒', color: '#FF6584' },
    Kitchen:         { icon: '🍳', color: '#FB923C' },
    Parking:         { icon: '🚗', color: '#94A3B8' },
    Garden:          { icon: '🌿', color: '#43E97B' },
    Laundry:         { icon: '👕', color: '#a855f7' },
    'Study Room':    { icon: '📚', color: '#60A5FA' },
    'Common Kitchen':{ icon: '🍳', color: '#FB923C' },
    Gym:             { icon: '💪', color: '#F97316' },
    Pool:            { icon: '🏊', color: '#38BDF8' },
    CCTV:            { icon: '📹', color: '#FF6584' },
    'Hot Water':     { icon: '🚿', color: '#38F9D7' },
    Balcony:         { icon: '🌅', color: '#FCD34D' },
};

const BoardingDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [boarding, setBoarding] = useState<Boarding | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activePhoto, setActivePhoto] = useState(0);
    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [cartAdded, setCartAdded] = useState(false);

    // Chat state
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatSending, setChatSending] = useState(false);
    const [chatSent, setChatSent] = useState(false);
    const [chatError, setChatError] = useState('');
    const chatTextRef = useRef<HTMLTextAreaElement>(null);

    // Issue report state
    const [showIssueForm, setShowIssueForm] = useState(false);
    const [issueType, setIssueType] = useState('repairs');
    const [issuePriority, setIssuePriority] = useState('medium');
    const [issueDescription, setIssueDescription] = useState('');
    const [issueSending, setIssueSending] = useState(false);
    const [issueSent, setIssueSent] = useState(false);
    const [issueError, setIssueError] = useState('');

    // Advance payment state
    const [showAdvanceForm, setShowAdvanceForm] = useState(false);
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [advanceSending, setAdvanceSending] = useState(false);
    const [advanceSent, setAdvanceSent] = useState(false);
    const [advanceError, setAdvanceError] = useState('');

    // More Options Panel state
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id) { setNotFound(true); setLoading(false); return; }
        fetch(`${API_BASE}/boardings/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.boarding) setBoarding(data.boarding);
                else setNotFound(true);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleAddToCart = () => {
        if (!boarding) return;

        const cartItem = {
            _id: boarding._id,
            title: boarding.title,
            price: boarding.price,
            location: boarding.location,
            photos: boarding.photos,
            timestamp: new Date().getTime(),
        };

        const existingCart = localStorage.getItem('boardingCart') ? JSON.parse(localStorage.getItem('boardingCart') || '[]') : [];
        const itemExists = existingCart.some((item: any) => item._id === boarding._id);

        if (!itemExists) {
            existingCart.push(cartItem);
            localStorage.setItem('boardingCart', JSON.stringify(existingCart));
        }

        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2500);
    };

    const handleSendChat = async () => {
        if (!boarding || !chatMessage.trim()) return;
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const user = JSON.parse(storedUser);
        setChatSending(true);
        setChatError('');
        try {
            const res = await fetch(`${API_BASE}/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boardingId:    boarding._id,
                    boardingTitle: boarding.title,
                    senderId:      user._id,
                    senderName:    user.name,
                    senderEmail:   user.email,
                    ownerId:       boarding.landlordId,
                    message:       chatMessage.trim(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setChatSent(true);
                setChatMessage('');
                setTimeout(() => { setChatSent(false); setShowChat(false); }, 3000);
            } else {
                setChatError(data.error || 'Failed to send message.');
            }
        } catch {
            setChatError('Network error. Please try again.');
        } finally {
            setChatSending(false);
        }
    };

    const handleReportIssue = async () => {
        if (!boarding || !issueDescription.trim()) return;
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const user = JSON.parse(storedUser);
        setIssueSending(true);
        setIssueError('');
        try {
            const res = await fetch(`${API_BASE}/issues`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boardingId:    boarding._id,
                    boardingTitle: boarding.title,
                    tenantId:      user._id,
                    tenantName:    user.name,
                    tenantEmail:   user.email,
                    landlordId:    boarding.landlordId,
                    issueType,
                    priority:      issuePriority,
                    description:   issueDescription.trim(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setIssueSent(true);
                setIssueDescription('');
                setTimeout(() => { setIssueSent(false); setShowIssueForm(false); }, 3500);
            } else {
                setIssueError(data.message || 'Failed to submit issue.');
            }
        } catch {
            setIssueError('Network error. Please try again.');
        } finally {
            setIssueSending(false);
        }
    };

    const handlePayAdvance = async () => {
        const amt = Number(advanceAmount);
        if (!boarding || isNaN(amt) || amt <= 0) { setAdvanceError('Please enter a valid amount.'); return; }
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const user = JSON.parse(storedUser);
        setAdvanceSending(true);
        setAdvanceError('');
        try {
            const res = await fetch(`${API_BASE}/advances`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boardingId:    boarding._id,
                    boardingTitle: boarding.title,
                    tenantId:      user._id,
                    tenantName:    user.name,
                    tenantEmail:   user.email,
                    landlordId:    boarding.landlordId,
                    landlordName:  boarding.landlordName,
                    amount:        amt,
                    paymentMethod: 'card',
                }),
            });
            const data = await res.json();
            if (data.success) {
                setAdvanceSent(true);
                setAdvanceAmount('');
                setTimeout(() => { setAdvanceSent(false); setShowAdvanceForm(false); }, 4000);
            } else {
                setAdvanceError(data.message || 'Payment submission failed.');
            }
        } catch {
            setAdvanceError('Network error. Please try again.');
        } finally {
            setAdvanceSending(false);
        }
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '18px', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(108,99,255,0.15)', borderTopColor: '#6C63FF', animation: 'spin 0.9s linear infinite' }} />
                    <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '3px solid rgba(168,85,247,0.15)', borderTopColor: '#a855f7', animation: 'spin 1.3s linear infinite reverse' }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', margin: 0 }}>Loading boarding details…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    /* ── Not Found ── */
    if (notFound || !boarding) {
        return (
            <div style={{ minHeight: '100vh', background: '#0D0D1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '14px', fontFamily: "'Inter', sans-serif", color: '#fff', textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '5rem', marginBottom: '4px' }}>🏚️</div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Boarding Not Found</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.95rem' }}>This listing may have been removed or is unavailable.</p>
                <button onClick={() => navigate(-1)} style={{ marginTop: '16px', padding: '12px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(108,99,255,0.4)' }}>
                    ← Go Back
                </button>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const photos = boarding.photos ?? [];
    const hasPhotos = photos.length > 0;
    const isAvailable = boarding.status === 'published';

    /* ── Page ── */
    return (
        <div style={{ minHeight: '100vh', background: '#0D0D1A', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <div style={{ position: 'relative', height: '72vh', minHeight: '520px', overflow: 'hidden' }}>

                {/* Photo layers */}
                {hasPhotos ? (
                    photos.map((p, i) => (
                        <img
                            key={i}
                            src={`${API_BASE}${p}`}
                            alt=""
                            style={{
                                position: 'absolute', inset: 0, width: '100%', height: '100%',
                                objectFit: 'cover', transition: 'opacity 0.7s ease',
                                opacity: i === activePhoto ? 1 : 0,
                                transform: 'scale(1.02)',
                            }}
                        />
                    ))
                ) : (
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0533 0%, #0d0d2a 40%, #001a2c 100%)' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.25) 0%, transparent 70%)' }} />
                    </div>
                )}

                {/* Multi-layer overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0D1A 0%, rgba(13,13,26,0.65) 35%, rgba(13,13,26,0.25) 65%, rgba(13,13,26,0.55) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(108,99,255,0.18) 0%, transparent 55%)' }} />

                {/* ── Top navbar ── */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '22px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.5)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleShare}
                            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.65)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)'; }}
                        >
                            {copied ? <><Check size={15} color="#43E97B" /> Copied!</> : <><Share2 size={15} /> Share</>}
                        </button>
                        <button
                            onClick={() => setLiked(p => !p)}
                            style={{ width: '42px', height: '42px', borderRadius: '50%', background: liked ? 'rgba(255,101,132,0.85)' : 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)', border: `1px solid ${liked ? 'rgba(255,101,132,0.5)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s' }}
                        >
                            <Heart size={17} color="#fff" fill={liked ? '#fff' : 'transparent'} />
                        </button>
                    </div>
                </div>

                {/* ── Hero text ── */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, padding: '0 32px 44px' }}>
                    <div style={{ maxWidth: '860px' }}>
                        {/* Tags */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span style={{ padding: '5px 16px', borderRadius: '8px', background: 'rgba(108,99,255,0.75)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                {boarding.roomType}
                            </span>
                            <span style={{ padding: '5px 16px', borderRadius: '8px', background: isAvailable ? 'rgba(67,233,123,0.85)' : 'rgba(255,101,132,0.85)', backdropFilter: 'blur(8px)', color: '#0D0D1A', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.8px' }}>
                                {isAvailable ? '● AVAILABLE' : '● OCCUPIED'}
                            </span>
                        </div>

                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 900, margin: '0 0 14px', lineHeight: 1.08, letterSpacing: '-0.5px', textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}>
                            {boarding.title}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem' }}>
                                <MapPin size={15} color="#6C63FF" /> {boarding.location}
                            </div>
                            {boarding.nearUniversity && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                                    <GraduationCap size={15} color="#a855f7" /> Near {boarding.nearUniversity}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                <Home size={13} color="#38F9D7" /> By {boarding.landlordName || 'Landlord'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo nav arrows */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={() => setActivePhoto(p => (p - 1 + photos.length) % photos.length)}
                            style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.6)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.5)'; }}
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            onClick={() => setActivePhoto(p => (p + 1) % photos.length)}
                            style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.6)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.5)'; }}
                        >
                            <ChevronRight size={22} />
                        </button>

                        {/* Dot indicators */}
                        <div style={{ position: 'absolute', bottom: '18px', right: '28px', zIndex: 20, display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {photos.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActivePhoto(i)}
                                    style={{ width: i === activePhoto ? '28px' : '8px', height: '8px', borderRadius: '4px', background: i === activePhoto ? '#6C63FF' : 'rgba(255,255,255,0.38)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
                                />
                            ))}
                        </div>

                        {/* Photo counter */}
                        <div style={{ position: 'absolute', top: '80px', right: '24px', zIndex: 20, padding: '5px 14px', borderRadius: '100px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                            {activePhoto + 1} / {photos.length}
                        </div>
                    </>
                )}
            </div>

            {/* ══════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════ */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '48px', alignItems: 'start' }} className="bd-grid">

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* ── About ── */}
                        <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '22px', padding: '32px' }}>
                            <SectionTitle>About This Place</SectionTitle>
                            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.9, margin: 0, fontSize: '0.97rem', fontWeight: 400 }}>
                                {boarding.description}
                            </p>
                        </div>

                        {/* ── Amenities ── */}
                        {boarding.amenities?.length > 0 && (
                            <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '22px', padding: '32px' }}>
                                <SectionTitle>Amenities & Facilities</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                                    {boarding.amenities.slice(0, 12).map(a => {
                                        const am = amenityMap[a] || { icon: '✓', color: '#6C63FF' };
                                        return (
                                            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.16)', transition: 'all 0.2s', cursor: 'default' }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.14)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                                            >
                                                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{am.icon}</span>
                                                <span style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600 }}>{a}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {boarding.amenities.length > 12 && (
                                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
                                        +{boarding.amenities.length - 12} more amenities available
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Location ── */}
                        <div style={{ background: 'rgba(18,18,40,0.85)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: '22px', padding: '32px' }}>
                            <SectionTitle>Location</SectionTitle>
                            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '240px', background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(13,13,26,0.8) 100%)', border: '1px solid rgba(108,99,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative' }}>
                                {/* Grid dots background */}
                                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                                            <circle cx="2" cy="2" r="1.5" fill="#6C63FF" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#dots)" />
                                </svg>
                                {/* Glow */}
                                <div style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(108,99,255,0.2)', filter: 'blur(32px)' }} />
                                <div style={{ position: 'relative', zIndex: 2, width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(108,99,255,0.6)' }}>
                                    <MapPin size={22} color="#fff" />
                                </div>
                                <p style={{ position: 'relative', zIndex: 2, color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{boarding.location}</p>
                                {boarding.nearUniversity && (
                                    <p style={{ position: 'relative', zIndex: 2, color: 'rgba(255,255,255,0.42)', margin: 0, fontSize: '0.82rem' }}>📍 Near {boarding.nearUniversity}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Price card - SIMPLIFIED */}
                        <div style={{ background: 'rgba(14,14,35,0.97)', border: '1px solid rgba(108,99,255,0.35)', borderRadius: '22px', padding: '28px', boxShadow: '0 24px 70px rgba(108,99,255,0.18)' }}>

                            {/* Price */}
                            <div style={{ marginBottom: '22px', paddingBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '8px' }}>Monthly Rent</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #6C63FF, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                                        LKR {boarding.price?.toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>per month</div>
                            </div>

                            {/* Quick facts */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '26px' }}>
                                {[
                                    { icon: <Home size={14} />, label: boarding.roomType, color: '#6C63FF' },
                                    { icon: <MapPin size={14} />, label: boarding.location, color: '#a855f7' },
                                    { icon: <GraduationCap size={14} />, label: boarding.nearUniversity ? `Near ${boarding.nearUniversity}` : 'University area', color: '#38F9D7' },
                                ].map(({ icon, label, color }) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.68)' }}>
                                        <span style={{ color, flexShrink: 0 }}>{icon}</span>
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact CTA - Primary Action */}
                            <button
                                onClick={() => setShowContact(c => !c)}
                                disabled={!isAvailable}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '14px', marginBottom: '12px',
                                    background: isAvailable ? 'linear-gradient(135deg, #6C63FF, #a855f7)' : 'rgba(255,255,255,0.06)',
                                    border: 'none', color: isAvailable ? '#fff' : 'rgba(255,255,255,0.25)',
                                    fontWeight: 700, fontSize: '0.95rem', cursor: isAvailable ? 'pointer' : 'not-allowed',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: isAvailable ? '0 8px 28px rgba(108,99,255,0.45)' : 'none',
                                    transition: 'all 0.25s',
                                }}
                                onMouseEnter={e => { if (isAvailable) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(108,99,255,0.6)'; } }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = isAvailable ? '0 8px 28px rgba(108,99,255,0.45)' : 'none'; }}
                            >
                                <MessageCircle size={18} />
                                {isAvailable ? (showContact ? 'Hide Contact Info' : 'Contact Landlord') : 'Currently Occupied'}
                            </button>

                            {/* Add to Cart Button - Primary Action */}
                            <button
                                onClick={handleAddToCart}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '14px', marginBottom: '16px',
                                    background: cartAdded ? 'rgba(67,233,123,0.2)' : 'rgba(108,99,255,0.12)',
                                    border: cartAdded ? '1px solid rgba(67,233,123,0.4)' : '1px solid rgba(108,99,255,0.3)',
                                    color: cartAdded ? '#43E97B' : 'rgba(196,181,253,0.9)',
                                    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    transition: 'all 0.25s',
                                }}
                                onMouseEnter={e => { if (!cartAdded) { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.22)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.5)'; } }}
                                onMouseLeave={e => { if (!cartAdded) { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)'; } }}
                            >
                                <ShoppingCart size={18} />
                                {cartAdded ? '✓ Added to Cart' : 'Add to Cart'}
                            </button>

                            {/* Share button */}
                            <button
                                onClick={handleShare}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'all 0.2s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                            >
                                <Share2 size={15} /> {copied ? '✓ Link Copied!' : 'Share Listing'}
                            </button>
                        </div>

                        {/* ══════════════════════════════════════
                            MORE OPTIONS PANEL
                            ══════════════════════════════════════ */}
                        <div style={{ background: 'rgba(14,14,35,0.97)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '22px', padding: '20px' }}>
                            <button
                                onClick={() => setShowMoreOptions(c => !c)}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '14px',
                                    background: showMoreOptions ? 'rgba(108,99,255,0.15)' : 'rgba(108,99,255,0.08)',
                                    border: `1px solid ${showMoreOptions ? 'rgba(108,99,255,0.4)' : 'rgba(108,99,255,0.25)'}`,
                                    color: 'rgba(196,181,253,0.9)',
                                    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    transition: 'all 0.25s',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.18)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = showMoreOptions ? 'rgba(108,99,255,0.15)' : 'rgba(108,99,255,0.08)'; }}
                            >
                                {showMoreOptions ? <X size={17} /> : '⋯'} {showMoreOptions ? 'Hide More Options' : 'More Options'}
                            </button>

                            {showMoreOptions && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px', animation: 'slideDown 0.3s ease' }}>
                                    {/* ── Chat with Owner ── */}
                                    {isAvailable && (
                                        <div>
                                            <button
                                                onClick={() => { setShowChat(c => !c); setChatSent(false); setChatError(''); }}
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '12px',
                                                    background: showChat ? 'rgba(56,249,215,0.15)' : 'rgba(56,249,215,0.08)',
                                                    border: `1px solid ${showChat ? 'rgba(56,249,215,0.4)' : 'rgba(56,249,215,0.25)'}`,
                                                    color: '#38F9D7',
                                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                                    transition: 'all 0.25s',
                                                }}
                                            >
                                                {showChat ? <X size={16} /> : <MessageCircle size={16} />} {showChat ? 'Close Chat' : 'Chat with Owner'}
                                            </button>

                                            {showChat && (
                                                <div style={{ borderRadius: '12px', background: 'rgba(56,249,215,0.05)', border: '1px solid rgba(56,249,215,0.2)', padding: '14px', marginTop: '10px', animation: 'slideDown 0.25s ease' }}>
                                                    {chatSent ? (
                                                        <div style={{ textAlign: 'center', padding: '12px 0', color: '#43E97B', fontWeight: 700, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontSize: '1.8rem' }}>✅</span>
                                                            Message sent!
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <textarea
                                                                ref={chatTextRef}
                                                                value={chatMessage}
                                                                onChange={e => setChatMessage(e.target.value)}
                                                                placeholder={`Hi ${boarding.landlordName || 'there'}…`}
                                                                rows={3}
                                                                style={{
                                                                    width: '100%', boxSizing: 'border-box',
                                                                    background: 'rgba(0,0,0,0.3)',
                                                                    border: '1px solid rgba(56,249,215,0.25)',
                                                                    borderRadius: '10px', padding: '10px 12px',
                                                                    color: '#fff', fontSize: '0.82rem', lineHeight: 1.4,
                                                                    resize: 'none', outline: 'none',
                                                                    fontFamily: "'Inter', sans-serif",
                                                                    marginBottom: '10px',
                                                                }}
                                                            />
                                                            {chatError && <p style={{ color: '#FF6584', fontSize: '0.75rem', margin: '0 0 8px' }}>⚠ {chatError}</p>}
                                                            <button
                                                                onClick={handleSendChat}
                                                                disabled={chatSending || !chatMessage.trim()}
                                                                style={{
                                                                    width: '100%', padding: '10px', borderRadius: '10px',
                                                                    background: chatSending || !chatMessage.trim() ? 'rgba(56,249,215,0.08)' : 'linear-gradient(135deg, #38F9D7, #43E97B)',
                                                                    border: 'none',
                                                                    color: chatSending || !chatMessage.trim() ? 'rgba(255,255,255,0.3)' : '#0D0D1A',
                                                                    fontWeight: 700, fontSize: '0.85rem',
                                                                    cursor: chatSending || !chatMessage.trim() ? 'not-allowed' : 'pointer',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                                    transition: 'all 0.2s',
                                                                }}
                                                            >
                                                                {chatSending ? <div style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0D0D1A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <Send size={13} />} {chatSending ? 'Sending…' : 'Send'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ── Pay Advance ── */}
                                    {isAvailable && (
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setShowAdvanceForm(c => !c);
                                                    setAdvanceSent(false);
                                                    setAdvanceError('');
                                                    if (!showAdvanceForm && boarding) setAdvanceAmount(String(boarding.price || ''));
                                                }}
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '12px',
                                                    background: showAdvanceForm ? 'rgba(67,233,123,0.15)' : 'rgba(67,233,123,0.08)',
                                                    border: `1px solid ${showAdvanceForm ? 'rgba(67,233,123,0.4)' : 'rgba(67,233,123,0.25)'}`,
                                                    color: '#43E97B',
                                                    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                                    transition: 'all 0.25s',
                                                }}
                                            >
                                                {showAdvanceForm ? <X size={16} /> : <CreditCard size={16} />} {showAdvanceForm ? 'Cancel' : 'Pay Advance'}
                                            </button>

                                            {showAdvanceForm && isAvailable && (() => {
                                                const amt = Number(advanceAmount) || 0;
                                                const platformFee = Math.round(amt * 0.12);
                                                const landlordAmt = amt - platformFee;
                                                return (
                                                    <div style={{ borderRadius: '12px', background: 'rgba(67,233,123,0.05)', border: '1px solid rgba(67,233,123,0.22)', padding: '12px', marginTop: '10px', animation: 'slideDown 0.25s ease' }}>
                                                        {advanceSent ? (
                                                            <div style={{ textAlign: 'center', padding: '12px 0', color: '#43E97B', fontWeight: 700, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ fontSize: '1.8rem' }}>✅</span>
                                                                Advance submitted!
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={advanceAmount}
                                                                    onChange={e => { setAdvanceAmount(e.target.value); setAdvanceError(''); }}
                                                                    placeholder={`${boarding.price}`}
                                                                    style={{
                                                                        width: '100%', boxSizing: 'border-box', padding: '9px 11px',
                                                                        background: 'rgba(0,0,0,0.3)',
                                                                        border: '1px solid rgba(67,233,123,0.25)',
                                                                        borderRadius: '10px', color: '#fff',
                                                                        fontSize: '0.9rem', fontWeight: 700, outline: 'none',
                                                                        fontFamily: "'Inter', sans-serif",
                                                                        marginBottom: '10px',
                                                                    }}
                                                                />
                                                                {amt > 0 && (
                                                                    <div style={{ marginBottom: '10px', padding: '10px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                                            <span>Amount:</span>
                                                                            <span style={{ color: '#fff', fontWeight: 700 }}>LKR {amt.toLocaleString()}</span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                                            <span>Fee (12%):</span>
                                                                            <span style={{ color: '#FCD34D', fontWeight: 700 }}>−LKR {platformFee.toLocaleString()}</span>
                                                                        </div>
                                                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.09)', paddingTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                                                            <span>To Landlord:</span>
                                                                            <span style={{ color: '#43E97B', fontWeight: 800 }}>LKR {landlordAmt.toLocaleString()}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {advanceError && <p style={{ color: '#FF6584', fontSize: '0.75rem', margin: '0 0 8px' }}>⚠ {advanceError}</p>}
                                                                <button
                                                                    onClick={handlePayAdvance}
                                                                    disabled={advanceSending || !advanceAmount || Number(advanceAmount) <= 0}
                                                                    style={{
                                                                        width: '100%', padding: '10px', borderRadius: '10px',
                                                                        background: advanceSending || !advanceAmount || Number(advanceAmount) <= 0 ? 'rgba(67,233,123,0.08)' : 'linear-gradient(135deg, #43E97B, #38F9D7)',
                                                                        border: 'none',
                                                                        color: advanceSending || !advanceAmount || Number(advanceAmount) <= 0 ? 'rgba(255,255,255,0.3)' : '#0D0D1A',
                                                                        fontWeight: 700, fontSize: '0.85rem',
                                                                        cursor: advanceSending || !advanceAmount || Number(advanceAmount) <= 0 ? 'not-allowed' : 'pointer',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                                        transition: 'all 0.2s',
                                                                    }}
                                                                >
                                                                    {advanceSending ? <div style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0D0D1A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <CreditCard size={13} />} {advanceSending ? 'Processing…' : 'Confirm'}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    {/* ── Report Issue ── */}
                                    <div>
                                        <button
                                            onClick={() => { setShowIssueForm(c => !c); setIssueSent(false); setIssueError(''); }}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: '12px',
                                                background: showIssueForm ? 'rgba(252,211,77,0.15)' : 'rgba(252,211,77,0.08)',
                                                border: `1px solid ${showIssueForm ? 'rgba(252,211,77,0.4)' : 'rgba(252,211,77,0.25)'}`,
                                                color: '#FCD34D',
                                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                                transition: 'all 0.25s',
                                            }}
                                        >
                                            {showIssueForm ? <X size={16} /> : <AlertTriangle size={16} />} {showIssueForm ? 'Cancel' : 'Report Issue'}
                                        </button>

                                        {showIssueForm && (
                                            <div style={{ borderRadius: '12px', background: 'rgba(252,211,77,0.05)', border: '1px solid rgba(252,211,77,0.2)', padding: '12px', marginTop: '10px', animation: 'slideDown 0.25s ease' }}>
                                                {issueSent ? (
                                                    <div style={{ textAlign: 'center', padding: '12px 0', color: '#43E97B', fontWeight: 700, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '1.8rem' }}>✅</span>
                                                        Issue reported!
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div style={{ marginBottom: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Type</div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                                                            {[
                                                                { id: 'cleaning', label: '🧹 Cleaning' },
                                                                { id: 'repairs', label: '🔨 Repairs' },
                                                                { id: 'plumbing', label: '💧 Plumbing' },
                                                                { id: 'electrical', label: '⚡ Electrical' },
                                                            ].map(t => (
                                                                <button
                                                                    key={t.id}
                                                                    type="button"
                                                                    onClick={() => setIssueType(t.id)}
                                                                    style={{
                                                                        padding: '8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                                                        background: issueType === t.id ? 'rgba(252,211,77,0.2)' : 'rgba(255,255,255,0.04)',
                                                                        border: `1px solid ${issueType === t.id ? 'rgba(252,211,77,0.4)' : 'rgba(255,255,255,0.1)'}`,
                                                                        color: issueType === t.id ? '#FCD34D' : 'rgba(255,255,255,0.5)',
                                                                    }}
                                                                >{t.label}</button>
                                                            ))}
                                                        </div>
                                                        <div style={{ marginBottom: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Priority</div>
                                                        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                                            {['Low', 'Medium', 'High'].map(p => (
                                                                <button
                                                                    key={p}
                                                                    type="button"
                                                                    onClick={() => setIssuePriority(p.toLowerCase())}
                                                                    style={{
                                                                        flex: 1, padding: '7px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                                                        background: issuePriority === p.toLowerCase() ? 'rgba(252,211,77,0.2)' : 'rgba(255,255,255,0.04)',
                                                                        border: `1px solid ${issuePriority === p.toLowerCase() ? 'rgba(252,211,77,0.4)' : 'rgba(255,255,255,0.1)'}`,
                                                                        color: issuePriority === p.toLowerCase() ? '#FCD34D' : 'rgba(255,255,255,0.5)',
                                                                    }}
                                                                >{p}</button>
                                                            ))}
                                                        </div>
                                                        <textarea
                                                            value={issueDescription}
                                                            onChange={e => { setIssueDescription(e.target.value); setIssueError(''); }}
                                                            placeholder="Describe the issue…"
                                                            rows={2}
                                                            style={{
                                                                width: '100%', boxSizing: 'border-box',
                                                                background: 'rgba(0,0,0,0.3)',
                                                                border: '1px solid rgba(252,211,77,0.25)',
                                                                borderRadius: '10px', padding: '9px 11px',
                                                                color: '#fff', fontSize: '0.82rem', lineHeight: 1.3,
                                                                resize: 'none', outline: 'none',
                                                                fontFamily: "'Inter', sans-serif",
                                                                marginBottom: '10px',
                                                            }}
                                                        />
                                                        {issueError && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0 0 8px' }}>⚠ {issueError}</p>}
                                                        <button
                                                            onClick={handleReportIssue}
                                                            disabled={issueSending || !issueDescription.trim()}
                                                            style={{
                                                                width: '100%', padding: '10px', borderRadius: '10px',
                                                                background: issueSending || !issueDescription.trim() ? 'rgba(252,211,77,0.08)' : 'linear-gradient(135deg, #FCD34D, #f59e0b)',
                                                                border: 'none',
                                                                color: issueSending || !issueDescription.trim() ? 'rgba(255,255,255,0.3)' : '#0D0D1A',
                                                                fontWeight: 700, fontSize: '0.85rem',
                                                                cursor: issueSending || !issueDescription.trim() ? 'not-allowed' : 'pointer',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                                transition: 'all 0.2s',
                                                            }}
                                                        >
                                                            {issueSending ? <div style={{ width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0D0D1A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <Wrench size={13} />} {issueSending ? 'Submitting…' : 'Report'}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact details reveal - shown via Contact Landlord button */}
                        {showContact && isAvailable && (
                            <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.22)', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'slideDown 0.25s ease' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '4px' }}>Contact Details</div>

                                {boarding.contactName && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                                        <User size={13} color="#6C63FF" style={{ flexShrink: 0 }} />
                                        {boarding.contactName}
                                    </div>
                                )}
                                {boarding.contactPhone && (
                                    <a href={`tel:${boarding.contactPhone}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#43E97B', textDecoration: 'none', fontWeight: 600 }}>
                                        <Phone size={13} style={{ flexShrink: 0 }} />
                                        {boarding.contactPhone}
                                    </a>
                                )}
                                {boarding.contactEmail && (
                                    <a href={`mailto:${boarding.contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#38F9D7', textDecoration: 'none', fontWeight: 600, wordBreak: 'break-all' }}>
                                        <Mail size={13} style={{ flexShrink: 0 }} />
                                        {boarding.contactEmail}
                                    </a>
                                )}
                                {boarding.contactPhone && (
                                    <a
                                        href={`https://wa.me/${boarding.contactPhone.replace(/\D/g, '')}`}
                                        target="_blank" rel="noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '3px', padding: '10px', borderRadius: '10px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.28)', color: '#25D366', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.22)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.12)'; }}
                                    >
                                        💬 WhatsApp Now
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                input::placeholder { color: rgba(255,255,255,0.25); }
                @media (max-width: 900px) {
                    .bd-grid { grid-template-columns: 1fr !important; }
                    .bd-inner-grid { grid-template-columns: 1fr 1fr !important; }
                }
                @media (max-width: 560px) {
                    .bd-inner-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

/* ── Reusable section heading ── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ display: 'inline-block', width: '4px', height: '22px', background: 'linear-gradient(to bottom, #6C63FF, #a855f7)', borderRadius: '2px', flexShrink: 0 }} />
        {children}
    </h2>
);

export default BoardingDetailsPage;
