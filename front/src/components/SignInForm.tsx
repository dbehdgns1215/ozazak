import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignInFormProps {
    onSuccess?: () => void;
    onSwitchMode?: () => void;
    isModal?: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess, onSwitchMode, isModal = false }) => {
    const { login } = useAuth() as any;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || '로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-4">
                <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                    <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Pretendard' }}>OJAJAK</h1>
                </Link>
                <p className="text-xs text-slate-400">AI로 완성하는 합격 자소서</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300 ml-1">이메일</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            className="w-full border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 text-sm"
                            style={{ color: 'black', backgroundColor: 'white' }}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300 ml-1">비밀번호</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호 입력"
                            className="w-full border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 outline-none focus:border-purple-500 focus:bg-slate-800 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-400 text-sm"
                            style={{ color: 'black', backgroundColor: 'white' }}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 py-1.5 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            <div className="mt-4 text-center space-y-2">
                <p className="text-slate-500 text-sm">
                    아직 계정이 없으신가요?{' '}
                    {onSwitchMode ? (
                        <button onClick={onSwitchMode} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4">
                            회원가입하기
                        </button>
                    ) : (
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4">
                            회원가입하기
                        </Link>
                    )}
                </p>
                <p className="text-slate-500">
                    <Link
                        to="/forgot-password"
                        state={{ email }}
                        onClick={isModal && onSuccess ? onSuccess : undefined}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        비밀번호를 잊으셨나요?
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignInForm;
