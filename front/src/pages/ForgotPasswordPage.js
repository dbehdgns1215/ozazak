import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle, X } from 'lucide-react';

const ForgotPasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { requestPasswordReset } = useAuth();

    // Initialize email from passed state if available
    const [email, setEmail] = useState(location.state?.email || '');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            await requestPasswordReset(email);
            setSuccessMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
        } catch (err) {
            setError(err.message || '비밀번호 재설정 요청 실패');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10 relative z-10">


                <button
                    onClick={() => navigate('/signin')}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Pretendard' }}>비밀번호 찾기</h1>
                        <p className="text-slate-400 text-sm">이메일을 입력하시면 재설정 링크를 보내드립니다.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-2 text-sm">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <p>{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">이메일</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 font-medium"
                                    style={{ color: 'black', backgroundColor: 'white' }}
                                    placeholder="이메일을 입력하세요"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    전송 중...
                                </>
                            ) : (
                                '재설정 링크 보내기'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4">
                                로그인으로 돌아가기
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
