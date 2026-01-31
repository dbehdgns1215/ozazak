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
            setError('Passwords do not match');
            return;
        }

        if (!resetToken) {
            setError('Invalid or missing reset token.');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(urlEmail, resetToken, newPassword);
            setSuccess(true);
            setTimeout(() => navigate('/signin'), 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset Successful</h2>
                    <p className="text-slate-500 mb-6">Your password has been securely updated. redirecting to sign in...</p>
                    <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-slate-500 mt-2">Enter your new password for<br /><span className="font-semibold text-slate-700">{urlEmail}</span></p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hidden fields for accessibility/managers if needed, but logic uses state */}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
                                    placeholder="New secure password"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-10 pr-10 py-3 bg-white border rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-900 ${isMatch
                                            ? 'border-green-500 focus:ring-green-500'
                                            : isMismatch
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-slate-200 focus:ring-blue-500'
                                        }`}
                                    placeholder="Confirm new password"
                                    required
                                />
                                {isMatch && (
                                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                                )}
                                {isMismatch && (
                                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                                )}
                            </div>
                            {isMismatch && (
                                <p className="text-red-500 text-xs mt-1 ml-1">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isMismatch || !isMatch}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            'Set New Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
