import React from 'react';

interface LoadingOverlayProps {
    isOpen: boolean;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isOpen, message = '처리 중입니다...' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Spinner Container */}
            <div className="bg-white/90 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-slate-100/50">
                <div className="relative">
                    {/* Outer Ring */}
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
                    {/* Spinning Ring */}
                    <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                {message && (
                    <p className="text-slate-700 font-medium text-sm animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoadingOverlay;
