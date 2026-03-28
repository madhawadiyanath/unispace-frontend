import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const FavouritesPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#fff' }}>
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
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '520px',
          }}
        >
          This is where your saved boardings and services will appear.
          You can come back here anytime to quickly revisit places you like.
        </p>

        {/* TODO: Replace this placeholder with real favourite listings when backend is ready. */}
        <div
          style={{
            marginTop: '32px',
            padding: '24px',
            borderRadius: '16px',
            border: '1px dashed rgba(108,99,255,0.5)',
            background:
              'radial-gradient(circle at top left, rgba(108,99,255,0.25), transparent 55%), rgba(13,13,26,0.9)',
          }}
        >
          <p style={{ marginBottom: '4px', fontWeight: 600 }}>
            No favourites yet
          </p>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
            Start exploring boardings on the home page and mark them as
            favourites to see them listed here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavouritesPage;
