import React, { useState } from 'react';
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

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-6">
        <div className="flex items-center justify-between rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg px-8 py-3">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black font-inter text-[#7184e6] tracking-tighter mr-10">
              SCRIPTER
            </Link>
            <nav>
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`text-base font-medium transition-colors relative ${location.pathname === item.path
                        ? 'text-[#7184e6] font-bold'
                        : 'text-slate-600 hover:text-slate-900'
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
                <Link to="/mypage" className="text-sm font-medium text-slate-700 flex items-center gap-2 hover:text-[#7184e6] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  {user?.name || 'User'}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-sm font-semibold text-slate-600 hover:text-[#7184e6] transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="text-sm font-semibold text-white bg-[#7184e6] hover:bg-[#5f73d8] px-5 py-2 rounded-full transition-all shadow-md shadow-blue-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;
