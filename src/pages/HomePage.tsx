import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import HeroSection from '../components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <Features />
    </>
  );
};

export default HomePage;