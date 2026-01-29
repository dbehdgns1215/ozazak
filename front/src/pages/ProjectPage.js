import React, { useEffect, useState } from 'react';
import { Plus, X, Calendar, Link, Github, User, Code2, Edit3, Save, Image as ImageIcon, Sparkles, ArrowLeft } from 'lucide-react';
import { recruitmentApi } from '../api/mock/recruitment';

const getTagColor = (tag) => {
    switch (tag) {
        case 'Dev': return 'bg-blue-100 text-blue-800';
        case 'Design': return 'bg-purple-100 text-purple-800';
        case 'Frontend': return 'bg-indigo-100 text-indigo-800';
        case 'Backend': return 'bg-green-100 text-green-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

// Reuse ProjectDetail logic for Modal
const ProjectDetailModal = ({ project: initialProject, onClose }) => {
    const [project, setProject] = useState(initialProject);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(initialProject);
    const [editorMode, setEditorMode] = useState('markdown');
    const [previewImages, setPreviewImages] = useState(initialProject.images || []);

    // Reset state if project prop changes but usually modal unmounts.

    const handleSave = () => {
        setProject({ ...project, ...editForm, images: previewImages });
        setIsEditing(false);
        alert("저장되었습니다 (Mock)");
    };

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setPreviewImages(prev => [...prev, url]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative animate-fade-in" onClick={e => e.stopPropagation()}>

                {/* Modal Header Actions */}
                <div className="sticky top-0 z-20 flex justify-between items-center p-6 bg-slate-900/90 backdrop-blur-md border-b border-white/5 rounded-t-3xl">
                    <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" /> 닫기
                    </button>

                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => { setIsEditing(true); setEditForm(project); }}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Edit3 className="w-4 h-4" /> 정보 수정
                            </button>
                        ) : (
                            <>
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
                            </>
                        )}
                        <button onClick={onClose} className="p-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 md:p-10 pt-4">
                    {isEditing ? (
                        <div className="space-y-6">
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full bg-transparent text-white text-3xl font-bold border-b border-white/10 pb-2 focus:border-indigo-500 focus:outline-none"
                                placeholder="프로젝트 제목"
                            />
                            {/* Simple Editor UI Mock */}
                            <textarea
                                value={editForm.content || ''}
                                onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                                className="w-full h-80 bg-slate-800/50 rounded-xl p-4 text-slate-300 resize-none focus:outline-none"
                                placeholder="내용을 입력하세요..."
                            />
                            {/* Image Upload Mock */}
                            <div>
                                <label className="cursor-pointer inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
                                    <ImageIcon className="w-4 h-4" /> 이미지 추가
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                <div className="flex gap-2 mt-2 overflow-x-auto">
                                    {previewImages.map((src, i) => (
                                        <img key={i} src={src} className="h-20 rounded-lg border border-white/10" alt="preview" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Hero Header inside Modal */}
                            <div className="glass-dark rounded-3xl p-8 relative overflow-hidden text-center md:text-left">
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
                                        <span className="px-4 py-1.5 bg-white/5 rounded-full text-sm font-semibold border border-white/10 text-indigo-300">
                                            {project.role || 'Developer'}
                                        </span>
                                        <span className="px-4 py-1.5 bg-white/5 rounded-full text-sm font-semibold border border-white/10 flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-4 h-4" /> {project.period}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{project.title}</h1>
                                    <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                        {(project.techStack || []).map((tech) => (
                                            <span key={tech} className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-blue-200 font-medium border border-blue-500/20 text-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="glass-dark p-8 rounded-3xl border border-white/5">
                                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                                            <Code2 className="w-5 h-5 text-green-400" /> 상세 내용
                                        </h2>
                                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                                            {project.content || project.description}
                                        </div>
                                    </div>

                                    {(project.images || []).length > 0 && (
                                        <div className="glass-dark p-8 rounded-3xl border border-white/5">
                                            <h3 className="text-lg font-bold mb-4 text-white">Screenshots</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(project.images || []).map((img, i) => (
                                                    <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                                                        <img src={img} alt={`Screenshot ${i}`} className="w-full h-auto object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-6">
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
                                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                                            <Link className="w-4 h-4 text-blue-400" /> Links
                                        </h3>
                                        <div className="space-y-3">
                                            <a href="#" onClick={e => e.preventDefault()} className="block p-4 bg-slate-800/40 rounded-xl hover:bg-slate-800 transition-colors border border-white/5 text-sm text-slate-300 flex items-center gap-3">
                                                <Github className="w-5 h-5" /> GitHub
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const ProjectCard = ({ project, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer"
        >
            <div className="aspect-w-16 aspect-h-9 bg-slate-200">
                {project.images && project.images[0] ? (
                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
            </div>
            <div className="p-4">
                <div className="flex gap-2 mb-2">
                    {(project.techStack || []).slice(0, 3).map(tag => (
                        <span key={tag} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTagColor(tag)}`}>
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="font-bold text-slate-900 tracking-tight">{project.title}</h3>
                <p className="text-sm text-slate-500">{project.period}</p>
            </div>
        </div>
    )
}

export default function ProjectPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await recruitmentApi.getProjects();
                setProjects(data);
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, []);

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-slate-900 font-bold text-2xl tracking-tight">내 프로젝트</h1>
                <p className="text-slate-600 mt-1">경험과 성과를 기록하고 관리하세요</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                ))}
            </div>

            <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <Plus size={32} />
            </button>

            {selectedProject && (
                <ProjectDetailModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}
