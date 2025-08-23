import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import HeroSection from '../components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
    </>
  );
};

export default HomePage;