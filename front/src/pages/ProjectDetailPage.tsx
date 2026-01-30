import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Code2, Image as ImageIcon, Sparkles, Save, X, Edit3, Trash2 } from 'lucide-react';
import { getProject, createProject, deleteProject, updateProject } from '../api/project'; // Using createProject as a placeholder for update, or assume save updates
import { Project } from '../api/mock/recruitment';
import { uploadImage } from '../api/image'; // Import uploadImage

import BlockEditor from '../components/editor/BlockEditor';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import { blocksToMarkdown, markdownToBlocks } from '../components/editor/serialize';
import ConfirmModal from '../components/ui/ConfirmModal';
import Toast from '../components/ui/Toast';



const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Edit Mode States (Mirrors ProjectWritePage) ---
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Project>>({}); // Keep for basic sync if needed
    
    // Editor State
    const [blocks, setBlocks] = useState([
        { id: crypto.randomUUID(), type: 'paragraph', text: '' }
    ]);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [startedAt, setStartedAt] = useState('');
    const [endedAt, setEndedAt] = useState('');
    const [isOngoing, setIsOngoing] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    
    // UI State
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
    const submitLock = useRef(false);

    // Helpers
    const showToast = (message: string, type = 'info') => {
        setToast({ visible: true, message, type });
    };
    const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

    useEffect(() => {
        const fetchDetail = async () => {
            if (!projectId) return;
            try {
                const res = await getProject(projectId);
                const data = res.data || res;

                // Map API response to UI Model
                const mappedProject: Project = {
                    ...data,
                    period: `${data.startedAt} ~ ${data.endedAt || 'Present'}`,
                    techStack: data.tags || [],
                    role: data.role || 'Project Lead',
                    images: data.image ? [data.image] : [],
                    teamSize: data.teamSize || 1,
                    startedAt: data.startedAt,
                    endedAt: data.endedAt,
                };

                setProject(mappedProject);
                
                // Initialize Edit States
                setEditForm(mappedProject);
                setThumbnailUrl(data.image || data.thumbnailUrl || '');
                setStartedAt(data.startedAt || '');
                setEndedAt(data.endedAt || '');
                setIsOngoing(!data.endedAt);
                setTags(data.tags || data.techStack || []);
                setBlocks(markdownToBlocks(data.content || data.description || ''));

            } catch (error) {
                console.error(error);
                showToast("프로젝트 정보를 불러오는데 실패했습니다.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [projectId]);

    // --- Edit Handlers ---

    const [isDragging, setIsDragging] = useState(false);

    const processFile = async (file: File) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const res = await uploadImage(file, "Project Thumbnail");
            const url = res?.data?.primaryUrl || res?.primaryUrl;
            if (url) {
                setThumbnailUrl(url);
                showToast("이미지가 업로드되었습니다.", "success");
            } else {
                showToast("이미지 URL을 찾을 수 없습니다.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("이미지 업로드에 실패했습니다.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await processFile(file);
        e.target.value = '';
    };

    // Drag & Drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            await processFile(file);
        } else if (file) {
            showToast("이미지 파일만 업로드 가능합니다.", "warning");
        }
    };

    // Paste
    const handlePaste = async (e: React.ClipboardEvent) => {
        const file = e.clipboardData.files?.[0];
        if (file && file.type.startsWith('image/')) {
            e.preventDefault();
            await processFile(file);
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };
    
    // ... (rest of code)
   
    // IN RENDER - LEFT: Editor & Form
    // ...
                                    {/* Thumbnail */}
                                    <section>
                                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            대표 이미지 <span className="text-red-500">*</span>
                                            <span className="text-xs font-normal text-slate-400 ml-auto bg-slate-100 px-2 py-1 rounded-md">드래그 또는 붙여넣기(Ctrl+V) 가능</span>
                                        </h2>
                                        <div 
                                            className={`relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group 
                                                ${isDragging ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' : 'border-gray-200 hover:border-blue-400 bg-slate-50'}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onPaste={handlePaste}
                                            tabIndex={0} // Make focusable for paste
                                        >
                                            {thumbnailUrl ? (
                                                <>
                                                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <label className="cursor-pointer bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium border border-white/40">
                                                            이미지 변경
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                                    {isUploading ? (
                                                        <div className="text-slate-400 animate-pulse">업로드 중...</div> 
                                                    ) : (
                                                        <div className="text-slate-500 flex flex-col items-center gap-2">
                                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                                            <span>클릭하여 업로드</span>
                                                            <span className="text-xs text-slate-400">또는 이미지를 여기에 드래그하세요</span>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploading} />
                                                </label>
                                            )}
                                        </div>
                                    </section>

    const addTag = () => {
        const normalized = tagInput.trim();
        if (!normalized) return;
        if (tags.length >= 10) {
            showToast("태그는 최대 10개까지 등록 가능합니다.", "warning");
            return;
        }
        if (tags.some(t => t.toLowerCase() === normalized.toLowerCase())) {
            showToast("이미 등록된 태그입니다.", "warning");
            setTagInput('');
            return;
        }
        setTags([...tags, normalized]);
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = async () => {
        if (submitLock.current || isUploading) return;

        // Check for Editor Uploads
        if (blocks.some(b => (b as any).uploading)) {
            showToast("이미지 업로드가 진행 중입니다. 완료 후 다시 시도해주세요.", "warning");
            return;
        }

        const serializedContent = blocksToMarkdown(blocks);

        // Validation
        if (!thumbnailUrl) { showToast("대표 이미지를 등록해주세요.", "error"); return; }
        if (!editForm.title?.trim()) { showToast("프로젝트 제목을 입력해주세요.", "error"); return; }
        if (!serializedContent.trim()) { showToast("프로젝트 내용을 입력해주세요.", "error"); return; }
        if (!startedAt) { showToast("시작일을 선택해주세요.", "error"); return; }
        if (!isOngoing && !endedAt) { showToast("종료일을 선택해주세요.", "error"); return; }
        if (!isOngoing && endedAt && new Date(endedAt) < new Date(startedAt)) { showToast("종료일은 시작일 이후여야 합니다.", "error"); return; }

        submitLock.current = true;
        setIsSubmitting(true);
        try {
            const payload = {
                ...editForm,
                title: editForm.title?.trim(),
                content: serializedContent,
                thumbnailUrl: thumbnailUrl,
                startedAt: startedAt,
                endedAt: isOngoing ? null : endedAt,
                tags: tags
            };

            // Call API
            await updateProject(projectId, payload);
            
            // Update local state for immediate feedback
            setProject({
                ...project!,
                ...payload,
                period: `${startedAt} ~ ${isOngoing ? 'Present' : endedAt}`,
                techStack: tags,
                image: thumbnailUrl, // Map back to UI model
                images: [thumbnailUrl]
            } as Project);

            setIsEditing(false);
            showToast("프로젝트가 성공적으로 수정되었습니다.", "success");
        } catch (error) {
            console.error(error);
            showToast("저장에 실패했습니다.", "error");
        } finally {
            setIsSubmitting(false);
            submitLock.current = false;
        }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteProject(projectId);
            showToast("프로젝트가 삭제되었습니다.", "success");
            setTimeout(() => navigate('/projects'), 1000);
        } catch (error) {
            console.error("Failed to delete project", error);
            showToast("프로젝트 삭제에 실패했습니다.", "error");
        }
    };

    // Derived Preview Markdown
    const markdown = blocksToMarkdown(blocks);

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!project) return <div className="min-h-screen pt-32 text-center text-white">PROJECT NOT FOUND</div>;

    // --- RENDER ---
    return (
        <div className="min-h-screen text-white pt-28 pb-20 relative bg-slate-950">
            <Toast message={toast.message} type={toast.type as any} isVisible={toast.visible} onClose={closeToast} />
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="프로젝트 삭제"
                message="정말로 이 프로젝트를 삭제하시겠습니까? 삭제된 프로젝트는 복구할 수 없습니다."
                confirmText="삭제하기"
                isDestructive={true}
            />

            {/* View Mode Header/Nav */}
            {!isEditing && (
                <div className="fixed top-24 right-8 z-50 animate-fade-in-up flex flex-col gap-2">
                    <button onClick={() => setIsEditing(true)} className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-white/10 hover:scale-110 transition-all" title="수정">
                        <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={handleDeleteClick} className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 hover:bg-red-600 hover:scale-110 transition-all" title="삭제">
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => navigate(-1)} className="w-12 h-12 mt-2 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 hover:text-white transition-all shadow-black/20" title="목록으로">
                         <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
            )}

            {isEditing ? (
                 // --- EDIT MODE OVERLAY (Split View) ---
                 <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden text-slate-900 animate-in fade-in duration-200">
                     {/* Header */}
                    <header className="h-16 flex items-center justify-between px-6 bg-white shrink-0 z-50 border-b border-gray-100">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors py-2"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">취소 (돌아가기)</span>
                        </button>
                        <h1 className="text-lg font-bold text-slate-800">프로젝트 수정하기</h1>
                        <button 
                            onClick={handleSave}
                            disabled={isSubmitting || isUploading}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-5 py-2 rounded-md transition-all shadow-sm active:scale-95 font-bold"
                        >
                            {isSubmitting ? '저장 중...' : '수정 완료'}
                        </button>
                    </header>

                    {/* Main Split Content */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* LEFT: Editor & Form */}
                        <div className="w-1/2 flex flex-col h-full bg-white relative border-r border-slate-100">
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-32">
                                <div className="space-y-10">
                                    {/* Thumbnail */}
                                    <section>
                                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            대표 이미지 <span className="text-red-500">*</span>
                                            <span className="text-xs font-normal text-slate-400 ml-auto bg-slate-100 px-2 py-1 rounded-md">드래그 또는 붙여넣기(Ctrl+V) 가능</span>
                                        </h2>
                                        <div 
                                            className={`relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group 
                                                ${isDragging ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' : 'border-gray-200 hover:border-blue-400 bg-slate-50'}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onPaste={handlePaste}
                                            tabIndex={0} // Make focusable for paste
                                        >
                                            {thumbnailUrl ? (
                                                <>
                                                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <label className="cursor-pointer bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium border border-white/40">
                                                            이미지 변경
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                                    {isUploading ? (
                                                        <div className="text-slate-400 animate-pulse">업로드 중...</div> 
                                                    ) : (
                                                        <div className="text-slate-500 flex flex-col items-center gap-2">
                                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                                            <span>클릭하여 업로드</span>
                                                            <span className="text-xs text-slate-400">또는 이미지를 여기에 드래그하세요</span>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploading} />
                                                </label>
                                            )}
                                        </div>
                                    </section>
                                    
                                    {/* Inputs */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <section>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">프로젝트 제목 <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                className="w-full text-2xl font-bold border-b-2 border-gray-100 py-2 outline-none focus:border-slate-900 placeholder-gray-300 text-slate-900"
                                                value={editForm.title || ''}
                                                onChange={e => setEditForm({...editForm, title: e.target.value})}
                                                placeholder="제목 입력"
                                            />
                                        </section>
                                        <div className="grid grid-cols-2 gap-4">
                                            <section>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">역할 (Role)</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-slate-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 font-medium text-slate-700"
                                                    value={editForm.role || ''}
                                                    onChange={e => setEditForm({...editForm, role: e.target.value})}
                                                    placeholder="Frontend, Backend..."
                                                />
                                            </section>
                                            {/* Dummy for alignment or Team Size */}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <section>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">시작일 <span className="text-red-500">*</span></label>
                                                <input type="date" className="w-full bg-slate-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 font-medium text-slate-700" value={startedAt} onChange={e => setStartedAt(e.target.value)} />
                                            </section>
                                            <section>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-sm font-bold text-slate-900">종료일 <span className="text-red-500">*</span></label>
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                                                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600" checked={isOngoing} onChange={e => { setIsOngoing(e.target.checked); if(e.target.checked) setEndedAt(''); }} />
                                                        진행 중
                                                    </label>
                                                </div>
                                                <input type="date" className={`w-full bg-slate-50 rounded-lg px-4 py-3 outline-none font-medium text-slate-700 ${isOngoing ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-100'}`} value={endedAt} onChange={e => setEndedAt(e.target.value)} disabled={isOngoing} />
                                            </section>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <section>
                                        <label className="block text-sm font-bold text-slate-900 mb-3">사용 기술 (태그)</label>
                                        <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-50 rounded-xl min-h-[60px]">
                                            {tags.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-600 rounded-full text-sm font-bold shadow-sm border border-indigo-100">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)} className="hover:text-indigo-900 p-0.5 rounded-full"><X size={14}/></button>
                                                </span>
                                            ))}
                                            <input 
                                                type="text" 
                                                placeholder={tags.length === 0 ? "기술 입력 후 Enter" : "태그 추가..."}
                                                className="flex-1 min-w-[100px] bg-transparent outline-none py-1 px-2 text-slate-700"
                                                value={tagInput}
                                                onChange={e => setTagInput(e.target.value)}
                                                onKeyDown={handleTagKeyDown}
                                                onBlur={addTag}
                                            />
                                        </div>
                                    </section>

                                    {/* Editor */}
                                    <section>
                                        <label className="block text-sm font-bold text-slate-900 mb-3">프로젝트 내용 <span className="text-red-500">*</span></label>
                                        <BlockEditor blocks={blocks} setBlocks={setBlocks} showToast={showToast} />
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Preview */}
                        <div className="w-1/2 h-full overflow-y-auto bg-slate-50 p-12 text-slate-900">
                            <h2 className="text-xl font-bold text-slate-400 mb-8 border-b border-gray-200 pb-2">PREVIEW</h2>
                            <h1 className="text-4xl font-bold mb-8 break-words text-slate-900">{editForm.title || <span className="text-gray-300">제목</span>}</h1>
                            <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {thumbnailUrl ? (
                                            <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24} /></div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-500 mb-1">{startedAt || 'YYYY.MM.DD'} ~ {isOngoing ? '진행 중' : (endedAt || 'YYYY.MM.DD')}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {tags.length > 0 ? tags.map(tag => <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{tag}</span>) : <span className="text-xs text-gray-400">태그 없음</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <MarkdownPreview markdown={markdown} />
                        </div>
                    </div>
                 </div>
            ) : (
                /* VIEW MODE - NEW SINGLE COLUMN DESIGN */
                /* VIEW MODE - CINEMATIC HERO DESIGN */
                <div className="w-full min-h-screen bg-slate-950 animate-fade-in">
                    
                    {/* 1. Cinematic Hero Section */}
                    <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
                        {/* Background Image */}
                        {project.thumbnailUrl ? (
                             <div className="absolute inset-0">
                                <img 
                                    src={project.thumbnailUrl} 
                                    alt="Project Cover" 
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient Overlay for text readability & transition */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-black/30" />
                             </div>
                        ) : (
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black" />
                        )}

                        {/* Hero Content (Centered) */}
                        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center pb-20">
                            
                            {/* Meta Badges */}
                            <div className="flex flex-wrap justify-center gap-3 mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                                <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium text-white/90 backdrop-blur-md shadow-lg">
                                    {project.period}
                                </span>
                                {project.role && (
                                    <span className="px-4 py-1.5 rounded-full bg-indigo-500/30 border border-indigo-500/30 text-sm font-medium text-indigo-100 backdrop-blur-md shadow-lg">
                                        {project.role}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                                {project.title}
                            </h1>

                            {/* Author & Tech Stack Row */}
                            <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                                {/* Author */}
                                <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                                    <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-slate-800">
                                        {project.author?.img && project.author.img !== 'default_img.png' ? (
                                            <img src={project.author.img} alt={project.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={14} /></div>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-white">{project.author?.name || 'Unknown'}</span>
                                </div>

                                {/* Divider (Desktop) */}
                                <div className="hidden md:block w-px h-4 bg-white/20" />

                                {/* Tech Stack */}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {project.techStack.map(tech => (
                                            <span key={tech} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white/90 text-xs font-bold border border-white/10 shadow-sm backdrop-blur-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Main Content Sheet */}
                    <div className="relative z-20 -mt-24 max-w-5xl mx-auto px-6 lg:px-0">
                        <div className="bg-slate-950 rounded-t-[3rem] shadow-2xl border-t border-white/5 p-8 md:p-16 min-h-[500px]">
                            
                            {/* Decorative Top Line */}
                            <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mb-16 opacity-50" />

                            {/* Markdown Content */}
                            <div className="prose prose-invert prose-lg max-w-none 
                                prose-headings:font-bold prose-headings:text-white 
                                prose-p:text-slate-300 prose-p:leading-relaxed 
                                prose-li:text-slate-300 
                                prose-strong:text-white prose-strong:font-bold
                                prose-a:text-blue-400 hover:prose-a:text-blue-300 transition-colors
                                prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-800
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                                prose-code:bg-slate-900 prose-code:text-blue-300 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                            ">
                                 <MarkdownPreview 
                                    markdown={project.content || project.description} 
                                    className="text-slate-300"
                                />
                            </div>

                            {/* Footer (End of Post) */}
                            <div className="mt-32 mb-10 text-center border-t border-slate-900 pt-10">
                                <div className="inline-flex flex-col items-center gap-3 text-slate-600">
                                    <Sparkles size={24} className="text-slate-700" />
                                    <span className="text-sm font-medium tracking-widest uppercase opacity-70">Thank you for watching</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ProjectDetailPage;
