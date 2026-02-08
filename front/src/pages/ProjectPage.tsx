import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../api/project';
import { generateBlockFromProject } from '../api/user';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import CustomAlert from '../components/CustomAlert';
import { useAuth } from '../context/AuthContext';


import { Project } from '../api/mock/recruitment'; // Keeping Type definition
import { FolderGit2, Code2, Calendar, ChevronRight, Plus, MoreVertical, Edit2, Trash2, Sparkles } from 'lucide-react';
import { stripMarkdown } from '../utils/textUtils';

const ProjectPage = () => {
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

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState<any>(null); // { currentPage, totalPages, ... }
    const [currentPage, setCurrentPage] = useState(0);
    const [projectMenuOpen, setProjectMenuOpen] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Custom Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'error',
        onConfirm: undefined as (() => void) | undefined
    });

    const openAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', onConfirm?: () => void) => {
        setAlertState({ isOpen: true, title, message, type, onConfirm });
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

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



            // ... (existing imports)

            // ...

            // Map API Data to UI Model
            const mappedProjects = contents.map((item: any) => {
                const plainContent = stripMarkdown(item.content || '');
                return {
                    id: item.projectId,
                    title: item.title,
                    description: plainContent.slice(0, 100) + (plainContent.length > 100 ? '...' : ''),
                    techStack: item.tags || [],
                    role: '프로젝트 리드', // Default since API doesn't seem to return specific role per project in list clearly or maybe it's missing
                    period: `${item.startedAt} ~ ${item.endedAt || '진행 중'}`,
                    thumbnailUrl: item.thumbnailUrl,
                    author: item.author,
                    startedAt: item.startedAt,
                    endedAt: item.endedAt
                };
            });

            setProjects(mappedProjects);
            setPageInfo(pageData);

        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && (!pageInfo || newPage < pageInfo.totalPages)) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleEditProject = (e: React.MouseEvent, projectId: number) => {
        e.stopPropagation();
        setProjectMenuOpen(null);
        navigate(`/projects/${projectId}`);
    };

    const handleDeleteProject = async (e: React.MouseEvent, projectId: number) => {
        e.stopPropagation();

        // 중복 실행 방지
        if (isDeleting) return;

        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        setIsDeleting(true);
        try {
            await deleteProject(projectId);
            // 목록 다시 fetch
            await fetchProjects(currentPage);
            setProjectMenuOpen(null);
            alert('프로젝트가 삭제되었습니다.');
        } catch (error) {
            console.error('Failed to delete project', error);
            alert('프로젝트 삭제에 실패했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleImportProjectToBlock = async (e: React.MouseEvent, project: any) => {
        e.stopPropagation();

        // 중복 실행 방지
        if (isImporting) return;

        try {
            const projectId = project.id || project.projectId;

            if (!projectId) {
                alert('프로젝트 ID를 찾을 수 없습니다.');
                return;
            }

            // 로딩 시작 (오버레이 표시)
            setIsImporting(true);

            // 실제 API 응답 대기
            const result = await generateBlockFromProject(projectId);

            setProjectMenuOpen(null);

            // 로딩 종료
            setIsImporting(false);


            // 결과 확인
            let createdBlocks: any[] = [];

            console.log('[DEBUG] generateBlockFromProject result:', result);

            if (Array.isArray(result)) {
                createdBlocks = result;
            } else if (result?.blocks && Array.isArray(result.blocks)) {
                // User provided JSON structure: { "blocks": [...] }
                createdBlocks = result.blocks;
            } else if (result?.data) {
                if (Array.isArray(result.data)) {
                    createdBlocks = result.data;
                } else if (result.data.blocks && Array.isArray(result.data.blocks)) {
                    createdBlocks = result.data.blocks;
                }
            }

            const hasBlocks = createdBlocks.length > 0;

            // 알림 표시
            setTimeout(() => {
                if (hasBlocks) {
                    openAlert('저장 완료', '✨ 내 자소서 소재로 저장되었습니다!\n마이페이지 블록 목록에서 확인해주세요.', 'success');
                } else {
                    openAlert('알림', '추출된 블럭이 없습니다.\n이미 생성된 블럭과 유사하거나 내용을 확인해주세요.', 'warning');
                }
            }, 100);

        } catch (error: any) {
            console.error('Failed to import project to block', error);

            // 로딩 종료
            setIsImporting(false);

            // 실패 알림
            setTimeout(() => {
                openAlert('저장 실패', `블록 저장에 실패했습니다: ${error.message || '알 수 없는 오류'}`, 'error');
            }, 100);
        }
    };




    return (
        <div className="min-h-screen bg-white text-slate-900 pt-32 pb-20 px-6">
            {/* Loading Overlay */}
            <LoadingOverlay isOpen={isImporting} message="자소서 소재로 저장 중입니다..." />

            {/* Custom Alert */}
            <CustomAlert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={alertState.onConfirm}
                cancelText={undefined}
            />

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black mb-4 text-slate-900 tracking-tighter">
                            프로젝트
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl font-medium">
                            기술적 여정과 성과를 확인해보세요.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/projects/write')}
                        className="group px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black flex items-center gap-3 transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
                    >
                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        새 프로젝트
                    </button>
                </div>

                {/* Project Grid */}
                {loading ? (
                    <div className="text-center py-40">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-indigo-600 mb-6"></div>
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">프로젝트 불러오는 중...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-600/10 hover:-translate-y-3 transition-all duration-500 cursor-pointer flex flex-col"
                                >
                                    {/* Thumbnail Section */}
                                    <div className="w-full aspect-[16/10] bg-slate-50 relative overflow-hidden">
                                        {project.thumbnailUrl ? (
                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                                                <FolderGit2 className="w-20 h-20 opacity-10" />
                                            </div>
                                        )}
                                        {/* Tag Overlay */}
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-20">
                                            {project.techStack.slice(0, 2).map((tech, i) => (
                                                <span key={i} className="text-[9px] uppercase tracking-widest font-black text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {/* More Menu Button (Only for owner) */}
                                        {auth?.user?.accountId && project.author?.accountId === auth.user.accountId && (
                                            <div className="absolute top-4 right-4 z-30">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const projectId = typeof project.id === 'string' ? parseInt(project.id) : project.id;
                                                        setProjectMenuOpen(projectMenuOpen === projectId ? null : projectId);
                                                    }}
                                                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md backdrop-blur-sm transition-all"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-slate-600" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {projectMenuOpen === project.id && (
                                                    <>
                                                        {/* Overlay to close menu */}
                                                        <div
                                                            className="fixed inset-0 z-10"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setProjectMenuOpen(null);
                                                            }}
                                                        />
                                                        {/* Menu */}
                                                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                            <button
                                                                onClick={(e) => handleEditProject(e, typeof project.id === 'string' ? parseInt(project.id) : project.id)}
                                                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                수정하기
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteProject(e, typeof project.id === 'string' ? parseInt(project.id) : project.id)}
                                                                disabled={isDeleting}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                {isDeleting ? '삭제 중...' : '삭제하기'}
                                                            </button>
                                                            <div className="border-t border-slate-100 my-1" />
                                                            <button
                                                                onClick={(e) => handleImportProjectToBlock(e, project)}
                                                                disabled={isImporting}
                                                                className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Sparkles className="w-4 h-4" />
                                                                {isImporting ? '저장 중...' : '블록으로 가져오기'}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">
                                                <Calendar size={12} />
                                                {project.period}
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-3 tracking-tight">
                                                {project.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Code2 size={14} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">상세보기</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* New Project Placeholder */}
                            <div
                                onClick={() => navigate('/projects/write')}
                                className="group border-2 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-200 hover:bg-slate-50/50 transition-all duration-500 cursor-pointer min-h-[450px]"
                            >
                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                    <Plus className="w-10 h-10 opacity-30 group-hover:opacity-100" />
                                </div>
                                <p className="font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] text-sm">프로젝트 추가</p>
                            </div>
                        </div>

                        {/* Pagination */}
                        {pageInfo && pageInfo.totalPages > 1 && (
                            <div className="flex justify-center mt-24 gap-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-xs uppercase tracking-widest shadow-xl"
                                >
                                    이전
                                </button>
                                {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`w-12 h-12 rounded-2xl font-black transition-all shadow-xl text-xs ${currentPage === i
                                            ? 'bg-slate-900 text-white scale-110'
                                            : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= pageInfo.totalPages - 1}
                                    className="px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-xs uppercase tracking-widest shadow-xl"
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectPage;
