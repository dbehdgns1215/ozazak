import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AiGeneratorPage from './pages/AiGeneratorPage';
import JobCalendarPage from './pages/JobCalendarPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// New Pages
import MyPage from './pages/MyPage';
import CommunityMainPage from './pages/CommunityMainPage';
import CommunityListPage from './pages/CommunityListPage';
import CoverLetterPage from './pages/CoverLetterPage';
import RecruitmentPage from './pages/RecruitmentPage';
import TILPage from './pages/TILPage';
import ProjectPage from './pages/ProjectPage';

import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen font-sans text-slate-800">
          <Header />
          <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generate" element={<AiGeneratorPage />} /> 
              <Route path="/jobs" element={<JobCalendarPage />} />     

              {/* New Routes */}
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/community" element={<CommunityMainPage />} />
              <Route path="/community/:boardId" element={<CommunityListPage />} />
              <Route path="/til" element={<TILPage />} />
              <Route path="/projects" element={<ProjectPage />} />
              <Route path="/cover-letter" element={<CoverLetterPage />} />
              <Route path="/recruitments" element={<RecruitmentPage />} />

              {/* Keep password reset pages as standalone for now or integrate later */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
