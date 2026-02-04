import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Code2, Image as ImageIcon, Sparkles, Save, X, Edit3, Trash2, FolderGit2 } from 'lucide-react';
import { getProject, createProject, deleteProject, updateProject } from '../api/project'; // Using createProject as a placeholder for update, or assume save updates
import { useAuth } from '../context/AuthContext';
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
    const auth = useAuth() as any;
    const isAuthenticated = auth?.isAuthenticated ?? false;
    const authLoading = auth?.loading ?? true;
    
    // Check authentication - redirect immediately if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/', { 
                replace: true,
                state: { 
                    showToast: true, 
                    toastMessage: '로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.',
                    toastType: 'error'
                }
            });
        }
    }, [isAuthenticated, authLoading, navigate]);
    
    // Don't render page content if not authenticated
    if (!authLoading && !isAuthenticated) {
        return null;
    }
    
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
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 relative">
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
                <div className="fixed top-24 right-8 z-50 flex flex-col gap-3">
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-12 h-12 bg-white text-slate-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-100 hover:text-indigo-600 border border-slate-100 transition-all group lg:scale-100 scale-90" 
                        title="수정"
                    >
                        <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button 
                        onClick={handleDeleteClick} 
                        className="w-12 h-12 bg-white text-slate-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-red-50 hover:text-red-500 border border-slate-100 transition-all group lg:scale-100 scale-90" 
                        title="삭제"
                    >
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button 
                        onClick={() => navigate('/projects')} 
                        className="w-12 h-12 bg-white text-slate-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-slate-100 hover:text-slate-900 border border-slate-100 transition-all lg:scale-100 scale-90" 
                        title="목록으로"
                    >
                         <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
            )}

            {isEditing ? (
                 // --- EDIT MODE OVERLAY (Split View - Keep as is but ensure consistency if needed) ---
                 <div className="fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden text-slate-900">
                     {/* Header */}
                    <header className="h-16 flex items-center justify-between px-6 bg-white shrink-0 z-50 border-b border-gray-100">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors py-2"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">취소</span>
                        </button>
                        <h1 className="text-lg font-bold text-slate-800">프로젝트 수정</h1>
                        <button 
                            onClick={handleSave}
                            disabled={isSubmitting || isUploading}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-lg transition-all font-bold shadow-md shadow-indigo-100"
                        >
                            {isSubmitting ? '저장 중...' : '저장하기'}
                        </button>
                    </header>

                    {/* Main Split Content */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* LEFT: Editor & Form */}
                        <div className="w-1/2 flex flex-col h-full bg-white relative border-r border-slate-100">
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 pb-32">
                                <div className="max-w-2xl mx-auto space-y-12">
                                    {/* Thumbnail Change */}
                                    <section>
                                        <h2 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">대표 이미지</h2>
                                        <div 
                                            className={`relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group 
                                                ${isDragging ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-100 hover:border-indigo-200 bg-slate-50'}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onPaste={handlePaste}
                                            tabIndex={0}
                                        >
                                            {thumbnailUrl ? (
                                                <>
                                                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    <div className={`absolute inset-0 bg-slate-900/40 flex items-center justify-center transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <label className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all font-bold shadow-xl border border-white/20">
                                                            변경하기
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                                    {isUploading ? (
                                                        <div className="text-indigo-600 font-bold animate-pulse">업로드 중...</div> 
                                                    ) : (
                                                        <div className="text-slate-400 flex flex-col items-center gap-3">
                                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                                <ImageIcon className="w-6 h-6" />
                                                            </div>
                                                            <span className="font-bold">이미지 업로드</span>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={isUploading} />
                                                </label>
                                            )}
                                        </div>
                                    </section>
                                    
                                    {/* Form Fields */}
                                    <div className="space-y-8">
                                        <section>
                                            <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">제목</label>
                                            <input 
                                                type="text" 
                                                className="w-full text-3xl font-black bg-transparent border-b-2 border-slate-100 py-3 outline-none focus:border-indigo-500 placeholder-slate-200 transition-colors"
                                                value={editForm.title || ''}
                                                onChange={e => setEditForm({...editForm, title: e.target.value})}
                                                placeholder="제목을 입력하세요"
                                            />
                                        </section>

                                        <div className="grid grid-cols-2 gap-8">
                                            <section>
                                                <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">시작일</label>
                                                <input type="date" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" value={startedAt} onChange={e => setStartedAt(e.target.value)} />
                                            </section>
                                            <section>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">종료일</label>
                                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 select-none">
                                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={isOngoing} onChange={e => { setIsOngoing(e.target.checked); if(e.target.checked) setEndedAt(''); }} />
                                                        진행 중
                                                    </label>
                                                </div>
                                                <input type="date" className={`w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none font-bold text-slate-700 transition-all ${isOngoing ? 'opacity-30 cursor-not-allowed grayscale' : 'focus:ring-2 focus:ring-indigo-500/20'}`} value={endedAt} onChange={e => setEndedAt(e.target.value)} disabled={isOngoing} />
                                            </section>
                                        </div>

                                        <section>
                                            <label className="block text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">사용 기술</label>
                                            <div className="flex flex-wrap items-center gap-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 min-h-[70px]">
                                                {tags.map(tag => (
                                                    <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-black shadow-sm border border-indigo-50">
                                                        {tag}
                                                        <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><X size={14}/></button>
                                                    </span>
                                                ))}
                                                <input 
                                                    type="text" 
                                                    placeholder="HTML, CSS..."
                                                    className="flex-1 min-w-[120px] bg-transparent outline-none py-1 px-2 text-slate-700 font-bold placeholder-slate-300"
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagKeyDown}
                                                    onBlur={addTag}
                                                />
                                            </div>
                                        </section>

                                        <section>
                                            <label className="block text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">상세 내용</label>
                                            <BlockEditor blocks={blocks} setBlocks={setBlocks} showToast={showToast} />
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Preview (Bright Mode) */}
                        <div className="w-1/2 h-full overflow-y-auto bg-slate-50 p-16 text-slate-900">
                            <div className="max-w-2xl mx-auto">
                                <span className="inline-block px-3 py-1 rounded bg-indigo-600 text-[10px] font-black text-white uppercase tracking-widest mb-6">Preview</span>
                                <h1 className="text-5xl font-black mb-10 tracking-tight leading-tight">{editForm.title || <span className="text-slate-200">제목</span>}</h1>
                                <MarkdownPreview markdown={markdown} className="prose-lg" />
                            </div>
                        </div>
                    </div>
                 </div>
            ) : (
                /* VIEW MODE - BRIGHT THEME */
                /* VIEW MODE - BRIGHT THEME (Restored Cinematic Layout) */
                <div className="animate-in fade-in duration-700">
                    {/* Cinematic Hero Section - Bright Version */}
                    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-slate-100">
                        {/* Background Image with Parallax-like feel */}
                        <div className="absolute inset-0 z-0">
                            {thumbnailUrl ? (
                                <img 
                                    src={thumbnailUrl} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                    <FolderGit2 className="w-32 h-32 text-slate-300 opacity-20" />
                                </div>
                            )}
                            {/* Bright Gradient Overlay - bottom to top white fade */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent z-10" />
                        </div>

                        {/* Hero Content */}
                        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-20">
                            <div className="animate-in slide-in-from-bottom-8 duration-1000">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-600/20 backdrop-blur-md">
                                    <Calendar size={12} />
                                    <span>{project.period}</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.9]">
                                    {project.title}
                                </h1>
                                
                                <div className="flex flex-wrap items-center gap-6">
                                    {/* Author Info */}
                                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md hover:bg-white/80 transition-colors p-1.5 pr-4 rounded-full border border-slate-200">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white">
                                            {project.author?.img && project.author.img !== 'default_img.png' ? (
                                                <img src={project.author.img} alt={project.author.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={20} /></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Created By</span>
                                            <span className="text-sm font-bold text-slate-900">{project.author?.name || 'Unknown'}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-5xl mx-auto px-6 py-20">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-16 lg:p-24 shadow-2xl shadow-slate-200/50">
                            <article className="prose prose-slate prose-lg max-w-none 
                                prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
                                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl
                                prose-img:rounded-[2rem] prose-img:shadow-2xl
                                prose-a:text-indigo-600 prose-a:font-bold hover:prose-a:underline
                            ">
                                <MarkdownPreview 
                                    markdown={project.content || project.description || ''} 
                                />
                            </article>

                            {/* End decoration */}
                            <div className="mt-20 pt-10 border-t border-slate-50 flex justify-between items-center opacity-40">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={20} className="text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Record</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-300">© SSAFY S14P11B205</span>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="mt-16 flex justify-center pb-12">
                            <button 
                                onClick={() => navigate('/projects')}
                                className="group flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95 border border-slate-100"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                목록으로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailPage;
