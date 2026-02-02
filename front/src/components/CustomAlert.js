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
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Decorative Background */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientColors[type].replace('/20', '')}`} />
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${gradientColors[type]} blur-2xl pointer-events-none`} />

                <div className="p-6 relative z-10">
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-white/5 border border-white/5 shadow-inner shrink-0`}>
                            {icons[type]}
                        </div>
                        <div className="flex-1">
                            {title && <h3 className="text-lg font-bold text-white mb-1">{title}</h3>}
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{message}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        {cancelText && (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                else onClose();
                            }}
                            className={`px-5 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all transform active:scale-95 ${type === 'info' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' :
                                    type === 'warning' ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20' :
                                        type === 'error' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' :
                                            'bg-green-600 hover:bg-green-500 shadow-green-900/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CustomAlert;
