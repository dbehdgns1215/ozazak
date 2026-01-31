import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignUpFormProps {
    onSuccess?: () => void;
    onSwitchMode?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onSwitchMode }) => {
    const { register, sendVerificationCode, confirmVerificationCode } = useAuth() as any;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        verificationCode: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Email Verification State
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationToken, setVerificationToken] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [verificationMsg, setVerificationMsg] = useState('');

    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendVerification = async () => {
        if (!formData.email) {
            setError('이메일을 입력해주세요.');
            return;
        }
        if (!EMAIL_REGEX.test(formData.email)) {
            setError('올바른 이메일 형식이 아닙니다 (예: user@example.com).');
            return;
        }
        setIsSendingEmail(true);
        setError('');
        setVerificationMsg('');
        try {
            await sendVerificationCode(formData.email);
            setIsEmailSent(true);
            setIsEmailVerified(false);
            setVerificationToken('');
            setFormData(prev => ({ ...prev, verificationCode: '' }));
            alert('인증 코드가 전송되었습니다. 이메일을 확인해주세요.');
        } catch (err: any) {
            setError(err.message || '인증 코드 전송 실패');
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleConfirmVerification = async () => {
        if (!formData.verificationCode) {
            setVerificationMsg('인증 코드를 입력해주세요.');
            return;
        }
        setIsVerifyingCode(true);
        setVerificationMsg('');

        try {
            const response = await confirmVerificationCode(formData.email, formData.verificationCode);
            if (response && response.verificationToken) {
                setVerificationToken(response.verificationToken);
                setIsEmailVerified(true);
                setVerificationMsg('인증번호가 일치합니다.');
            } else {
                throw new Error("인증 실패");
            }
        } catch (err: any) {
            setVerificationMsg('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
            setIsEmailVerified(false);
        } finally {
            setIsVerifyingCode(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            setIsLoading(false);
            return;
        }

        if (!isEmailVerified || !verificationToken) {
            setError('이메일 인증을 완료해주세요.');
            setIsLoading(false);
            return;
        }

        try {
            await register(formData.email, formData.nickname, formData.password, verificationToken);

            if (onSwitchMode) {
                alert("회원가입 성공! 로그인해주세요.");
                onSwitchMode();
            } else if (onSuccess) {
                onSuccess();
            }

        } catch (err: any) {
            setError(err.message || '회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // Password Match Visual Logic
    const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    const isPasswordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">계정 만들기</h2>
                <p className="text-slate-400">오자작과 함께 합격의 문을 열어보세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">닉네임</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="닉네임 입력"
                            className="w-full border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                            style={{ color: 'black', backgroundColor: 'white' }}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">이메일</label>
                    <div className="flex gap-2">
                        <div className="relative group flex-1">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="이메일 입력"
                                className="w-full border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 disabled:opacity-50"
                                style={{ color: 'black', backgroundColor: 'white' }}
                                required
                                disabled={isEmailVerified}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSendVerification}
                            disabled={isEmailVerified || isSendingEmail || !formData.email}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-medium rounded-xl transition-colors whitespace-nowrap min-w-[80px] flex items-center justify-center"
                        >
                            {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEmailVerified ? "인증완료" : "인증요청")}
                        </button>
                    </div>
                </div>

                {isEmailSent && (
                    <div className="space-y-2 animate-fade-in-down">
                        <label className="text-sm font-medium text-slate-300 ml-1">인증 코드</label>
                        <div className="flex gap-2">
                            <div className="relative group flex-1">
                                <input
                                    type="text"
                                    name="verificationCode"
                                    value={formData.verificationCode}
                                    onChange={handleChange}
                                    placeholder="인증 코드 입력"
                                    disabled={isEmailVerified}
                                    className="w-full border border-slate-700/50 rounded-xl py-3.5 px-4 outline-none focus:border-blue-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
                                    style={{ color: isEmailVerified ? 'gray' : 'black', backgroundColor: isEmailVerified ? '#1e293b' : 'white' }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleConfirmVerification}
                                disabled={isEmailVerified || isVerifyingCode || !formData.verificationCode}
                                className={`px-4 py-2 text-white font-medium rounded-xl transition-colors whitespace-nowrap min-w-[80px] flex items-center justify-center
                                    ${isEmailVerified ? 'bg-green-600 disabled:opacity-100' : 'bg-green-600 hover:bg-green-500 disabled:bg-slate-600'}`}
                            >
                                {isVerifyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEmailVerified ? <CheckCircle2 className="w-5 h-5" /> : "확인")}
                            </button>
                        </div>
                        {verificationMsg && (
                            <p className={`text-sm ml-1 ${isEmailVerified ? 'text-green-500' : 'text-red-500'}`}>
                                {verificationMsg}
                            </p>
                        )}
                    </div>
                )}


                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">비밀번호</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호 (8자 이상)"
                            className="w-full bg-slate-800/50 text-white border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
                            style={{ color: 'black', backgroundColor: 'white' }}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">비밀번호 확인</label>
                    <div className="relative group">
                        {isPasswordMatch ? (
                            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 transition-colors" />
                        ) : isPasswordMismatch ? (
                            <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5 transition-colors" />
                        ) : (
                            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                        )}

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="비밀번호 재입력"
                            className={`w-full bg-slate-800/50 text-white border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:bg-slate-800 focus:ring-1 transition-all placeholder:text-slate-600
                                ${isPasswordMatch ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500' :
                                    isPasswordMismatch ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' :
                                        'border-slate-700/50 focus:border-purple-500/50 focus:ring-purple-500/50'}`}
                            style={{ color: 'black', backgroundColor: 'white' }}
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
                    className="w-full mt-4 bg-slate-100 hover:bg-white text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            가입하기 <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                이미 계정이 있으신가요?{' '}
                {onSwitchMode ? (
                    <button onClick={onSwitchMode} className="text-slate-300 hover:text-white font-semibold transition-colors hover:underline underline-offset-4">
                        로그인하기
                    </button>
                ) : (
                    <Link to="/signin" className="text-slate-300 hover:text-white font-semibold transition-colors hover:underline underline-offset-4">
                        로그인하기
                    </Link>
                )}
            </div>
        </div>
    );
};

export default SignUpForm;
