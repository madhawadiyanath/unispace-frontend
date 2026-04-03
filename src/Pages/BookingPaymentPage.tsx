import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

interface BookingData {
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
    buyerAddress: string;
    buyerCity: string;
    buyerPostalCode: string;
    cardHolderName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCVV: string;
}

const BookingPaymentPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [bookingData, setBookingData] = useState<BookingData>({
        buyerName: '',
        buyerPhone: '',
        buyerEmail: '',
        buyerAddress: '',
        buyerCity: '',
        buyerPostalCode: '',
        cardHolderName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
    });

    const handleDetailsChange = (field: string, value: string) => {
        setBookingData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateDetails = () => {
        if (!bookingData.buyerName.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!bookingData.buyerPhone.trim() || bookingData.buyerPhone.length < 10) {
            setError('Valid phone number is required (minimum 10 digits)');
            return false;
        }
        if (!bookingData.buyerEmail.trim() || !bookingData.buyerEmail.includes('@')) {
            setError('Valid email address is required');
            return false;
        }
        if (!bookingData.buyerAddress.trim()) {
            setError('Address is required');
            return false;
        }
        if (!bookingData.buyerCity.trim()) {
            setError('City is required');
            return false;
        }
        if (!bookingData.buyerPostalCode.trim()) {
            setError('Postal code is required');
            return false;
        }
        return true;
    };

    const validatePayment = () => {
        if (!bookingData.cardHolderName.trim()) {
            setError('Card holder name is required');
            return false;
        }
        
        const cardNum = bookingData.cardNumber.replace(/\s/g, '');
        if (!cardNum.match(/^\d{13,19}$/)) {
            setError('Card number must be 13-19 digits');
            return false;
        }

        // Detect card type
        let cardType = 'Unknown';
        if (/^4/.test(cardNum)) cardType = 'Visa';
        else if (/^5[1-5]/.test(cardNum)) cardType = 'Mastercard';
        else if (/^3[47]/.test(cardNum)) cardType = 'American Express';
        else if (/^6(?:011|5)/.test(cardNum)) cardType = 'Discover';
        
        if (cardType === 'Unknown') {
            setError('Card type not recognized. Use Visa, Mastercard, Amex, or Discover');
            return false;
        }

        if (!bookingData.cardExpiry.trim() || !bookingData.cardExpiry.includes('/')) {
            setError('Valid expiry date is required (MM/YY format)');
            return false;
        }
        
        const [month, year] = bookingData.cardExpiry.split('/');
        if (!month.match(/^\d{2}$/) || parseInt(month) < 1 || parseInt(month) > 12) {
            setError('Invalid expiry month (use MM format, 01-12)');
            return false;
        }
        
        if (!year.match(/^\d{2}$/)) {
            setError('Invalid expiry year (use YY format)');
            return false;
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            setError('Card has expired');
            return false;
        }
        
        if (!bookingData.cardCVV.trim() || !bookingData.cardCVV.match(/^\d{3,4}$/)) {
            setError('Valid CVV is required (3-4 digits)');
            return false;
        }
        
        return true;
    };

    const handleNextToPayment = () => {
        if (validateDetails()) {
            setStep('payment');
        }
    };

    const handleCompleteBooking = async () => {
        if (!validatePayment()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/boardings/book/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientDetails: {
                        name: bookingData.buyerName,
                        phone: bookingData.buyerPhone,
                        email: bookingData.buyerEmail,
                    },
                    paymentDetails: {
                        cardNumber: bookingData.cardNumber.slice(-4),
                        cardExpiry: bookingData.cardExpiry,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Booking failed');
            }

            const boardingData = await response.json();
            const boarding = boardingData.boarding;

            // Create booking record in bookings collection
            await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boardingId: id,
                    boardingTitle: boarding.title,
                    landlordId: boarding.landlordId,
                    landlordName: boarding.landlordName,
                    clientName: bookingData.buyerName,
                    clientEmail: bookingData.buyerEmail,
                    clientPhone: bookingData.buyerPhone,
                    paymentCardLast4: bookingData.cardNumber.slice(-4),
                }),
            });

            setStep('success');
        } catch (err) {
            setError((err as Error).message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--page-bg)', paddingTop: '80px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    {step !== 'success' && (
                        <button
                            onClick={() => navigate(`/boarding/${id}`)}
                            style={{
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border-1)',
                                borderRadius: '10px',
                                padding: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(-4px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
                        >
                            <ArrowLeft size={20} color="var(--text-primary)" />
                        </button>
                    )}
                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {step === 'details' && '👤 Buyer Details'}
                        {step === 'payment' && '💳 Card Payment'}
                        {step === 'success' && '🎉 Booking Confirmed'}
                    </h1>
                </div>

                {/* Progress Indicator */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Step 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: step === 'details' 
                                    ? 'linear-gradient(135deg, #6C63FF, #5A52D5)' 
                                    : 'linear-gradient(135deg, #43E97B, #38F9D7)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                boxShadow: step === 'details' 
                                    ? '0 10px 30px rgba(108, 99, 255, 0.4)' 
                                    : '0 10px 30px rgba(67, 233, 123, 0.4)',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                animation: step === 'details' ? 'pulse 2s infinite' : 'none',
                            }}
                        >
                            {step !== 'details' ? '✓' : '1'}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Details</span>
                    </div>

                    {/* Connecting Line 1 */}
                    <div style={{ flex: 1, height: '3px', background: step === 'payment' || step === 'success' ? 'linear-gradient(90deg, #6C63FF, #43E97B)' : 'var(--border-1)', transition: 'all 0.4s ease', maxWidth: '120px', minWidth: '60px' }} />

                    {/* Step 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: step === 'payment' 
                                    ? 'linear-gradient(135deg, #6C63FF, #5A52D5)' 
                                    : step === 'success'
                                    ? 'linear-gradient(135deg, #43E97B, #38F9D7)'
                                    : 'var(--surface-2)',
                                color: step !== 'details' ? 'white' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                boxShadow: step === 'payment' 
                                    ? '0 10px 30px rgba(108, 99, 255, 0.4)' 
                                    : step === 'success' ? '0 10px 30px rgba(67, 233, 123, 0.4)' : 'none',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                animation: step === 'payment' ? 'pulse 2s infinite' : 'none',
                            }}
                        >
                            {step === 'success' ? '✓' : '2'}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Payment</span>
                    </div>

                    {/* Connecting Line 2 */}
                    <div style={{ flex: 1, height: '3px', background: step === 'success' ? 'linear-gradient(90deg, #6C63FF, #43E97B)' : 'var(--border-1)', transition: 'all 0.4s ease', maxWidth: '120px', minWidth: '60px' }} />

                    {/* Step 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: step === 'success' 
                                    ? 'linear-gradient(135deg, #43E97B, #38F9D7)' 
                                    : 'var(--surface-2)',
                                color: step === 'success' ? 'white' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                boxShadow: step === 'success' ? '0 10px 30px rgba(67, 233, 123, 0.4)' : 'none',
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        >
                            ✓
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirmation</span>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div
                        style={{
                            background: 'var(--danger-soft-bg)',
                            border: '1px solid var(--danger-soft-border)',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            marginBottom: '20px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                        }}
                    >
                        <AlertCircle size={20} color="var(--danger-soft-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: 'var(--danger-soft-text)', fontSize: '0.92rem', fontWeight: 500 }}>{error}</span>
                    </div>
                )}

                {/* Step 1: Buyer Details */}
                {step === 'details' && (
                    <div style={{ background: 'var(--search-panel-bg)', border: '1px solid var(--border-1)', borderRadius: '16px', padding: '32px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                👤 Full Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={bookingData.buyerName}
                                onChange={e => handleDetailsChange('buyerName', e.target.value)}
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    padding: '12px 14px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-1)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    fontFamily: "'Inter', sans-serif",
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    📞 Phone *
                                </label>
                                <input
                                    type="tel"
                                    placeholder="0712345678"
                                    value={bookingData.buyerPhone}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                                        handleDetailsChange('buyerPhone', val);
                                    }}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: "'Inter', sans-serif",
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    ✉️ Email *
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={bookingData.buyerEmail}
                                    onChange={e => handleDetailsChange('buyerEmail', e.target.value)}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: "'Inter', sans-serif",
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                📍 Street Address *
                            </label>
                            <input
                                type="text"
                                placeholder="123 Main Street"
                                value={bookingData.buyerAddress}
                                onChange={e => handleDetailsChange('buyerAddress', e.target.value)}
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    padding: '12px 14px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-1)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    fontFamily: "'Inter', sans-serif",
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    🏙️ City *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Malabe"
                                    value={bookingData.buyerCity}
                                    onChange={e => handleDetailsChange('buyerCity', e.target.value)}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: "'Inter', sans-serif",
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    🔑 Zip *
                                </label>
                                <input
                                    type="text"
                                    placeholder="10115"
                                    value={bookingData.buyerPostalCode}
                                    onChange={e => handleDetailsChange('buyerPostalCode', e.target.value)}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: "'Inter', sans-serif",
                                        outline: 'none',
                                        transition: 'all 0.3s',
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleNextToPayment}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(108, 99, 255, 0.3)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                        >
                            Continue to Payment →
                        </button>
                    </div>
                )}

                {/* Step 2: Card Payment */}
                {step === 'payment' && (
                    <div style={{ background: 'var(--search-panel-bg)', border: '1px solid var(--border-1)', borderRadius: '16px', padding: '32px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                👤 Card Holder Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Name on card"
                                value={bookingData.cardHolderName}
                                onChange={e => handleDetailsChange('cardHolderName', e.target.value)}
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    padding: '12px 14px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-1)',
                                    background: 'var(--input-bg)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    fontFamily: "'Inter', sans-serif",
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                💳 Card Number *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={bookingData.cardNumber}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                        handleDetailsChange('cardNumber', val);
                                    }}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: "'Courier New', monospace",
                                        outline: 'none',
                                        letterSpacing: '2px',
                                        paddingRight: '40px',
                                        transition: 'all 0.3s',
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                                />
                                {bookingData.cardNumber.length >= 13 && (
                                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem' }}>
                                        💳
                                    </span>
                                )}
                            </div>
                            {bookingData.cardNumber.length > 0 && bookingData.cardNumber.length < 13 && (
                                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    ⚠️ Card number must be at least 13 digits
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    📅 Expiry * (MM/YY)
                                </label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={bookingData.cardExpiry}
                                    onChange={e => {
                                        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        if (val.length >= 2) {
                                            val = val.slice(0, 2) + '/' + val.slice(2);
                                        }
                                        handleDetailsChange('cardExpiry', val);
                                    }}
                                    maxLength={5}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: "'Courier New', monospace",
                                        outline: 'none',
                                        letterSpacing: '2px',
                                        transition: 'all 0.3s',
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    🔒 CVV * (3-4)
                                </label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    value={bookingData.cardCVV}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        handleDetailsChange('cardCVV', val);
                                    }}
                                    maxLength={4}
                                    style={{
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-1)',
                                        background: 'var(--input-bg)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: "'Courier New', monospace",
                                        outline: 'none',
                                        letterSpacing: '2px',
                                        transition: 'all 0.3s',
                                    }}
                                    onFocus={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.background = 'rgba(108, 99, 255, 0.05)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.background = 'var(--input-bg)'; }}
                                />
                            </div>
                        </div>

                        {/* Card Details Preview */}
                        <div style={{ background: 'linear-gradient(135deg, #6C63FF, #5A52D5)', borderRadius: '12px', padding: '24px', marginBottom: '32px', color: 'white', boxShadow: '0 12px 24px rgba(108, 99, 255, 0.3)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                                Your Card
                            </div>
                            <div style={{ fontFamily: "'Courier New', monospace", fontSize: '1.4rem', letterSpacing: '3px', marginBottom: '20px', fontWeight: 600, minHeight: '32px' }}>
                                {bookingData.cardNumber ? bookingData.cardNumber.padEnd(16, '•').replace(/(.{4})/g, '$1 ') : '•••• •••• •••• ••••'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{bookingData.cardHolderName || 'Card Holder'}</span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: "'Courier New', monospace", letterSpacing: '1px' }}>{bookingData.cardExpiry || '--/--'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setStep('details')}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '10px',
                                    background: 'var(--surface-2)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-1)',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    opacity: loading ? 0.5 : 1,
                                }}
                                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleCompleteBooking}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '10px',
                                    background: loading ? 'var(--surface-3)' : 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    opacity: loading ? 0.7 : 1,
                                }}
                                onMouseEnter={e => {
                                    if (!loading) {
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(108, 99, 255, 0.3)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                }}
                            >
                                {loading ? '⏳ Processing...' : '✓ Complete Booking'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                    <div style={{ background: 'var(--search-panel-bg)', border: '1px solid var(--border-1)', borderRadius: '16px', padding: '48px 32px', textAlign: 'center' }}>
                        <div style={{ animation: 'pulse 2s infinite' }}>
                            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>✅</div>
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', margin: '0 0 12px' }}>
                            Booking Confirmed!
                        </h2>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6, margin: '0 0 28px' }}>
                            Your booking has been successfully completed. The listing has been marked as booked and will no longer be visible to other users.
                        </p>
                        
                        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-1)', borderRadius: '12px', padding: '20px', marginBottom: '28px', textAlign: 'left' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                                📋 Booking Details
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{bookingData.buyerName}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{bookingData.buyerEmail}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{bookingData.buyerPhone}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Payment Card:</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: "'Courier New', monospace" }}>••••{bookingData.cardNumber.slice(-4)}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '14px 40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(108, 99, 255, 0.3)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                        >
                            🏠 Return to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPaymentPage;
