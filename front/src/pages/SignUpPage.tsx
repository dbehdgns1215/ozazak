import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';

const SignUpPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-y-auto py-20">
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
                <SignUpForm
                    onSuccess={() => navigate('/signin')}
                />
            </div>
        </div>
    );
};

export default SignUpPage;
