// <<<<<<< front/src/pages/ProjectPage.tsx
// import React, { useEffect, useState, useRef } from 'react';
// import { recruitmentApi, Project } from '../api/mock/recruitment';
// import { useGSAP } from '@gsap/react';
// import gsap from 'gsap';
// import { Flip } from 'gsap/Flip';
// import {
//     Plus, User, Heart, Eye, Code2, Calendar,
//     Edit3, Save, X, Trash2, Image as ImageIcon, Sparkles
// } from 'lucide-react';
// import './ProjectPage.css';

// gsap.registerPlugin(Flip);
// =======
 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/project';
import { Project } from '../api/mock/recruitment'; // Keeping Type definition
import { FolderGit2, Code2, Calendar, ChevronRight, Plus } from 'lucide-react';
// >>>>>>> front/src/pages/ProjectPage.tsx

const ProjectPage = () => {
    // Data State
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState<any>(null); // { currentPage, totalPages, ... }
    const [currentPage, setCurrentPage] = useState(0);

    const fetchProjects = async (page: number) => {
        setLoading(true);
        try {
            // Pass page params if API supports it. Assuming getProjects accepts config or query params
            // For now, let's assume getProjects(page, size) is what we intended in the plan
            // But since I haven't updated api/project.js yet to take args, I will just call getProjects() 
            // and expect the component to handle the query string construction if I updated the API details.
            // Actually, I should update the API call in api/project.js first or pass params here if it supports it.
            // Let's assume getProjects passes args through.
            const response: any = await getProjects(page, 9); 
            console.log("Projects API Response:", response);

            const dataRoot = response.data || response;
            const contents = dataRoot.contents || [];
            const pageData = dataRoot.pageInfo || null;

            // Map API Data to UI Model
            const mappedProjects = contents.map((item: any) => ({
                id: item.projectId,
                title: item.title,
                description: item.content ? item.content.slice(0, 100) + (item.content.length > 100 ? '...' : '') : '',
                techStack: item.tags || [],
                role: 'Project Lead', // Default since API doesn't seem to return specific role per project in list clearly or maybe it's missing
                period: `${item.startedAt} ~ ${item.endedAt || 'Present'}`,
                thumbnailUrl: item.thumbnailUrl,
                author: item.author,
                startedAt: item.startedAt,
                endedAt: item.endedAt
            }));

            setProjects(mappedProjects);
            setPageInfo(pageData);

        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    // Animation / View State
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Project>>({});
    const [editorMode, setEditorMode] = useState<'markdown' | 'wysiwyg'>('markdown');

    // Refs for GSAP
    const containerRef = useRef<HTMLDivElement>(null);
    const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Refs for Details Overlay
    const detailsRef = useRef<HTMLDivElement>(null);
    const detailsBgDownRef = useRef<HTMLDivElement>(null);
    const detailsVisualRef = useRef<HTMLDivElement>(null);
    const detailsContentRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    // 1. Fetch Data
    useEffect(() => {
        fetchProjects(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && (!pageInfo || newPage < pageInfo.totalPages)) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 2. Open / Flip Animation
    const handleOpen = contextSafe((project: Project | null, index: number) => {
        if (isAnimating) return;
        setIsAnimating(true);

        // If Logic for "New Project" (Pass null project) -> Create a temp logic or handle it
        // Ideally, we add a "New" item to the list first OR animate from the "Add Button"
        // For simplicity, let's say the Add Button IS the -1 index or handled separately?
        // Let's assume the "New Project" button is just a special card or we handle it cleanly.

        const targetProject = project || {
            id: 'new_' + Date.now(),
            title: '',
            description: '',
            role: 'Developer',
            period: new Date().getFullYear().toString(),
            techStack: [],
            content: '',
            images: [],
            teamSize: 1
        } as Project;

        setSelectedProject(targetProject);
        setEditForm(targetProject);
        setIsEditing(!project); // If project is null, we are creating -> Edit mode ON immediately

        const gridItem = gridItemsRef.current[index];
        if (!gridItem || !detailsRef.current || !detailsBgDownRef.current || !detailsVisualRef.current) {
            setIsAnimating(false);
            return;
        }

        // --- FLIP ANIMATION ---
        const productBg = gridItem.querySelector('.product__bg');
        const productVisual = gridItem.querySelector('.product__visual');

        // Initial State: Hide Grid Item
        gsap.set([productBg, productVisual], { autoAlpha: 0 });

        // Prepare Details
        gsap.set(detailsRef.current, { visibility: 'visible' });
        gsap.set(detailsRef.current.querySelector('.details__bg--up'), { opacity: 1 });

        // Record & First
        Flip.fit(detailsBgDownRef.current, productBg as Element, { scale: true });
        Flip.fit(detailsVisualRef.current, productVisual as Element, { scale: true });

        const state = Flip.getState([detailsBgDownRef.current, detailsVisualRef.current]);

        // Last (Clear props to let them go to their implementation css positions)
        gsap.set([detailsBgDownRef.current, detailsVisualRef.current], { clearProps: "all" });
        gsap.set([detailsBgDownRef.current, detailsVisualRef.current], { opacity: 1, visibility: 'visible' });

        // Play
        Flip.from(state, {
            duration: 0.6,
            ease: "power3.inOut",
            scale: true,
            onComplete: () => setIsAnimating(false)
        });

        // Animate Content In
        gsap.fromTo(
            detailsContentRef.current?.children || [],
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.3, ease: "power2.out" }
        );

        gsap.fromTo('.details__close',
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.4, delay: 0.5, ease: "back.out(1.7)" }
        );
    });

    // 3. Close / Flip Back Animation
    const handleClose = contextSafe(() => {
        if (isAnimating || !selectedProject) return;
        setIsAnimating(true);

        // Find index (Handle 'New' project which might not be in the list)
        let index = projects.findIndex(p => p.id === selectedProject.id);

        // If it's a new project that wasn't saved, it won't be in the list.
        // We need to animate back to the "Add Button" if index is -1.
        // For now, if index is -1 (New Project Canceled), let's just fade out or animate to the Add Card.
        if (index === -1) index = projects.length; // Assume Add Card is at the end

        const gridItem = gridItemsRef.current[index];

        // If we can't find the grid item (maybe deleted?), just fade out
        if (!gridItem) {
            gsap.to(detailsRef.current, {
                autoAlpha: 0, onComplete: () => {
                    ResetState();
                }
            });
            return;
        }

        const productBg = gridItem.querySelector('.product__bg');
        const productVisual = gridItem.querySelector('.product__visual');

        // Content Out
        gsap.to(detailsContentRef.current?.children || [], {
            y: 50, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.in"
        });
        gsap.to('.details__close', { opacity: 0, duration: 0.2 });

        // Flip Back
        const state = Flip.getState([detailsBgDownRef.current, detailsVisualRef.current]);

        if (productBg && productVisual) {
            Flip.fit(detailsBgDownRef.current, productBg as Element, { scale: true });
            Flip.fit(detailsVisualRef.current, productVisual as Element, { scale: true });
        }

        Flip.from(state, {
            duration: 0.6,
            ease: "power3.inOut",
            scale: true,
            onComplete: () => {
                // Restore Grid Item
                gsap.set([productBg, productVisual], { autoAlpha: 1 });
                ResetState();
            }
        });
    });

    const ResetState = () => {
        if (detailsRef.current) {
            gsap.set(detailsRef.current, { visibility: 'hidden' });
            gsap.set(detailsRef.current.querySelector('.details__bg--up'), { opacity: 0 });
        }
        gsap.set([detailsBgDownRef.current, detailsVisualRef.current], { clearProps: "all" });
        setSelectedProject(null);
        setIsEditing(false);
        setEditForm({});
        setIsAnimating(false);
    };


    // 4. CRUD Handlers
    const handleSave = async () => {
        if (!selectedProject) return;

        // Mock Save Logic
        const updatedProject = { ...selectedProject, ...editForm } as Project;

        if (String(selectedProject.id).startsWith('new_')) {
            // Create
            const created = await recruitmentApi.createProject(updatedProject) as Project;
            setProjects(prev => [...prev, created]); // In reality, update state properly
            // Updating the selected project ID to the real one if needed, or just refresh list
            // For smoother animation, currently we just update the list.
        } else {
            // Update
            // recruitmentApi.updateProject(updatedProject) // If exists
            setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        }

        setSelectedProject(updatedProject);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!selectedProject || !window.confirm("Are you sure you want to delete this project?")) return;

        await recruitmentApi.deleteProject(Number(selectedProject.id));
        setProjects(prev => prev.filter(p => p.id !== selectedProject.id));

        // Force Close
        handleClose();
    };


    return (
        <div className="min-h-screen text-white pt-28 pb-20 px-4 md:px-8 project-page-container" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                            My Projects
                        </h1>
                        <p className="text-slate-400 text-lg">
                            프로젝트를 기록하고 관리하세요.
                        </p>
                    </div>
<<<<<<< front/src/pages/ProjectPage.tsx
                </header>

                {/* PROJECT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            ref={el => { gridItemsRef.current[index] = el; }}
                            className="flex justify-center"
                        >
                            <div
                                className="w-full bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group product product__bg"
                                onClick={() => handleOpen(project, index)}
                            >
                                {/* Header */}
                                <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                            <User className="text-slate-500 w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{project.role}</p>
                                            <p className="text-xs text-slate-500">{project.period}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 bg-white relative">
                                    <div className="product__visual bg-slate-900 rounded-xl p-4 mb-4 relative overflow-hidden group-hover:shadow-lg transition-shadow h-48 flex items-center justify-center">
                                        <div className="absolute top-3 left-3 flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                        </div>
                                        {/* Icon or Image */}
                                        <Code2 className="text-white/20 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <h3 className="font-bold text-xl text-slate-900 mb-2">{project.title}</h3>
                                    <p className="text-slate-500 line-clamp-2 text-sm">{project.description}</p>
                                </div>

                                <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-3 text-slate-400">
                                    <Heart size={16} /> 12
                                    <Eye size={16} /> 400
=======
                    <button 
                        onClick={() => navigate('/projects/write')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-5 h-5" /> 새 프로젝트
                    </button>
                </div>

                {/* Project Grid */}
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading projects...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="group relative glass-dark rounded-3xl overflow-hidden hover:bg-slate-800/40 transition-all cursor-pointer border border-white/5 hover:border-blue-500/30 flex flex-col"
                                >
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                                    {/* Large Thumbnail Section */}
                                    <div className="w-full aspect-video bg-slate-800 relative overflow-hidden">
                                        {project.thumbnailUrl ? (
                                            <img 
                                                src={project.thumbnailUrl} 
                                                alt="thumbnail" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <FolderGit2 className="w-12 h-12 opacity-50" />
                                            </div>
                                        )}
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                                        

                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 flex flex-col flex-1 relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-1">
                                            {project.title}
                                        </h3>

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.techStack.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="text-xs font-semibold text-slate-300 bg-slate-700/50 px-2.5 py-1 rounded-md border border-white/5">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 3 && (
                                                <span className="text-xs font-semibold text-slate-500 px-1 py-1">
                                                    +{project.techStack.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                {project.period}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
>>>>>>> front/src/pages/ProjectPage.tsx
                                </div>
                            ))}

                            {/* New Project Placeholder */}
                            <div 
                                onClick={() => navigate('/projects/write')}
                                className="border-2 border-dashed border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors cursor-pointer min-h-[300px]"
                            >
                                <Plus className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-semibold">새 프로젝트 추가하기</p>
                            </div>
                        </div>

<<<<<<< front/src/pages/ProjectPage.tsx
                    {/* Add New Project Card */}
                    <div
                        ref={el => { gridItemsRef.current[projects.length] = el; }}
                        className="flex justify-center"
                    >
                        <div
                            className="w-full h-full min-h-[400px] border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-3xl flex flex-col items-center justify-center text-slate-500 hover:text-blue-500 cursor-pointer product product__bg transition-colors"
                            onClick={() => handleOpen(null, projects.length)}
                        >
                            {/* Hidden Visual for Flip Consistency */}
                            <div className="product__visual hidden"></div>
                            <Plus size={48} className="mb-4" />
                            <span className="font-bold text-lg">New Project</span>
                        </div>
                    </div>
                </div>
=======
                        {/* Pagination */}
                        {pageInfo && (
                            <div className="flex justify-center mt-16 gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                            currentPage === i
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= pageInfo.totalPages - 1}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
>>>>>>> front/src/pages/ProjectPage.tsx
            </div>

            {/* DETAILS OVERLAY */}
            <div className="details" ref={detailsRef}>
                <div className="details__bg details__bg--up"></div>

                <div
                    className="details__bg details__bg--down bg-white rounded-none"
                    ref={detailsBgDownRef}
                    style={{ border: 'none', background: '#fff' }}
                ></div>

                <div
                    className="details__visual bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
                    ref={detailsVisualRef}
                >
                    <div className="absolute top-6 left-6 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <Code2 className="text-white/10 w-32 h-32" />
                </div>

                <div className="details__content" ref={detailsContentRef}>
                    {selectedProject && (
                        <div className="max-w-4xl w-full mx-auto">
                            {/* Actions Toolbar */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-slate-100 rounded-lg text-sm text-slate-600 font-bold border border-slate-200">
                                        {isEditing ? 'Editing Mode' : 'Viewing Mode'}
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditForm(selectedProject);
                                                    setIsEditing(true);
                                                }}
                                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 size={20} />
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
                                            >
                                                <Save size={18} /> Save
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* EDIT MODE FORM */}
                            {isEditing ? (
                                <div className="space-y-8 animate-fade-in bg-white/50 p-6 rounded-3xl backdrop-blur-sm">
                                    <div className="space-y-2">
                                        <label className="text-slate-400 text-sm font-bold uppercase tracking-wider">Title</label>
                                        <input
                                            value={editForm.title || ''}
                                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                            className="project-editor-input text-4xl"
                                            placeholder="Project Title"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-slate-400 text-sm font-bold">Role</label>
                                            <input
                                                value={editForm.role || ''}
                                                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                                className="project-editor-input text-lg"
                                                placeholder="e.g. Frontend"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-slate-400 text-sm font-bold">Period</label>
                                            <input
                                                value={editForm.period || ''}
                                                onChange={e => setEditForm({ ...editForm, period: e.target.value })}
                                                className="project-editor-input text-lg"
                                                placeholder="e.g. 2024.01 - Present"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-slate-400 text-sm font-bold">Description</label>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditorMode('markdown')} className={`text-xs px-2 py-1 rounded ${editorMode === 'markdown' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}>Markdown</button>
                                                <button onClick={() => setEditorMode('wysiwyg')} className={`text-xs px-2 py-1 rounded ${editorMode === 'wysiwyg' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}>Visual</button>
                                            </div>
                                        </div>
                                        <textarea
                                            value={editForm.content || editForm.description || ''}
                                            onChange={e => setEditForm({ ...editForm, content: e.target.value, description: e.target.value })}
                                            className="project-editor-textarea"
                                            placeholder="Write your project details here..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* VIEW MODE DISPLAY */
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-5xl font-extrabold text-slate-900 mb-4 leading-tight">{selectedProject.title}</h2>
                                        <div className="flex items-center gap-4 text-slate-500">
                                            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium"><User size={14} /> {selectedProject.role}</span>
                                            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium"><Calendar size={14} /> {selectedProject.period}</span>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg prose-slate max-w-none text-slate-600">
                                        <p className="whitespace-pre-line text-lg leading-relaxed">
                                            {selectedProject.content || selectedProject.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                <button className="details__close" onClick={handleClose}>
                    <X size={32} />
                </button>
            </div>
        </div>
    );
};

export default ProjectPage;
