import Navbar from '../Components/Navbar';
import FeaturedListings from '../Components/FeaturedListings';
import Footer from '../Components/Footer';

const AllBoardingsPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--app-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        <FeaturedListings showHeader={false} />
      </main>
      <Footer />
    </div>
  );
};

export default AllBoardingsPage;
