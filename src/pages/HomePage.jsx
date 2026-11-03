import HeroSection from '../components/HeroSection';
import Marquee from '../components/Marquee';
import AboutSection from '../components/AboutSection';
import FAQ from '../components/FAQ';

const HomePage = () => {
  return (
    <div>
      <div className="bg-glow bg-glow-purple" />
      <div className="bg-glow bg-glow-green" />
      <div className="bg-glow bg-glow-purple-2" />

      <HeroSection />
      <Marquee />
      <AboutSection />
      <FAQ />
    </div>
  );
};

export default HomePage;