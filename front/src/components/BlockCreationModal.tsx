import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit3, Check, Plus, Tag } from 'lucide-react';
import { BLOCK_CATEGORY_LIST } from '../constants/blockCategories';
import Toast from './ui/Toast';

interface BlockCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (blockData: { title: string; content: string; categories: number[] }) => Promise<void>;
    initialData?: { title: string; content: string; categories?: number[] } | null;
}

const BlockCreationModal: React.FC<BlockCreationModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    // Form State
    const [formData, setFormData] = useState<{ title: string; content: string; categories: number[] }>({
        title: '',
        content: '',
        categories: []
    });
    const [isSaving, setIsSaving] = useState(false);

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });
    const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        setToast({ visible: true, message, type });
    };
    const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

    // Initialize/Reset
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title || '',
                    content: initialData.content || '',
                    categories: initialData.categories || []
                });
            } else {
                setFormData({ title: '', content: '', categories: [] });
            }
        }
    }, [isOpen, initialData]);

    const toggleCategory = (code: number) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(code)
                ? prev.categories.filter(c => c !== code)
                : [...prev.categories, code]
        }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content) return;

        if (formData.categories.length === 0) {
            showToast("최소 하나 이상의 역량 키워드를 선택해주세요.", "warning");
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Failed to save block", error);
            showToast("블록 저장에 실패했습니다.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">
                        {initialData ? '블록 수정' : '새 블록 작성'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">제목</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="경험의 핵심 제목 (예: 인턴십 리더십 경험)"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900"
                            />
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-indigo-500" />
                                <span>역량 키워드 (중복 선택 가능)</span>
                            </label>
                            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl max-h-[200px] overflow-y-auto scrollbar-hide">
                                {BLOCK_CATEGORY_LIST.map((cat) => {
                                    const isSelected = formData.categories.includes(cat.code);
                                    return (
                                        <button
                                            key={cat.code}
                                            type="button"
                                            onClick={() => toggleCategory(cat.code)}
                                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${isSelected
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content Input */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">내용</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="구체적인 상황, 행동, 결과를 작성해보세요."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px] resize-none transition-all leading-relaxed text-slate-800"
                            />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !formData.title || !formData.content}
                        className={`px-8 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all ${isSaving || !formData.title || !formData.content
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                            }`}
                    >
                        {isSaving ? '저장 중...' : (
                            <>
                                <Check className="w-4 h-4" /> 저장하기
                            </>
                        )}
                    </button>
                </div>
            </div>
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.visible}
                    onClose={closeToast}
                />
            )}
        </div>,
        document.body
    );
};

export default BlockCreationModal;
