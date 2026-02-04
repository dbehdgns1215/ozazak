import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import AuthModal from './AuthModal';

const navItems = [
  { name: "홈", path: "/" },
  { name: "AI 자소서", path: "/cover-letter" },
  { name: "채용 공고", path: "/recruitments" },
  { name: "커뮤니티", path: "/community" },
  { name: "TIL", path: "/til" },
  { name: "프로젝트", path: "/projects" },
];

import CustomAlert from './CustomAlert';

// ... (keep usage of other imports)

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAlertClose = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-sm border-y border-white/10 text-white">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white mr-10">
            오자작
          </Link>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={(e) => {
                      if (item.name === "AI 자소서" && !isAuthenticated) {
                        e.preventDefault();
                        setAlertConfig({
                          isOpen: true,
                          title: '로그인 필요',
                          message: 'AI 자소서 기능을 이용하시려면\n로그인이 필요합니다.',
                          type: 'warning',
                          confirmText: '로그인',
                          cancelText: '취소',
                          onConfirm: () => {
                            handleAlertClose();
                            openAuthModal('signin');
                          }
                        });
                      }
                    }}
                    className={`text-base font-medium transition-colors relative ${location.pathname === item.path
                      ? 'text-[#7184e6] font-bold'
                      : 'text-white hover:text-[#7184e6]'
                      } group`}
                  >
                    <span>{item.name}</span>
                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#7184e6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/mypage" className="text-sm font-medium text-white flex items-center gap-2 hover:text-[#7184e6] transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <img
                    src={(user?.profileImage && user.profileImage.trim()) || '/default-profile.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/default-profile.jpg'; }}
                  />
                </div>
                <span className="hidden sm:inline">{user?.name || 'User'}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="text-sm font-medium text-white hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuthModal('signin')}
                className="text-sm font-semibold text-white hover:text-[#7184e6] transition-colors"
              >
                로그인
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="text-sm font-semibold text-white bg-[#7184e6] hover:bg-[#5f73d8] px-5 py-2 rounded-full transition-all shadow-md shadow-blue-200"
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={handleAlertClose}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
      />
    </>
  );
};

export default Header;
