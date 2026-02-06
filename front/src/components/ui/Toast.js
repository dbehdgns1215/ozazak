import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 1000 }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsExiting(false);
            const timer = setTimeout(() => {
                setIsExiting(true);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration]);

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                onClose();
            }, 300); // Wait for animation to finish
            return () => clearTimeout(timer);
        }
    }, [isExiting, onClose]);

    if (!isVisible && !isExiting) return null;

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-500" />
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <AlertCircle className="w-5 h-5 text-red-500" />
        },
        info: {
            bg: 'bg-slate-900',
            border: 'border-slate-800',
            text: 'text-white',
            icon: <Info className="w-5 h-5 text-indigo-400" />
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div 
            className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[200] 
            flex items-center gap-3 px-4 py-3 rounded-full shadow-lg border 
            ${style.bg} ${style.border} 
            transition-all duration-300 ease-in-out
            ${isVisible && !isExiting 
                ? 'animate-in fade-in slide-in-from-bottom-4 opacity-100 translate-y-0' 
                : 'animate-out fade-out slide-out-to-bottom-4 opacity-0 translate-y-2'
            }`}
        >
            {style.icon}
            <span className={`text-sm font-medium ${style.text} whitespace-pre-wrap text-left`}>{message}</span>
            <button 
                onClick={() => setIsExiting(true)} 
                className={`p-1 rounded-full hover:bg-black/5 transition-colors ${style.text}`}
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default Toast;
