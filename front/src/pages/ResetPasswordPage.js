import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const urlEmail = queryParams.get('email') || '';
    const resetToken = queryParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;
    const isMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isMismatch) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!resetToken) {
            setError('유효하지 않거나 누락된 리셋 토큰입니다.');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(urlEmail, resetToken, newPassword);
            setSuccess(true);
            setTimeout(() => navigate('/signin'), 3000);
        } catch (err) {
            setError(err.message || '비밀번호 재설정 실패');
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10 text-center relative z-10">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">비밀번호 변경 완료</h2>
                    <p className="text-slate-400 mb-6">비밀번호가 안전하게 변경되었습니다.<br />잠시 후 로그인 페이지로 이동합니다.</p>
                    <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                        로그인 페이지로 바로가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">비밀번호 재설정</h2>
                    <p className="text-slate-400 mt-2">새로운 비밀번호를 입력해주세요<br /><span className="font-semibold text-slate-300">{urlEmail}</span></p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">새 비밀번호</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-slate-800 outline-none transition-all placeholder:text-slate-600 text-white"
                                    style={{ color: 'white', backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                                    placeholder="새 비밀번호 (8자 이상)"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">비밀번호 확인</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border rounded-xl outline-none transition-all placeholder:text-slate-600 text-white ${isMatch
                                        ? 'border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                                        : isMismatch
                                            ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50'
                                        }`}
                                    style={{ color: 'white', backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                                    placeholder="비밀번호 재입력"
                                    required
                                />
                                {isMatch && (
                                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                                )}
                                {isMismatch && (
                                    <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                                )}
                            </div>
                            {isMismatch && (
                                <p className="text-red-400 text-xs mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isMismatch || !isMatch}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                변경 중...
                            </>
                        ) : (
                            '비밀번호 변경하기'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
