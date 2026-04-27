import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Send, ThumbsUp } from 'lucide-react';

const Testimonials = () => {
    const [active, setActive] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());
    const [newReview, setNewReview] = useState({
        name: '',
        university: '',
        year: '',
        rating: 5,
        text: ''
    });

    const defaultTestimonials = [
        {
            name: 'Kavindi Perera',
            university: 'SLIIT',
            year: '2nd Year – IT',
            rating: 5,
            text: 'BoardingFinder made finding a room near NSBM so easy! I found a verified listing within 10 minutes and moved in within a week. The reviews from other students were super helpful.',
            avatar: '👩🎓',
            color: '#6C63FF',
        },
        {
            name: 'Tharaka Jayawardena',
            university: 'SLIIT',
            year: '3rd Year – CS',
            rating: 5,
            text: 'The distance filter was a game-changer. I could see exactly how far each boarding house was from my faculty. Saved so much time compared to Facebook groups!',
            avatar: '👨🎓',
            color: '#43E97B',
        },
        {
            name: 'Nimesha Gamage',
            university: 'SLIIT',
            year: '1st Year – SE',
            rating: 5,
            text: 'Being a girl from outside Colombo, safety was my top priority. BoardingFinder\'s verified listings gave me the confidence to find a girls-only hostel. Highly recommend!',
            avatar: '👩💻',
            color: '#FF6584',
        },
        {
            name: 'Dulshan Rathnayake',
            university: 'Moratuwa University',
            year: '4th Year – Eng',
            rating: 4,
            text: 'Great platform! The landlord contact system is seamless. I especially love the price comparison feature. Found a room for half the price I was paying before.',
            avatar: '👨💼',
            color: '#38F9D7',
        },
    ];

    const [testimonials, setTestimonials] = useState(() => {
        const storedReviews = localStorage.getItem('site_reviews');
        if (storedReviews) {
            try {
                const parsed = JSON.parse(storedReviews);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return [...parsed, ...defaultTestimonials];
                }
            } catch (err) {
                console.error("Failed to parse reviews", err);
            }
        }
        return defaultTestimonials;
    });

    const prev = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
            setIsAnimating(false);
        }, 150);
    };

    const next = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));
            setIsAnimating(false);
        }, 150);
    };

    const handleLike = (index: number) => {
        setLikedReviews(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleSubmitReview = () => {
        if (newReview.name && newReview.university && newReview.text) {
            const review = {
                ...newReview,
                avatar: '👤',
                color: '#FF6B6B',
            };
            const updatedReviews = [review, ...testimonials];
            setTestimonials(updatedReviews);
            localStorage.setItem('site_reviews', JSON.stringify([review]));
            setNewReview({ name: '', university: '', year: '', rating: 5, text: '' });
            setShowReviewForm(false);
        }
    };

    const current = testimonials[active];

    return (
        <section
            style={{
                padding: '100px 24px',
                background: 'linear-gradient(180deg, var(--app-bg-2) 0%, var(--app-bg) 100%)',
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--text-primary)',
            }}
        >
            {/* Background decoration */}
            <div
                style={{
                    position: 'absolute',
                    right: '-200px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255,215,0,0.1)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '100px',
                            padding: '6px 16px',
                            marginBottom: '16px',
                        }}
                    >
                        <Star size={14} color="#FFD700" fill="#FFD700" />
                        <span style={{ fontSize: '0.8rem', color: '#FFD700', fontWeight: 600 }}>
                            Student Reviews
                        </span>
                    </div>
                    <h2
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        What Students{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #FFD700, #FF6584)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Are Saying
                        </span>
                    </h2>
                </div>

                {/* Testimonial Card */}
                <div
                    style={{
                        background: 'var(--surface-2)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${current.color}30`,
                        borderRadius: '20px',
                        padding: '32px',
                        position: 'relative',
                        boxShadow: `var(--shadow-card), 0 0 0 1px ${current.color}15`,
                        transition: 'all 0.4s ease',
                        transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
                        opacity: isAnimating ? 0.8 : 1,
                    }}
                >
                    {/* Quote icon */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: `${current.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Quote size={24} color={current.color} />
                    </div>

                    {/* Stars */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                color="#FFD700"
                                fill={i < current.rating ? '#FFD700' : 'transparent'}
                            />
                        ))}
                    </div>

                    {/* Text */}
                    <p
                        style={{
                            fontSize: '1.1rem',
                            lineHeight: 1.7,
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic',
                            marginBottom: '28px',
                            maxWidth: '680px',
                        }}
                    >
                        "{current.text}"
                    </p>

                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: `${current.color}20`,
                                    border: `2px solid ${current.color}40`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                }}
                            >
                                {current.avatar}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{current.name}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    {current.university}
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.7rem',
                                        color: current.color,
                                        fontWeight: 600,
                                        marginTop: '2px',
                                    }}
                                >
                                    {current.year}
                                </div>
                            </div>
                        </div>
                        
                        {/* Like Button */}
                        <button
                            onClick={() => handleLike(active)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '10px',
                                background: likedReviews.has(active) ? `${current.color}20` : 'var(--surface-1)',
                                border: `1px solid ${likedReviews.has(active) ? current.color : 'var(--border-1)'}`,
                                color: likedReviews.has(active) ? current.color : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.85rem',
                            }}
                            onMouseEnter={(e) => {
                                if (!likedReviews.has(active)) {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                                    (e.currentTarget as HTMLElement).style.borderColor = current.color;
                                    (e.currentTarget as HTMLElement).style.color = current.color;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!likedReviews.has(active)) {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--surface-1)';
                                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-1)';
                                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            <ThumbsUp size={14} fill={likedReviews.has(active) ? current.color : 'transparent'} />
                            {likedReviews.has(active) ? 'Liked' : 'Helpful'}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '24px',
                    }}
                >
                    <button
                        onClick={prev}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'var(--surface-1)',
                            border: '1px solid var(--border-1)',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--btn-ghost-border)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--surface-1)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-1)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Dots */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                style={{
                                    width: active === i ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '100px',
                                    background: active === i ? current.color : 'var(--border-1)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'var(--surface-1)',
                            border: '1px solid var(--border-1)',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--nav-link-hover-bg)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--btn-ghost-border)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--surface-1)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-1)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                
                {/* Review Form */}
                {showReviewForm && (
                    <div
                        style={{
                            marginTop: '32px',
                            padding: '32px',
                            background: 'var(--surface-2)',
                            borderRadius: '20px',
                            border: '1px solid var(--border-1)',
                            boxShadow: 'var(--shadow-card)',
                        }}
                    >
                        <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                            Write Your Review
                        </h3>
                        
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--surface-1)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="University"
                                    value={newReview.university}
                                    onChange={(e) => setNewReview({...newReview, university: e.target.value})}
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--surface-1)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>
                            
                            <input
                                type="text"
                                placeholder="Year & Field (e.g., 2nd Year - IT)"
                                value={newReview.year}
                                onChange={(e) => setNewReview({...newReview, year: e.target.value})}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-1)',
                                    background: 'var(--surface-1)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                }}
                            />
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Rating
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setNewReview({...newReview, rating: i + 1})}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                            }}
                                        >
                                            <Star
                                                size={24}
                                                color="#FFD700"
                                                fill={i < newReview.rating ? '#FFD700' : 'transparent'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <textarea
                                placeholder="Share your experience..."
                                value={newReview.text}
                                onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                                rows={4}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-1)',
                                    background: 'var(--surface-1)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                }}
                            />
                            
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--surface-1)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <Send size={16} />
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
