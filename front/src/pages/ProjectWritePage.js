import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, X, Calendar } from 'lucide-react';
import Toast from '../components/ui/Toast';
import { uploadImage } from '../api/image';
import { createProject } from '../api/project';
import BlockEditor from '../components/editor/BlockEditor';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import { blocksToMarkdown } from '../components/editor/serialize';

const ProjectWritePage = () => {
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
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

    // Real-time Content Length Warning
    const [prevLength, setPrevLength] = useState(0);
    const markdown = blocksToMarkdown(blocks);

    useEffect(() => {
        const currentLength = markdown.length;
        if (prevLength <= 30000 && currentLength > 30000) {
            showToast("프로젝트 내용은 최대 30,000자까지 입력 가능합니다.", "error");
        }
        setPrevLength(currentLength);
    }, [markdown]);

    // Handsles
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await uploadImage(file, "Project Thumbnail");
            // Robust extraction: support both { data: { primaryUrl } } and { primaryUrl }
            const url = res?.data?.primaryUrl || res?.primaryUrl;
            
            if (url) {
                setThumbnailUrl(url);
                console.log("Thumbnail URL set:", url);
            } else {
                console.warn("Could not extract primaryUrl from response:", res);
                showToast("이미지 URL을 찾을 수 없습니다.", "error");
            }
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

        if (normalized.length > 50) {
            showToast("태그는 최대 50자까지 입력 가능합니다.", "warning");
            return;
        }

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
        /* Thumbnail is now optional
        if (!thumbnailUrl) {
            showToast("대표 이미지를 등록해주세요.", "error");
            return;
        }
        */
        if (!title.trim()) {
            showToast("프로젝트 제목을 입력해주세요.", "error");
            return;
        }
        if (title.length > 100) {
            showToast("프로젝트 제목은 최대 100자까지 입력 가능합니다.", "error");
            return;
        }
        if (!serializedContent.trim()) {
            showToast("프로젝트 내용을 입력해주세요.", "error");
            return;
        }
        if (serializedContent.length > 30000) {
            showToast("프로젝트 내용은 최대 30,000자까지 입력 가능합니다.", "error");
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

    // Live Preview Generation (moved up)
    // const markdown = blocksToMarkdown(blocks);

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden relative">
            <Toast 
                message={toast.message} 
                type={toast.type} 
                isVisible={toast.visible} 
                onClose={closeToast} 
            />

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 bg-white shrink-0 z-50 border-b border-gray-100">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors py-2"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">나가기</span>
                </button>
                <h1 className="text-lg font-black text-slate-800">프로젝트 기록하기</h1>
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || isUploading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-lg transition-all shadow-md shadow-indigo-100 font-bold active:scale-95"
                >
                    {isSubmitting ? '저장 중...' : '저장하기'}
                </button>
            </header>

            {/* Main Content Area (Split View) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left: Editor & Form */}
                <div className="w-full lg:w-1/2 flex flex-col h-full bg-white relative border-r border-slate-100 flex-shrink-0">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-32">
                        <div className="space-y-10">
                            
                            {/* 1. Thumbnail Upload */}
                            <section>
                                <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                                     대표 이미지 <span className="text-slate-400 font-bold lowercase tracking-normal">(선택)</span>
                                </h2>
                                <div className={`relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group 
                                    ${thumbnailUrl ? 'border-slate-100' : 'border-slate-100 hover:border-indigo-200 bg-slate-50'}`}>
                                    {thumbnailUrl ? (
                                        <>
                                            <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                 <label className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all font-bold shadow-xl">
                                                    이미지 변경
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                                                 </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                            {isUploading ? (
                                                <div className="text-indigo-600 font-black animate-pulse uppercase tracking-widest text-xs">Uploading...</div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 transition-transform border border-slate-50">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <div className="text-slate-900 font-black uppercase tracking-wider text-xs">Upload Cover</div>
                                                </>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploading} />
                                        </label>
                                    )}
                                </div>
                            </section>
                            
                            {/* 2. Basic Info (Title, Dates) */}
                            <div className="grid grid-cols-1 gap-8">
                                <section>
                                    <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                                        프로젝트 제목 <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="어떤 프로젝트를 진행하셨나요?"
                                        className="w-full text-3xl font-black border-b-2 border-slate-100 py-3 outline-none focus:border-indigo-500 placeholder-slate-200 transition-colors text-slate-900 bg-transparent"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        maxLength={100}
                                    />
                                    <div className="text-right mt-2 text-[10px] font-black tracking-widest text-slate-400">
                                        <span className={title.length > 100 ? 'text-red-500' : 'text-indigo-600'}>{title.length}</span> / 100
                                    </div>
                                </section>

                                <div className="grid grid-cols-2 gap-8">
                                    <section>
                                        <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                                            시작일 <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-slate-700"
                                            value={startedAt}
                                            onChange={(e) => setStartedAt(e.target.value)}
                                        />
                                    </section>

                                    <section>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">
                                                종료일 <span className="text-red-500">*</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 select-none">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={isOngoing}
                                                    onChange={handleOngoingChange}
                                                />
                                                진행 중
                                            </label>
                                        </div>
                                        <input 
                                            type="date"
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none transition-all font-bold text-slate-700 ${isOngoing ? 'opacity-30 cursor-not-allowed grayscale' : 'focus:ring-2 focus:ring-indigo-500/20'}`}
                                            value={endedAt}
                                            onChange={(e) => setEndedAt(e.target.value)}
                                            disabled={isOngoing}
                                        />
                                    </section>
                                </div>
                            </div>

                            {/* 3. Tech Stacks (Tags) */}
                            <section>
                                <label className="block text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">
                                    사용 기술
                                </label>
                                <div className="flex flex-wrap items-center gap-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl min-h-[70px]">
                                    {tags.map(tag => (
                                        <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-black shadow-sm border border-indigo-50 animate-in fade-in zoom-in duration-200">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text"
                                        placeholder={tags.length === 0 ? "React, Spring Boot..." : "추가 입력"}
                                        className="flex-1 min-w-[120px] bg-transparent outline-none py-1 px-2 text-slate-700 font-bold placeholder-slate-300"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        onBlur={addTag}
                                    />
                                </div>
                            </section>

                            {/* 4. Content (BlockEditor) */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">
                                        상세 내용 <span className="text-red-500">*</span>
                                    </label>
                                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <span className={markdown.length > 30000 ? 'text-red-500' : 'text-indigo-600'}>
                                            {markdown.length.toLocaleString()}
                                        </span>
                                        / 30,000 chars
                                    </div>
                                </div>
                                <BlockEditor blocks={blocks} setBlocks={setBlocks} showToast={showToast} />
                            </section>
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="hidden lg:block w-1/2 h-full overflow-y-auto bg-slate-50 p-16 text-slate-900 border-l border-slate-100 flex-shrink-0">
                    <div className="max-w-2xl mx-auto">
                        <span className="inline-block px-3 py-1 rounded bg-indigo-600 text-[10px] font-black text-white uppercase tracking-widest mb-6">Preview</span>
                        <h1 className="text-5xl font-black mb-10 tracking-tight leading-tight">
                            {title || <span className="text-slate-200">프로젝트 제목</span>}
                        </h1>
                        
                        {/* Preview Meta Info */}
                        <div className="mb-12 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                                    {thumbnailUrl ? (
                                        <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {startedAt || 'YYYY.MM.DD'} ~ {isOngoing ? '진행 중' : (endedAt || 'YYYY.MM.DD')}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.length > 0 ? tags.map(tag => (
                                            <span key={tag} className="text-[10px] px-2.5 py-1 bg-slate-50 text-indigo-600 rounded-lg font-black border border-indigo-50">
                                                #{tag}
                                            </span>
                                        )) : (
                                            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">No Tags</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate prose-lg max-w-none 
                            prose-headings:text-slate-900 prose-headings:font-black
                            prose-p:text-slate-600 prose-p:leading-relaxed
                            prose-img:rounded-3xl prose-img:shadow-xl
                        ">
                            <MarkdownPreview markdown={markdown} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectWritePage;
