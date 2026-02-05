import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const CustomAlert = ({ isOpen, onClose, title, message, type = 'info', onConfirm, confirmText = '확인', cancelText }) => {

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const icons = {
        info: <Info className="w-6 h-6 text-blue-400" />,
        warning: <AlertCircle className="w-6 h-6 text-orange-400" />,
        success: <CheckCircle2 className="w-6 h-6 text-green-400" />,
        error: <AlertCircle className="w-6 h-6 text-red-400" />
    };

    const gradientColors = {
        info: 'from-blue-500/20 to-indigo-500/20',
        warning: 'from-orange-500/20 to-red-500/20',
        success: 'from-green-500/20 to-emerald-500/20',
        error: 'from-red-500/20 to-pink-500/20'
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Decorative Background */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradientColors[type].replace('/20', '')}`} />
                <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradientColors[type]} blur-2xl opacity-60 pointer-events-none`} />

                <div className="p-6 relative z-10">
                    <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm shrink-0`}>
                            {icons[type]}
                        </div>
                        <div className="flex-1 pt-1">
                            {title && <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>}
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{message}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        {cancelText && (
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                else onClose();
                            }}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all transform active:scale-95 ${type === 'info' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20' :
                                type === 'warning' ? 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/20' :
                                    type === 'error' ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20' :
                                        'bg-green-600 hover:bg-green-500 shadow-green-500/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-50 p-1 hover:bg-slate-50 rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CustomAlert;
