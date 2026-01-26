import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailCheckStatus, setEmailCheckStatus] = useState('idle'); // idle, checking, available, taken
    const { register, checkEmail } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'email') {
            setEmailCheckStatus('idle'); // Reset check if email changes
        }
    };

    const handleBlurEmail = async () => {
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) return;

        setEmailCheckStatus('checking');
        try {
            await checkEmail(formData.email);
            setEmailCheckStatus('available');
        } catch (err) {
            setEmailCheckStatus('taken');
            // If it's 409, it's taken. Handled by api error catching usually returning useful message or we can check err.message
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (emailCheckStatus === 'taken') {
            setError('Email is already taken');
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.email, formData.name, formData.password);
            // Could show success message then redirect, or auto login
            // Requirements just say response is success. Let's redirect to login.
            navigate('/signin');
        } catch (err) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join us to get started</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlurEmail}
                                className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-lg outline-none transition-all placeholder:text-slate-400 
                    ${emailCheckStatus === 'taken' ? 'border-red-300 focus:ring-red-200' :
                                        emailCheckStatus === 'available' ? 'border-green-300 focus:ring-green-200' :
                                            'border-slate-200 focus:ring-blue-500 focus:ring-2 focus:border-transparent'}`}
                                placeholder="you@example.com"
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {emailCheckStatus === 'checking' && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
                                {emailCheckStatus === 'available' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {emailCheckStatus === 'taken' && <AlertCircle className="w-5 h-5 text-red-500" />}
                            </div>
                        </div>
                        {emailCheckStatus === 'taken' && <p className="text-xs text-red-500 mt-1">This email is already in use</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || emailCheckStatus === 'taken'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
