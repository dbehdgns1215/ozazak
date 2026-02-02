import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
    const [mode, setMode] = useState(initialMode);
    const location = useLocation(); // Import useLocation inside component if not passed
    const navigate = useNavigate(); // Import useNavigate

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode, isOpen]);

    const handleSuccess = () => {
        onClose();
        // If on auth-specific pages, redirect to home
        if (['/forgot-password', '/signup', '/signin', '/password-reset'].includes(location.pathname)) {
            navigate('/');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl border border-white/10 p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                {/* Background Accents (Mini version) */}
                <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative z-10">
                    {mode === 'signin' ? (
                        <SignInForm
                            onSuccess={handleSuccess}
                            onSwitchMode={() => setMode('signup')}
                            isModal={true}
                        />
                    ) : (
                        <SignUpForm
                            onSuccess={() => setMode('signin')}
                            onSwitchMode={() => setMode('signin')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
