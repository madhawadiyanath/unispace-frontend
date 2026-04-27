import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, GraduationCap, Trash2, ArrowRight } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const API_BASE = 'http://localhost:5000';
const FAVOURITES_KEY = 'favouriteBoardings';

interface FavouriteItem {
  _id: string | number;
  title: string;
  price: number;
  location: string;
  nearUniversity?: string;
  roomType?: string;
  photos?: string[];
  status?: string;
}

const FavouritesPage = () => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVOURITES_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setFavourites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavourites([]);
    }
  }, []);

  const removeFavourite = (id: string | number) => {
    const updated = favourites.filter((item) => item._id !== id);
    setFavourites(updated);
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '96px 24px 40px',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          Your Favourites
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
          }}
        >
          This is where your saved boardings and services will appear.
          You can come back here anytime to quickly revisit places you like.
        </p>

        {favourites.length === 0 ? (
          <div
            style={{
              marginTop: '32px',
              padding: '24px',
              borderRadius: '16px',
              border: '1px dashed var(--nav-border)',
              background: 'var(--search-panel-bg)',
            }}
          >
            <p style={{ marginBottom: '4px', fontWeight: 600 }}>
              No favourites yet
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Start exploring boardings on the home page and mark them as
              favourites to see them listed here.
            </p>
          </div>
        ) : (
          <div
            style={{
              marginTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '18px',
            }}
          >
            {favourites.map((item) => {
              const imagePath = item.photos?.[0] || '';
              const imageSrc = imagePath
                ? (imagePath.startsWith('http') ? imagePath : `${API_BASE}${imagePath}`)
                : '';
              const canOpenDetails = typeof item._id === 'string';

              return (
                <div
                  key={String(item._id)}
                  style={{
                    border: '1px solid var(--border-1)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'var(--search-panel-bg)',
                    boxShadow: 'var(--search-panel-shadow)',
                  }}
                >
                  <div style={{ position: 'relative', height: '150px', background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 25%, transparent), color-mix(in srgb, var(--accent2) 20%, transparent))' }}>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : null}
                    <button
                      onClick={() => removeFavourite(item._id)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-1)',
                        background: 'var(--secondary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      aria-label="Remove from favourites"
                    >
                      <Heart size={15} fill="#fff" />
                    </button>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      {item.roomType || 'Boarding'}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{item.title}</h3>
                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span>{item.location}</span>
                    </div>
                    {item.nearUniversity ? (
                      <div style={{ marginTop: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={14} color="var(--accent2)" />
                        <span>Near {item.nearUniversity}</span>
                      </div>
                    ) : null}

                    <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                          LKR {Number(item.price || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>per month</div>
                      </div>

                      {canOpenDetails ? (
                        <button
                          onClick={() => navigate(`/boarding/${item._id}`)}
                          style={{
                            border: 'none',
                            borderRadius: '10px',
                            background: 'var(--btn-primary-bg)',
                            color: '#fff',
                            padding: '9px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          View <ArrowRight size={14} />
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                          <Trash2 size={13} /> Saved item
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FavouritesPage;
