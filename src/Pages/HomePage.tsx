import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Features from '../Components/Features';
import FeaturedListings from '../Components/FeaturedListings';
import Testimonials from '../Components/Testimonials';
import Footer from '../Components/Footer';

const HomePage = () => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <Navbar />
            <Hero />
            <Features />
            <FeaturedListings />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default HomePage;
