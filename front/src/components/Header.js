import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

const navItems = [
  { name: "홈", path: "/" },
  { name: "AI 자소서", path: "/cover-letter" },
  { name: "채용 공고", path: "/recruitments" },
  { name: "커뮤니티", path: "/community" },
  { name: "TIL", path: "/til" },
  { name: "프로젝트", path: "/projects" },
];

import { getUserProfile } from '../api/user'; // Import API
import CustomAlert from './CustomAlert';

// ... (keep usage of other imports)

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Profile Image State (Fetch from API to ensure validity)
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.accountId) {
        // Option 1: Use context image initially
        if (user.img) setProfileImg(user.img);

        // Option 2: Always fetch fresh profile
        getUserProfile(user.accountId)
            .then(data => {
                if (data?.img) {
                    setProfileImg(data.img);
                }
            })
            .catch(err => {
                console.error("Failed to fetch user profile for header:", err);
            });
    } else {
        setProfileImg(null);
    }
  }, [isAuthenticated, user?.accountId, user?.img]);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  // Handle Scroll Effect with Throttle using requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 20);
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAlertClose = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const isHomePage = location.pathname === '/';
  
  // Dynamic Styles
  const headerClass = isHomePage 
    ? (isScrolled ? 'bg-white/90 backdrop-blur-md text-slate-900 shadow-sm' : 'bg-transparent text-white')
    : 'bg-white text-slate-900 border-b border-slate-200 shadow-sm';

  const logoClass = (isHomePage && !isScrolled) ? 'text-white' : 'text-slate-900';
  const navTextClass = (isHomePage && !isScrolled) ? 'text-white hover:text-[#7184e6]' : 'text-slate-600 hover:text-[#7184e6]';
  const activeNavClass = 'text-[#7184e6] font-bold';


  return (
    <>
      <header className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 py-4 transition-all duration-300 ${headerClass}`}>
        <div className="flex items-center">
          {/* Mobile Menu Button - Visible on mobile only */}
          <button 
            className={`md:hidden mr-4 ${logoClass}`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className={`text-2xl font-bold mr-10 transition-colors ${logoClass}`}>
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
                    className={`text-base font-medium transition-colors relative group ${
                        (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))
                         ? activeNavClass 
                         : navTextClass
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className={`absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#7184e6] transform transition-transform duration-300 ease-out origin-center ${
                      (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
                <>
                <Link to="/mypage" className={`text-sm font-medium flex items-center gap-2 hover:text-[#7184e6] transition-colors ${isHomePage && !isScrolled ? 'text-white' : 'text-slate-700'}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <img
                        src={(profileImg && profileImg.trim()) || '/default-profile.jpg'}
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
                    navigate('/'); // Use navigate instead of full reload
                    }}
                    className={`text-sm font-medium hover:text-red-600 transition-colors ${isHomePage && !isScrolled ? 'text-white' : 'text-slate-500'}`}
                >
                    <LogOut className="w-5 h-5" />
                </button>
                </>
            ) : (
                <>
                <button
                    onClick={() => openAuthModal('signin')}
                    className={`text-sm font-semibold hover:text-[#7184e6] transition-colors ${isHomePage && !isScrolled ? 'text-white' : 'text-slate-600'}`}
                >
                    로그인
                </button>
                <button
                    onClick={() => openAuthModal('signup')}
                    className="text-sm font-semibold text-white bg-[#7184e6] hover:bg-[#5f73d8] px-5 py-2 rounded-full transition-all shadow-md shadow-blue-200"
                >
                    회원가입
                </button>
                </>
            )}
          </div>
          
          {/* Mobile Profile Icon (if logged in) */}
          {isAuthenticated && (
             <Link to="/mypage" className="md:hidden w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <img
                    src={(profileImg && profileImg.trim()) || '/default-profile.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/default-profile.jpg'; }}
                />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <div className="absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-bold text-slate-900">오자작</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Auth Info (Mobile) */}
                {isAuthenticated ? (
                    <div className="flex items-center gap-3 mb-8 p-3 bg-slate-50 rounded-xl">
                         <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-slate-200 shrink-0">
                            <img
                                src={(profileImg && profileImg.trim()) || '/default-profile.jpg'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/default-profile.jpg'; }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                setIsMobileMenuOpen(false); // Close menu
                                navigate('/'); // Use navigate instead of full reload
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => { setIsMobileMenuOpen(false); openAuthModal('signin'); }}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-sm"
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => { setIsMobileMenuOpen(false); openAuthModal('signup'); }}
                            className="flex-1 py-2.5 rounded-xl bg-[#7184e6] text-white font-bold text-sm hover:bg-[#5f73d8] shadow-md shadow-blue-200"
                        >
                            회원가입
                        </button>
                    </div>
                )}

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    onClick={(e) => {
                                        setIsMobileMenuOpen(false);
                                        if (item.name === "AI 자소서" && !isAuthenticated) {
                                            e.preventDefault();
                                            // Show alert immediately, without delay
                                            // The modal has a higher z-index (9999) so it will appear above the closing menu
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
                                    className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                                        (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)) 
                                        ? 'bg-[#7184e6]/10 text-[#7184e6] font-bold' 
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
      )}

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
