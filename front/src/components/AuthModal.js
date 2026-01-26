import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
    const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailCheckStatus, setEmailCheckStatus] = useState('idle');

    const { login, register, checkEmail } = useAuth();

    useEffect(() => {
        setMode(initialMode);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    }, [initialMode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'email') setEmailCheckStatus('idle');
    };

    const handleBlurEmail = async () => {
        if (mode === 'signup' && formData.email && /\S+@\S+\.\S+/.test(formData.email)) {
            setEmailCheckStatus('checking');
            try {
                await checkEmail(formData.email);
                setEmailCheckStatus('available');
            } catch (err) {
                setEmailCheckStatus('taken');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'signin') {
                await login(formData.email, formData.password);
                onClose();
            } else {
                if (emailCheckStatus === 'taken') throw new Error("Email is already taken");
                await register(formData.email, formData.name, formData.password);
                // Auto switch to signin or login? Let's just login or switch mode.
                // Spec says usually login after signup is nice, but let's stick to easy flow.
                // If API returns success, maybe we should auto-login?
                // For now, let's switch to login mode with a success message or just close if context handles login.
                // The current register context function returns data.
                // Let's assume we need to login after register or just close if mock handled it.
                // The prompt for mock 'register' returns success.
                // Let's switch to signin for UX or better yet, auto login if possible.
                // For simplicity:
                setMode('signin');
                setError('Registration successful! Please log in.');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black font-inter tracking-tight text-slate-900">
                        {mode === 'signin' ? 'Welcome Back' : 'Join Scripter'}
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">
                        {mode === 'signin' ? 'Sign in to access your workspace' : 'Create an account to get started'}
                    </p>
                </div>

                {error && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${error.includes('successful') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7184e6] focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlurEmail}
                                className={`w-full pl-11 pr-10 py-3 bg-white border rounded-xl outline-none transition-all placeholder:text-slate-400 font-medium
                                    ${emailCheckStatus === 'taken' ? 'border-red-300 focus:ring-red-200' :
                                        emailCheckStatus === 'available' ? 'border-green-300 focus:ring-green-200' :
                                            'border-slate-200 focus:ring-[#7184e6] focus:ring-2 focus:border-transparent'}`}
                                placeholder="you@example.com"
                                required
                            />
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                {emailCheckStatus === 'checking' && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
                                {emailCheckStatus === 'available' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {emailCheckStatus === 'taken' && <AlertCircle className="w-5 h-5 text-red-500" />}
                            </div>
                        </div>
                        {emailCheckStatus === 'taken' && <p className="text-xs text-red-500 mt-1 font-medium ml-1">Email already in use</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7184e6] focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (mode === 'signup' && emailCheckStatus === 'taken')}
                        className="w-full bg-[#7184e6] hover:bg-[#5f73d8] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {mode === 'signin' ? 'Signing in...' : 'Creating Account...'}
                            </>
                        ) : (
                            mode === 'signin' ? 'Sign In' : 'Sign Up'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-500">
                    {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-[#7184e6] hover:text-[#5f73d8] font-bold hover:underline transition-all ml-1"
                    >
                        {mode === 'signin' ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
