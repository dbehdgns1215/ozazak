import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Code2, Link, Github, Edit3, Image as ImageIcon, Sparkles, Save, X } from 'lucide-react';
import { getProject } from '../api/project';
import { Project } from '../api/mock/recruitment';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Project>>({});
    const [editorMode, setEditorMode] = useState<'markdown' | 'wysiwyg'>('markdown');
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [showBlockModal, setShowBlockModal] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!projectId) return;
            try {
                const res = await getProject(projectId);
                const data = res.data || res; // Handle potential wrapper

                setProject(data);
                setEditForm(data);
                setPreviewImages(data.images || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [projectId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setPreviewImages(prev => [...prev, url]);
        }
    };

    const handleSave = () => {
        // Mock Save
        setProject({ ...project, ...editForm, images: previewImages } as Project);
        setIsEditing(false);
        alert("저장되었습니다 (Mock)");
    };

    const handleGenerateBlock = () => {
        setShowBlockModal(true);
        // Mock generation delay
        setTimeout(() => {
            setShowBlockModal(false);
            alert("자소서 블록이 생성되었습니다! (Mock -> Editor에 추가됨)");
            setEditForm(prev => ({
                ...prev,
                content: (prev.content || '') + '\n\n> [Generated Block] \n> 이 프로젝트를 통해 문제 해결 능력을 길렀습니다.'
            }));
        }, 1500);
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!project) return <div className="min-h-screen pt-32 text-center text-white">PROJECT NOT FOUND</div>;

    return (
        <div className="min-h-screen text-white pt-28 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" /> 뒤로가기
                    </button>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Edit3 className="w-4 h-4" /> 정보 수정
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <X className="w-4 h-4" /> 취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Save className="w-4 h-4" /> 저장 완료
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    /* EDIT MODE */
                    <div className="space-y-6 animate-fade-in">
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full bg-transparent text-4xl font-bold border-b border-white/10 pb-2 focus:border-indigo-500 focus:outline-none"
                            placeholder="프로젝트 제목"
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={editForm.role}
                                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                className="bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none"
                                placeholder="역할 (예: Frontend)"
                            />
                            <input
                                type="text"
                                value={editForm.period}
                                onChange={e => setEditForm({ ...editForm, period: e.target.value })}
                                className="bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none"
                                placeholder="기간 (예: 2024.01 - Present)"
                            />
                        </div>

                        {/* Editor Toolbar */}
                        <div className="glass-dark rounded-xl p-4 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
                                    <button
                                        onClick={() => setEditorMode('markdown')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${editorMode === 'markdown' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        Markdown
                                    </button>
                                    <button
                                        onClick={() => setEditorMode('wysiwyg')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${editorMode === 'wysiwyg' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        Blog Editor
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm flex items-center gap-2 text-slate-300">
                                        <ImageIcon className="w-4 h-4" /> 이미지 추가
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                    <button
                                        onClick={handleGenerateBlock}
                                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-sm text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                    >
                                        <Sparkles className="w-4 h-4" /> 자소서 블록 생성
                                    </button>
                                </div>
                            </div>

                            {/* Editor Area */}
                            <textarea
                                value={editForm.content}
                                onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                                className="w-full h-96 bg-transparent text-slate-300 resize-none focus:outline-none p-4 font-mono leading-relaxed"
                                placeholder={editorMode === 'markdown' ? "# 내용을 입력하세요 (Markdown Supported)" : "내용을 입력하세요..."}
                            />
                        </div>

                        {/* Image Preview */}
                        {previewImages.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {previewImages.map((src, idx) => (
                                    <div key={idx} className="relative w-40 h-28 shrink-0 rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setPreviewImages(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                ) : (
                    /* VIEW MODE (Existing Layout Enhanced) */
                    <div className="animate-fade-in">
                        {/* Hero Banner style header */}
                        <div className="glass-dark rounded-3xl p-10 mb-12 relative overflow-hidden text-center md:text-left">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
                                    <span className="px-4 py-1.5 bg-white/5 rounded-full text-sm font-semibold border border-white/10 text-indigo-300">
                                        {project.role}
                                    </span>
                                    <span className="px-4 py-1.5 bg-white/5 rounded-full text-sm font-semibold border border-white/10 flex items-center gap-2 text-slate-300">
                                        <Calendar className="w-4 h-4" /> {project.period}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{project.title}</h1>

                                <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
                                    {(project.techStack || []).map((tech) => (
                                        <span key={tech} className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-blue-200 font-medium border border-blue-500/20 text-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Sidebar: Meta Info */}
                            <div className="space-y-6 lg:order-2">
                                <div className="glass-dark p-6 rounded-3xl border border-white/5">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                                        <Link className="w-4 h-4 text-blue-400" /> Links
                                    </h3>
                                    <div className="space-y-3">
                                        <a href="#" onClick={e => e.preventDefault()} className="block p-4 bg-slate-800/40 rounded-xl hover:bg-slate-800 transition-colors border border-white/5 text-sm text-slate-300 flex items-center gap-3 group">
                                            <Github className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                            <span>GitHub Repository</span>
                                        </a>
                                        <a href="#" onClick={e => e.preventDefault()} className="block p-4 bg-slate-800/40 rounded-xl hover:bg-slate-800 transition-colors border border-white/5 text-sm text-slate-300 flex items-center gap-3 group">
                                            <Link className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                                            <span>Live Demo</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="glass-dark p-6 rounded-3xl border border-white/5">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                                        <User className="w-4 h-4 text-purple-400" /> Team
                                    </h3>
                                    <div className="flex -space-x-3 pl-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 shadow-md" />
                                        ))}
                                        {(project.teamSize || 0) > 3 && (
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400 font-bold">
                                                +{(project.teamSize || 0) - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content: Description */}
                            <div className="lg:col-span-2 space-y-8 lg:order-1">
                                <div className="glass-dark p-8 md:p-10 rounded-3xl border border-white/5">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                                        <Code2 className="w-6 h-6 text-green-400" /> 상세 내용
                                    </h2>
                                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                                        {project.content || project.description}
                                    </div>
                                </div>

                                {/* Images Grid */}
                                {(project.images || []).length > 0 && (
                                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                                        <h3 className="text-xl font-bold mb-6 text-white">Screenshots</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(project.images || []).map((img, i) => (
                                                <div key={i} className="rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                                                    <img src={img} alt={`Screenshot ${i}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mock Generation Modal */}
            {showBlockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="glass-dark p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 animate-bounce-small">
                        <Sparkles className="w-12 h-12 text-indigo-400 animate-spin-slow" />
                        <h3 className="text-xl font-bold text-white">AI가 자소서를 분석 중입니다...</h3>
                        <p className="text-slate-400">멋진 경험 블록을 만들고 있어요!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailPage;
