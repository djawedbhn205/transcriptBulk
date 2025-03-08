
import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/hero/Hero';
import WelcomeMessage from '../components/welcome/WelcomeMessage';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <WelcomeMessage />
    </Layout>
  );
};

export default Index;
