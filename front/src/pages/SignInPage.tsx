import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignInForm from '../components/SignInForm';

const SignInPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in-up">
                <SignInForm
                    onSuccess={() => navigate('/')}
                />
            </div>
        </div>
    );
};

export default SignInPage;
