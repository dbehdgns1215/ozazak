import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DeadlineJobs from '../components/DeadlineJobs';
import StackedCards from '../components/StackedCards';

function HomePage() {
  return (
    <main className="bg-[#0f172a] min-h-screen text-white">
      <Header />
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <DeadlineJobs />
        <div className="mt-12">
          <StackedCards />
        </div>
      </div>
    </main>
  );
}

export default HomePage;
