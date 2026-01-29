import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { authApi } from '../api/mock/auth';

const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Use Mock API
            const response = await authApi.signin(email, password);
            console.log('Login Success:', response);
            // In a real app, save token to Context/LocalStorage here
            navigate('/');
        } catch (err: any) {
            setError(err.message || '로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Pretendard' }}>OJAJAK</h1>
                    <p className="text-slate-400">AI로 완성하는 합격 자소서</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">이메일</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ssafy@example.com"
                                className="w-full bg-slate-800/50 text-white border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-slate-300">비밀번호</label>
                            <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                비밀번호 찾기
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-800/50 text-white border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                로그인 <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500">
                        아직 계정이 없으신가요?{' '}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
