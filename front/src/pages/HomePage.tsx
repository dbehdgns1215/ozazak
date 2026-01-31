import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DeadlineJobs from '../components/DeadlineJobs';
import StackedCards from '../components/StackedCards';
import Toast from '../components/ui/Toast';

function HomePage() {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Check for toast message from navigation state
  useEffect(() => {
    const state = location.state as any;
    if (state?.showToast && state?.toastMessage) {
      setToastMessage(state.toastMessage);
      setToastType(state.toastType || 'info');
      setShowToast(true);
      
      // Clear the state to prevent showing toast again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <main className="min-h-screen text-white">
      <Header />
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <DeadlineJobs />
        <div className="mt-12">
          <StackedCards />
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toast 
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </main>
  );
}

export default HomePage;
