import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean; // If true, confirm button is red
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "확인", 
    cancelText = "취소",
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200 border border-white/10">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        {message}
                    </p>
                    
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2.5 font-bold rounded-xl text-white shadow-lg transition-all active:scale-95 ${
                                isDestructive 
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
