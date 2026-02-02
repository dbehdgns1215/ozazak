import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AiGeneratorPage from './pages/AiGeneratorPage'; // Refactored to TSX
import JobCalendarPage from './pages/JobCalendarPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// New Pages
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import CommunityMainPage from './pages/CommunityMainPage';
import CommunityListPage from './pages/CommunityListPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import CommunityWritePage from './pages/CommunityWritePage';
import CoverLetterListPage from './pages/CoverLetterListPage';

import RecruitmentPage from './pages/RecruitmentPage';
import RecruitmentDetailPage from './pages/RecruitmentDetailPage';

// TIL & Project Pages
import TILPage from './pages/TILPage';
import TILDetailPage from './pages/TILDetailPage';
import ProjectPage from './pages/ProjectPage';
import ProjectWritePage from './pages/ProjectWritePage';
import ProjectDetailPage from './pages/ProjectDetailPage';

import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Hide header for auth pages and write page
  const isAuthPage = ['/signin', '/signup', '/community/write'].includes(location.pathname);

  return (
    <div className="min-h-screen font-sans">
      {(!isHomePage && !isAuthPage) && <Header />}
      <main className={(!isHomePage && !isAuthPage) ? "max-w-7xl mx-auto px-6 pt-24 pb-12" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/generate" element={<AiGeneratorPage />} />
          <Route path="/jobs" element={<JobCalendarPage />} />

          {/* User & My Page */}
          <Route path="/mypage" element={<MyPage />} />

          {/* Community & TIL */}
          <Route path="/community" element={<CommunityMainPage />} />
          <Route path="/community/write" element={<CommunityWritePage />} />
          <Route path="/community/:boardId" element={<CommunityListPage />} />
          <Route path="/community/post/:postId" element={<CommunityDetailPage />} />

          <Route path="/til" element={<TILPage />} />
          <Route path="/til/:tilId" element={<TILDetailPage />} />

          {/* Projects & Recruitments */}
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/projects/write" element={<ProjectWritePage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/recruitments" element={<RecruitmentPage />} />
          <Route path="/recruitments/:id" element={<RecruitmentDetailPage />} />

          <Route path="/cover-letter" element={<CoverLetterListPage />} />

          {/* Auth Reset */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/password-reset" element={<ResetPasswordPage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
