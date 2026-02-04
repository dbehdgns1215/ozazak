import React, { useState, useEffect } from 'react';
import { X, FileText, Folder, Edit3, ChevronRight, Check } from 'lucide-react';
import { getCoverLetters } from '../api/coverLetter';
import { getProjects } from '../api/project';

// --- Types ---
type BlockCategory = 'COVER_LETTER' | 'PROJECT' | 'MANUAL';

interface BlockCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (blockData: { title: string; content: string; category: string; tags: string[] }) => Promise<void>;
    initialData?: { title: string; content: string; category: string; tags: string[] } | null;
}

// Mock Data for Projects (fallback)
const MOCK_PROJECTS = [
    { id: 101, name: 'S14 페이먼트 시스템', description: 'MSA 기반의 결제 시스템 구축 프로젝트. Spring Boot와 Kafka를 활용하여 트랜잭션 처리량을 2배 증대시켰습니다.', date: '2023.10' },
    { id: 102, name: '사내 챗봇 서비스', description: 'RAG 기반의 사내 문서 검색 및 Q&A 챗봇. Python, LangChain, OpenAI API 활용.', date: '2023.12' },
    { id: 103, name: 'OjaJak 프론트엔드', description: '취업 준비생을 위한 올인원 플랫폼. React, TypeScript, Tailwind CSS 사용.', date: '2024.01' },
];

