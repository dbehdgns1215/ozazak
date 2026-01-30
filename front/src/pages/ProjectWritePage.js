import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Toast from '../components/ui/Toast';
import { uploadImage } from '../api/image';
import { createProject } from '../api/project';
import BlockEditor from '../components/editor/BlockEditor';
import { blocksToMarkdown } from '../components/editor/serialize';

const ProjectWritePage = () => {
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
    // const [content, setContent] = useState(''); // Removed simple content state
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [startedAt, setStartedAt] = useState('');
    const [endedAt, setEndedAt] = useState('');
    const [isOngoing, setIsOngoing] = useState(false);
    
    // Block State (for BlockEditor)
    const [blocks, setBlocks] = useState([
        { id: crypto.randomUUID(), type: 'paragraph', text: '' }
    ]);

    // Tag State
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // UI State
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

    // Helpers
    const showToast = (message, type = 'info') => {
        setToast({ visible: true, message, type });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    // Handsles
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await uploadImage(file, "Project Thumbnail");
            setThumbnailUrl(res.data.primaryUrl);
        } catch (error) {
            console.error(error);
            showToast("이미지 업로드에 실패했습니다.", "error");
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const addTag = () => {
        const normalized = tagInput.trim();
        if (!normalized) return;

        if (tags.length >= 10) {
            showToast("태그는 최대 10개까지 등록 가능합니다.", "warning");
            return;
        }

        // Case-insensitive check
        const exists = tags.some(t => t.toLowerCase() === normalized.toLowerCase());
        if (exists) {
            showToast("이미 등록된 태그입니다.", "warning");
            setTagInput('');
            return;
        }

        setTags([...tags, normalized]);
        setTagInput('');
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleOngoingChange = (e) => {
        const checked = e.target.checked;
        setIsOngoing(checked);
        if (checked) {
            setEndedAt('');
        }
    };

    const handleSubmit = async () => {
        // Guard clauses
        if (isSubmitting || isUploading) return;

        const serializedContent = blocksToMarkdown(blocks);

        // 1. Validation
        if (!thumbnailUrl) {
            showToast("대표 이미지를 등록해주세요.", "error");
            return;
        }
        if (!title.trim()) {
            showToast("프로젝트 제목을 입력해주세요.", "error");
            return;
        }
        if (!serializedContent.trim()) {
            showToast("프로젝트 내용을 입력해주세요.", "error");
            return;
        }
        if (!startedAt) {
            showToast("시작일을 선택해주세요.", "error");
            return;
        }
        if (!isOngoing) {
            if (!endedAt) {
                showToast("종료일을 선택해주세요 (또는 '진행 중' 체크).", "error");
                return;
            }
            if (new Date(endedAt) < new Date(startedAt)) {
                showToast("종료일은 시작일 이후여야 합니다.", "error");
                return;
            }
        }

        // 2. Submit
        setIsSubmitting(true);
        try {
            const payload = {
                title: title.trim(),
                content: serializedContent,
                thumbnailUrl: thumbnailUrl,
                startedAt: startedAt, // YYYY-MM-DD
                endedAt: isOngoing ? null : endedAt, // YYYY-MM-DD or null
                tags: tags
            };

            const res = await createProject(payload);
            // Robust ID extraction: Check res.data.projectId, res.projectId, res.id, etc.
            const projectId = res.data?.projectId || res.projectId || res.id || res.data?.id;

            showToast("프로젝트가 성공적으로 등록되었습니다!", "success");

            setTimeout(() => {
                if (projectId) {
                    navigate(`/projects/${projectId}`); 
                } else {
                    navigate('/projects');
                }
            }, 1000);

        } catch (error) {
            console.error(error);
            showToast("프로젝트 등록에 실패했습니다. 다시 시도해주세요.", "error");
            // Form state is preserved
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <Toast 
                message={toast.message} 
                type={toast.type} 
                isVisible={toast.visible} 
                onClose={closeToast} 
            />

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100/50 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors py-2"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">나가기</span>
                </button>
                <h1 className="text-lg font-bold text-slate-800">프로젝트 기록하기</h1>
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || isUploading || !thumbnailUrl}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-5 py-2 rounded-md transition-all shadow-sm active:scale-95 font-bold"
                >
                    {isSubmitting ? '저장 중...' : '저장하기'}
                </button>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="space-y-10">
                    
                    {/* 1. Thumbnail Upload */}
                    <section>
                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                             대표 이미지 <span className="text-red-500">*</span>
                        </h2>
                        <div className="relative w-full aspect-video max-w-sm rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors bg-slate-50 group">
                            {thumbnailUrl ? (
                                <>
                                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <label className="cursor-pointer bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium border border-white/40">
                                            이미지 변경
                                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                                         </label>
                                    </div>
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                    {isUploading ? (
                                        <div className="text-slate-400 font-medium animate-pulse">업로드 중...</div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                                                <ImageIcon size={24} />
                                            </div>
                                            <div className="text-slate-500 font-medium">이미지 업로드</div>
                                            <div className="text-xs text-slate-400 mt-1">권장 사이즈: 1920x1080</div>
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploading} />
                                </label>
                            )}
                        </div>
                    </section>
                    
                    {/* 2. Basic Info (Title, Dates) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                                프로젝트 제목 <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                placeholder="프로젝트 제목을 입력하세요"
                                className="w-full text-2xl font-bold border-b-2 border-gray-100 py-2 outline-none focus:border-slate-900 placeholder-gray-300 transition-colors text-slate-900"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </section>

                        <section>
                            <label className="block text-sm font-bold text-slate-900 mb-2">
                                시작일 <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="date"
                                className="w-full bg-slate-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700"
                                value={startedAt}
                                onChange={(e) => setStartedAt(e.target.value)}
                            />
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-slate-900">
                                    종료일 <span className="text-red-500">*</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                        checked={isOngoing}
                                        onChange={handleOngoingChange}
                                    />
                                    진행 중
                                </label>
                            </div>
                            <input 
                                type="date"
                                className={`w-full bg-slate-50 rounded-lg px-4 py-3 outline-none transition-all font-medium text-slate-700 ${isOngoing ? 'opacity-50 cursor-not-allowed text-slate-400' : 'focus:ring-2 focus:ring-blue-100'}`}
                                value={endedAt}
                                onChange={(e) => setEndedAt(e.target.value)}
                                disabled={isOngoing}
                            />
                        </section>
                    </div>

                    {/* 3. Tech Stacks (Tags) */}
                    <section>
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                            사용 기술 (태그)
                        </label>
                        <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 rounded-xl min-h-[60px]">
                            {tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-600 rounded-full text-sm font-bold shadow-sm border border-indigo-100 animate-in fade-in zoom-in duration-200">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-indigo-900 transition-colors p-0.5 rounded-full hover:bg-indigo-50">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            <input 
                                type="text"
                                placeholder={tags.length === 0 ? "React, Spring Boot 등 기술을 입력하고 Enter를 누르세요" : "태그 추가..."}
                                className="flex-1 min-w-[200px] bg-transparent outline-none py-1 px-2 text-slate-700 placeholder-gray-400"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={addTag} // Add on blur as well
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 px-1">
                            엔터 또는 쉼표(,)로 구분하여 입력하세요. 최대 10개까지 가능합니다.
                        </p>
                    </section>

                    {/* 4. Content (BlockEditor) */}
                    <section>
                        <label className="block text-sm font-bold text-slate-900 mb-3">
                            프로젝트 내용 <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-gray-100 rounded-xl bg-slate-50 min-h-[400px] p-6 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                             <BlockEditor blocks={blocks} setBlocks={setBlocks} showToast={showToast} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ProjectWritePage;
