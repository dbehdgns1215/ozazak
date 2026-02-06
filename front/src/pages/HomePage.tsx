import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import DeadlineJobs from '../components/DeadlineJobs';
import StackedCards from '../components/StackedCards';
import Toast from '../components/ui/Toast';
import CustomAlert from '../components/CustomAlert';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // AuthModal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    onConfirm: null as (() => void) | null
  });

  const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

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

  // AI 자소서 생성 클릭 핸들러
  const handleAiGenerateClick = () => {
    if (!isAuthenticated) {
      setAlertState({
        isOpen: true,
        title: '로그인 필요',
        message: '로그인 후 이용 가능합니다.',
        type: 'warning',
        onConfirm: () => {
          closeAlert();
          setIsAuthModalOpen(true);
        }
      });
      return;
    }

    setAlertState({
      isOpen: true,
      title: '알림',
      message: '먼저 공고를 선택해주세요.',
      type: 'warning',
      onConfirm: () => {
        closeAlert();
        navigate('/recruitments');
      }
    });
  };

  // TIL 클릭 핸들러
  const handleTilClick = () => {
    if (!isAuthenticated) {
      setAlertState({
        isOpen: true,
        title: '로그인 필요',
        message: '로그인 후 이용 가능합니다.',
        type: 'warning',
        onConfirm: () => {
          closeAlert();
          setIsAuthModalOpen(true);
        }
      });
      return;
    }

    navigate('/til');
  };

  return (
    <main className="min-h-screen text-white">
      <Header />
      <Hero onAiGenerateClick={handleAiGenerateClick} onTilClick={handleTilClick} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <DeadlineJobs />
        <div className="mt-0">
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

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
        cancelText="취소"
        confirmText="로그인"
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
    </main>
  );
}

export default HomePage;