const BlockCreationModal: React.FC<BlockCreationModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [step, setStep] = useState<'SELECT_TYPE' | 'SELECT_ITEM' | 'EDIT'>('SELECT_TYPE');
    const [selectedType, setSelectedType] = useState<BlockCategory | null>(null);
    const [isLoadingList, setIsLoadingList] = useState(false);

    // Data Lists
    const [coverLetters, setCoverLetters] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [] as string[]
    });
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Initialize/Reset
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setStep('EDIT');
                setFormData(initialData);
                setSelectedType((initialData.category as BlockCategory) || 'MANUAL');
            } else {
                setStep('SELECT_TYPE');
                setSelectedType(null);
                setFormData({ title: '', content: '', tags: [] });
            }
            setTagInput('');
        } else {
            // When closing, always reset
            setStep('SELECT_TYPE');
            setSelectedType(null);
            setFormData({ title: '', content: '', tags: [] });
        }
    }, [isOpen, initialData]);

    // Initial Fetch when opening specific type
    useEffect(() => {
        if (selectedType === 'COVER_LETTER' && step === 'SELECT_ITEM') {
            fetchCoverLetters();
        } else if (selectedType === 'PROJECT' && step === 'SELECT_ITEM') {
            fetchProjects();
        }
    }, [selectedType, step]);

    const fetchCoverLetters = async () => {
        setIsLoadingList(true);
        try {
            const response: any = await getCoverLetters();
            setCoverLetters(response.data || []);
        } catch (error) {
            console.error("Failed to fetch cover letters", error);
        } finally {
            setIsLoadingList(false);
        }
    };

    const fetchProjects = async () => {
        setIsLoadingList(true);
        try {
            const response = await getProjects();
            // Handle different potential structures of response
            if (response && response.content) {
                setProjects(response.content);
            } else if (Array.isArray(response)) {
                setProjects(response);
            } else {
                setProjects(MOCK_PROJECTS);
            }
        } catch (error) {
            console.warn("Failed to fetch projects, using mock", error);
            setProjects(MOCK_PROJECTS);
        } finally {
            setIsLoadingList(false);
        }
    };

    const handleTypeSelect = (type: BlockCategory) => {
        setSelectedType(type);
        if (type === 'MANUAL') {
            setStep('EDIT');
        } else {
            setStep('SELECT_ITEM');
        }
    };

    const handleItemSelect = (item: any) => {
        if (selectedType === 'COVER_LETTER') {
            setFormData({
                title: `${item.company} ${item.role} 자소서`,
                content: "자소서 내용 불러오기 기능이 필요합니다. (API response에 content가 있다면 여기 들어감)",
                tags: ['자소서', item.company]
            });
        } else if (selectedType === 'PROJECT') {
            setFormData({
                title: item.name,
                content: item.description,
                tags: ['프로젝트', '직무경험']
            });
        }
        setStep('EDIT');
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content) return;

        setIsSaving(true);
        try {
            await onSave({
                ...formData,
                category: selectedType || 'MANUAL'
            });
            onClose();
        } catch (error) {
            console.error("Failed to save block", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">
                        {step === 'SELECT_TYPE' && '새 블록 추가'}
                        {step === 'SELECT_ITEM' && (selectedType === 'COVER_LETTER' ? '자소서 선택' : '프로젝트 선택')}
                        {step === 'EDIT' && (initialData ? '블록 수정' : '블록 내용 편집')}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">

                    {/* View 1: Select Type */}
                    {step === 'SELECT_TYPE' && (
                        <div className="space-y-3">
                            <button
                                onClick={() => handleTypeSelect('COVER_LETTER')}
                                className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-700">기존 자소서에서 가져오기</h4>
                                    <p className="text-sm text-slate-500">작성했던 자소서 내용을 블록으로 저장합니다.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleTypeSelect('PROJECT')}
                                className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                    <Folder className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-blue-700">내 프로젝트에서 가져오기</h4>
                                    <p className="text-sm text-slate-500">프로젝트 경험을 정리하여 블록으로 만듭니다.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleTypeSelect('MANUAL')}
                                className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                            >
                                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                    <Edit3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-green-700">직접 작성하기</h4>
                                    <p className="text-sm text-slate-500">자유롭게 새로운 경험 소재를 작성합니다.</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* View 2: Select Item (CoverLetter or Project) */}
                    {step === 'SELECT_ITEM' && (
                        <div className="space-y-2">
                            {/* Back Button */}
                            <button onClick={() => setStep('SELECT_TYPE')} className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center">
                                &larr; 뒤로가기
                            </button>

                            {isLoadingList ? (
                                <div className="text-center py-10 text-slate-400">Loading...</div>
                            ) : (
                                selectedType === 'COVER_LETTER' ? (
                                    coverLetters.length > 0 ? (
                                        coverLetters.map((item) => (
                                            <div key={item.id} onClick={() => handleItemSelect(item)} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-500 cursor-pointer transition-colors bg-white">
                                                <h4 className="font-bold text-slate-800">{item.company}</h4>
                                                <p className="text-sm text-slate-500">{item.role} • {item.date}</p>
                                            </div>
                                        ))
                                    ) : <div className="text-center py-8 text-slate-400">불러올 자소서가 없습니다.</div>
                                ) : (
                                    projects.length > 0 ? (
                                        projects.map((item) => (
                                            <div key={item.id} onClick={() => handleItemSelect(item)} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-500 cursor-pointer transition-colors bg-white">
                                                <h4 className="font-bold text-slate-800">{item.name}</h4>
                                                <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                                            </div>
                                        ))
                                    ) : <div className="text-center py-8 text-slate-400">불러올 프로젝트가 없습니다.</div>
                                )
                            )}
                        </div>
                    )}

                    {/* View 3: Edit Form */}
                    {step === 'EDIT' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">제목</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="경험의 핵심 제목 (예: 인턴십 리더십 경험)"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">내용</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="구체적인 상황, 행동, 결과를 작성해보세요."
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 min-h-[150px] resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">태그</label>
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {formData.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md flex items-center gap-1">
                                            {tag}
                                            <button onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))} className="hover:text-indigo-800">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        placeholder="태그 입력 후 Enter"
                                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-300"
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                {step === 'EDIT' && (
                    <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            onClick={() => setStep(selectedType === 'MANUAL' ? 'SELECT_TYPE' : 'SELECT_ITEM')}
                            className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !formData.title || !formData.content}
                            className={`px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all ${isSaving || !formData.title || !formData.content
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
                )}
            </div>
        </div>
    );
};

export default BlockCreationModal;
