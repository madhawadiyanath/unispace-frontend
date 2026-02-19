import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
    const [active, setActive] = useState(0);

    const testimonials = [
        {
            name: 'Kavindi Perera',
            university: 'NSBM Green University',
            year: '2nd Year – IT',
            rating: 5,
            text: 'BoardingFinder made finding a room near NSBM so easy! I found a verified listing within 10 minutes and moved in within a week. The reviews from other students were super helpful.',
            avatar: '👩🎓',
            color: '#6C63FF',
        },
        {
            name: 'Tharaka Jayawardena',
            university: 'University of Colombo',
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

    const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
    const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

    const current = testimonials[active];

    return (
        <section
            style={{
                padding: '100px 24px',
                background: 'linear-gradient(180deg, #13132A 0%, #0D0D1A 100%)',
                position: 'relative',
                overflow: 'hidden',
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
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255,215,0,0.1)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '100px',
                            padding: '6px 16px',
                            marginBottom: '20px',
                        }}
                    >
                        <Star size={14} color="#FFD700" fill="#FFD700" />
                        <span style={{ fontSize: '0.8rem', color: '#FFD700', fontWeight: 600 }}>
                            Student Stories
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
                        background: 'rgba(20, 20, 50, 0.7)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${current.color}30`,
                        borderRadius: '28px',
                        padding: '48px',
                        position: 'relative',
                        boxShadow: `0 30px 80px rgba(0,0,0,0.3), 0 0 0 1px ${current.color}15`,
                        transition: 'all 0.4s ease',
                    }}
                >
                    {/* Quote icon */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '32px',
                            right: '40px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            background: `${current.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Quote size={28} color={current.color} />
                    </div>

                    {/* Stars */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={20}
                                color="#FFD700"
                                fill={i < current.rating ? '#FFD700' : 'transparent'}
                            />
                        ))}
                    </div>

                    {/* Text */}
                    <p
                        style={{
                            fontSize: '1.2rem',
                            lineHeight: 1.8,
                            color: 'rgba(255,255,255,0.85)',
                            fontStyle: 'italic',
                            marginBottom: '36px',
                            maxWidth: '760px',
                        }}
                    >
                        "{current.text}"
                    </p>

                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: `${current.color}20`,
                                border: `2px solid ${current.color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                            }}
                        >
                            {current.avatar}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{current.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                {current.university}
                            </div>
                            <div
                                style={{
                                    fontSize: '0.75rem',
                                    color: current.color,
                                    fontWeight: 600,
                                    marginTop: '2px',
                                }}
                            >
                                {current.year}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '16px',
                        marginTop: '36px',
                    }}
                >
                    <button
                        onClick={prev}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.2)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.4)';
                            (e.currentTarget as HTMLElement).style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Dots */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {testimonials.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                style={{
                                    width: active === i ? '28px' : '10px',
                                    height: '10px',
                                    borderRadius: '100px',
                                    background: active === i ? current.color : 'rgba(255,255,255,0.2)',
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
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.2)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.4)';
                            (e.currentTarget as HTMLElement).style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
