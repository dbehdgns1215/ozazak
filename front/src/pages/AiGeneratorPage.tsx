import React, { useState, useEffect, useRef } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { FileText, Blocks, BrainCircuit, Loader, CheckCircle, X, Tag, Plus, RefreshCw, Save, Pencil, HelpCircle, Trash } from 'lucide-react';
// useTypewriter removed
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getRecruitmentDetail } from '../api/recruitment';
import { getCoverLetters, getBlocks, getCoverLetterDetail, updateCoverLetter, updateEssay, createEssayVersion, setCurrentEssay, deleteEssay, generateAiCoverLetter } from '../api/coverLetter';
import Toast from '../components/ui/Toast';
import CustomAlert from '../components/CustomAlert';
import './AiGeneratorPage.css';

// 문자열의 바이트 길이를 계산하는 함수 (한글 2바이트, 영문/숫자 1바이트)
const getByteLength = (s: string) => {
    let b = 0;
    let i;
    let c;
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : 1);
    return b;
};

// 제한 바이트 수 (예: 한글 20자 = 40바이트)
const MAX_BYTE_LENGTH = 40;

// --- Types ---
interface DraggableItemData {
    id: string;
    company?: string; // for coverLetter
    role?: string;    // for coverLetter
    date?: string;    // for coverLetter
    title?: string;   // for blocks
    tags?: string[];   // for blocks
    isPassed?: boolean | null; // for coverLetter status
}

// --- Sub-Components ---
interface AnswerEditorProps {
    q: { id: string, text: string, charMax?: number };
    answerState: any;
    onStateChange: (newState: any) => void;
    onRegenerate: (id: string) => void;
    onAddVersion: () => void;
    isRegenerating: boolean;
    isAddingVersion: boolean;
    showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    showAlert: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', onConfirm?: (() => void) | null) => void;
}

const AnswerEditor: React.FC<AnswerEditorProps> = ({ q, answerState, onStateChange, onRegenerate, onAddVersion, isRegenerating, isAddingVersion, showToast, showAlert }) => {
    const { currentVersionIndex, versions } = answerState;
    const currentVersion = versions[currentVersionIndex];

    // [추가] 스크롤 컨테이너를 잡기 위한 Ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // [추가] 드래그 스크롤을 위한 State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // Display content directly without typewriter effect
    const [displayContent, setDisplayContent] = useState('');

    // Version Title Edit State
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    // Deletion State
    const [isDeleting, setIsDeleting] = useState(false);

    // Active Menu State for click-based toggle
    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

    // Click outside handler to close the version menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // If the click is not on a version button or the menu itself, close it
            if (!target.closest('.version-menu-container') && !target.closest('.version-btn')) {
                setActiveMenuIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // [추가] 마우스 클릭 시작 (드래그 시작)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    // [추가] 마우스 뗌 or 영역 벗어남 (드래그 종료)
    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    // [추가] 마우스 움직임 (스크롤 실행)
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // 1.5는 스크롤 속도 (조절 가능)
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // [수정] 휠 이벤트 핸들러 (useEffect로 이동)
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // 세로 스크롤(deltaY)이 발생했을 때
            if (e.deltaY !== 0) {
                // 가로 스크롤 가능 여부 확인 (내용이 컨테이너보다 클 때만)
                const isScrollable = container.scrollWidth > container.clientWidth;

                if (isScrollable) {
                    // 기본 상하 스크롤 막기
                    e.preventDefault();
                    // 가로로 스크롤 이동
                    container.scrollLeft += e.deltaY;
                }
            }
        };

        // { passive: false } 옵션을 줘야 preventDefault가 먹힙니다.
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []); // 빈 의존성 배열 (마운트 시 1회 등록)

    useEffect(() => {
        // Sync display content with current version content immediately
        setDisplayContent(currentVersion.content || '');
    }, [currentVersion.id, currentVersion.content]);

    // [추가] 현재 버전이 변경될 때마다 해당 버튼으로 스크롤 이동
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeBtn = scrollContainerRef.current.querySelector('.version-btn.active') as HTMLElement;
            if (activeBtn) {
                // scrollIntoView는 화면 전체 스크롤을 유발하므로, container의 scrollLeft를 직접 계산하여 가로 스크롤만 이동시킵니다.
                const container = scrollContainerRef.current;
                const newScrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);

                container.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentVersionIndex, versions.length]); // 버전 인덱스나 개수가 바뀌면 실행

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setDisplayContent(newContent);
        setSaveStatus('idle');

        const newVersions = [...versions];
        newVersions[currentVersionIndex] = { ...currentVersion, content: newContent };
        onStateChange({ ...answerState, versions: newVersions });
    };

    const handleSave = async (contentToSave = displayContent, targetVersionId = currentVersion.id, titleToSave = currentVersion.versionTitle) => {
        if (!targetVersionId || targetVersionId.startsWith('v-')) return; // Don't save mock or unsaved IDs
        if (isNaN(Number(targetVersionId))) return; // Prevent NaN error

        setIsSaving(true);
        setSaveStatus('saving');
        try {
            await updateEssay(Number(targetVersionId), contentToSave, titleToSave);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to save essay:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleVersionSwitch = async (index: number) => {
        // Toggle menu if clicking the already active version
        if (index === currentVersionIndex) {
            setActiveMenuIndex(activeMenuIndex === index ? null : index);
            return;
        }

        // 1. Save current content before switching
        await handleSave();

        // 2. Toggles isCurrent in DB
        const targetVersion = versions[index];
        try {
            await setCurrentEssay(Number(targetVersion.id), Number(currentVersion.id));

            // 3. Update local state
            const newVersions = versions.map((v: any, idx: number) => ({
                ...v,
                isCurrent: idx === index
            }));
            onStateChange({ ...answerState, currentVersionIndex: index, versions: newVersions });

            // Set menu to open for the newly selected version
            setActiveMenuIndex(index);
        } catch (error) {
            console.error('Failed to switch version:', error);
        }
    };

    // addVersion logic moved to parent


    const handleDeleteVersion = async (index: number) => {
        if (isDeleting) return;

        const versionToDelete = versions[index];
        if (!versionToDelete) return;

        // Prevent deleting the last version
        if (versions.length <= 1) {
            showToast('최소 하나의 버전은 있어야 합니다.', 'warning');
            return;
        }

        showAlert('삭제 확인', '정말 이 버전을 삭제하시겠습니까?', 'warning', async () => {
            setIsDeleting(true);
            try {
                if (!versionToDelete.id.startsWith('v-')) {
                    await deleteEssay(Number(versionToDelete.id));
                }

                const newVersions = versions.filter((_: any, idx: number) => idx !== index);

                let newIndex = currentVersionIndex;
                if (index === currentVersionIndex) {
                    newIndex = Math.max(0, index - 1);
                } else if (index < currentVersionIndex) {
                    newIndex = currentVersionIndex - 1;
                }

                const updatedVersions = newVersions.map((v: any, idx: number) => ({
                    ...v,
                    isCurrent: idx === newIndex
                }));

                onStateChange({
                    ...answerState,
                    currentVersionIndex: newVersions.length > 0 ? newIndex : 0,
                    versions: updatedVersions
                });
                showToast('버전이 삭제되었습니다.', 'success');

            } catch (error) {
                console.error('Failed to delete version:', error);
                showToast('삭제에 실패했습니다. 이미 삭제되었거나 권한이 없을 수 있습니다.', 'error');
            } finally {
                setIsDeleting(false);
            }
        });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        const newVersions = [...versions];

        // 바이트 길이 체크
        if (getByteLength(newTitle) <= MAX_BYTE_LENGTH) {
            newVersions[currentVersionIndex] = { ...currentVersion, versionTitle: newTitle };
            onStateChange({ ...answerState, versions: newVersions });
        } else {
            showToast("버전 이름은 한글 20자(영문 40자) 이내로 입력해주세요.", "warning");
        }
    };


    return (
        <div className="mt-1">
            <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* [수정] 드래그 이벤트 연결 및 커서 스타일 추가 */}
                    <div
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseUpOrLeave}

                        onMouseUp={handleMouseUpOrLeave}
                        onMouseMove={handleMouseMove}
                        className="flex items-end gap-1 overflow-x-auto scrollbar-hide pt-14 pb-1 px-1 -mt-10 min-w-0 cursor-grab active:cursor-grabbing select-none h-24"
                    >
                        {versions.map((v: any, index: number) => {
                            const isCurrent = index === currentVersionIndex;
                            const isEditingThis = isCurrent && isEditingTitle;

                            if (isEditingThis) {
                                return (
                                    <div key={v.id} className="relative animate-in fade-in zoom-in duration-200 flex-shrink-0">
                                        <input
                                            type="text"
                                            value={v.versionTitle || ''}
                                            onChange={handleTitleChange}
                                            onBlur={(e) => {
                                                handleSave(undefined, undefined, e.target.value);
                                                setIsEditingTitle(false);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.currentTarget.blur();
                                                }
                                            }}
                                            autoFocus
                                            placeholder={`v${v.versionNumber}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-[#7184e6] text-white rounded-md px-2 py-1 text-xs font-bold outline-none w-20 text-center shadow-lg ring-1 ring-white/20"
                                        />
                                    </div>
                                )
                            }

                            return (
                                <div key={v.id} className="relative group/version flex-shrink-0 version-menu-container">
                                    {/* Bubble for Edit/Delete (Shown on Click) */}
                                    {activeMenuIndex === index && (
                                        <div className={`absolute bottom-full mb-2 flex bg-[#2F323D] border border-white/10 rounded-lg shadow-xl p-1 gap-0.5 z-[9999] animate-in fade-in slide-in-from-bottom-2 duration-200 
                                            ${index === 0 ? 'left-0' : 'left-1/2 -translate-x-1/2'}
                                            after:content-[''] after:absolute after:top-full after:border-[4px] after:border-transparent after:border-t-[#2F323D]
                                            ${index === 0 ? 'after:left-4' : 'after:left-1/2 after:-translate-x-1/2'}
                                        `}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsEditingTitle(true);
                                                    setActiveMenuIndex(null); // Close menu after action
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-[#7184e6] transition-colors"
                                                title="이름 수정"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="w-[1px] bg-white/10 my-1"></div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteVersion(index);
                                                    setActiveMenuIndex(null); // Close menu after action
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                                                title="버전 삭제"
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleVersionSwitch(index)}
                                        // active 클래스가 있어야 scrollIntoView가 작동함
                                        className={`relative version-btn ${isCurrent ? 'active' : 'inactive'} transition-all duration-200 whitespace-nowrap`}
                                    >
                                        {v.versionTitle || `v${v.versionNumber}`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    {/* Plus Button - 버전 20개 미만일 때만 표시 (선택 사항) */}
                    {versions.length < 20 && (
                        <button
                            onClick={onAddVersion}
                            disabled={isAddingVersion}
                            className={`flex-shrink-0 p-1.5 rounded-md bg-white/5 text-slate-500 hover:bg-white/10 transition-colors ${isAddingVersion ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Plus className={`w-4 h-4 ${isAddingVersion ? 'animate-pulse' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {saveStatus !== 'idle' && (
                        <span className={`text-[10px] font-medium flex items-center gap-1 ${saveStatus === 'saved' ? 'text-green-400' :
                            saveStatus === 'error' ? 'text-red-400' : 'text-slate-400'
                            }`}>
                            {saveStatus === 'saving' && <Loader className="w-3 h-3 animate-spin" />}
                            {saveStatus === 'saved' && <CheckCircle className="w-3 h-3" />}
                            {saveStatus === 'saved' ? '저장됨' : saveStatus === 'error' ? '저장 실패' : '저장 중...'}
                        </span>
                    )}
                </div>
            </div>

            <div className="relative group/textarea">
                {isRegenerating && <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center rounded-md z-10 backdrop-blur-sm"><Loader className="animate-spin text-[#7184e6]" /></div>}
                <textarea
                    value={displayContent}
                    onChange={handleContentChange}
                    placeholder="이곳에 답변이 생성됩니다."
                    className="custom-textarea h-40"
                />
            </div>
            <div className="flex justify-end mt-2 items-center gap-2">
                {q.charMax && (
                    <span className={`text-[11px] font-mono font-medium px-2 py-1 rounded bg-white/10 border border-white/5 whitespace-nowrap backdrop-blur-sm ${displayContent.length > q.charMax ? 'text-red-400' : 'text-slate-400'}`}>
                        {displayContent.length.toLocaleString()} / {q.charMax.toLocaleString()}자
                    </span>
                )}
                <button
                    onClick={() => handleSave()}
                    disabled={isSaving || saveStatus === 'saved'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold
                        ${saveStatus === 'saved'
                            ? 'bg-green-500/20 border-green-500/50 text-green-400 opacity-60'
                            : 'bg-[#7184e6]/10 border-[#7184e6]/30 text-[#7184e6] hover:bg-[#7184e6]/20 hover:border-[#7184e6]/50 shadow-[0_0_10px_rgba(113,132,230,0.1)]'
                        }`}
                >
                    <Save className="w-3.5 h-3.5" />
                    저장
                </button>
            </div>
        </div >
    );
};

// --- Main Editor Component ---
const AiGeneratorPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const recruitmentId = searchParams.get('recruitmentId');
    const coverLetterId = searchParams.get('coverLetterId');

    const [activeTab, setActiveTab] = useState<'coverLetter' | 'blocks'>('coverLetter');

    // Data States
    const [pastCoverLetters, setPastCoverLetters] = useState<DraggableItemData[]>([]);
    const [userBlocks, setUserBlocks] = useState<DraggableItemData[]>([]);
    const [jobQuestions, setJobQuestions] = useState<{ id: string, text: string }[]>([]);

    // State
    const [globalReferencedCLs, setGlobalReferencedCLs] = useState<DraggableItemData[]>([]);
    const [globalRequest, setGlobalRequest] = useState('');
    const [droppedBlocks, setDroppedBlocks] = useState<{ [key: string]: DraggableItemData[] }>({});
    const [perQuestionRequests, setPerQuestionRequests] = useState<{ [key: string]: string }>({});

    // New unified answers state
    const [answers, setAnswers] = useState<any>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [regeneratingQuestionId, setRegeneratingQuestionId] = useState<string | null>(null);
    const [hasGeneratedCoverLetter, setHasGeneratedCoverLetter] = useState(false);

    // Header Info State
    const [headerInfo, setHeaderInfo] = useState<{ title: string, company: string, jobType: string, isComplete: boolean }>({ title: '', company: '', jobType: '', isComplete: false });
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');

    // Modal State
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingVersion, setIsAddingVersion] = useState(false);

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });

    const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    // Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'error',
        onConfirm: null as null | (() => void)
    });

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', onConfirm: (() => void) | null = null) => {
        setAlertState({
            isOpen: true,
            title,
            message,
            type,
            onConfirm: async () => {
                if (onConfirm) await onConfirm();
                closeAlert();
            }
        });
    };



    const syncStateWithData = (data: any) => {
        if (!data || !data.essayList) return answers;

        const newAnswers: any = {};
        jobQuestions.forEach((q: any, idx: number) => {
            const essayInDB = data.essayList?.[idx];
            if (!essayInDB) return;

            const versionsFromDB = (essayInDB.versions || []).sort((a: any, b: any) => a.version - b.version);
            const mappedVersions = versionsFromDB.map((v: any, vIdx: number) => ({
                id: String(v.id),
                versionNumber: v.version || vIdx + 1,
                versionTitle: v.title || v.versionTitle || '',
                content: v.content || '',
                isCurrent: v.isCurrent || false
            }));

            const currentIdx = mappedVersions.findIndex((v: any) => v.isCurrent);
            newAnswers[q.id] = {
                currentVersionIndex: currentIdx !== -1 ? currentIdx : mappedVersions.length - 1,
                versions: mappedVersions,
            };
        });
        setAnswers(newAnswers);
        return newAnswers;
    };

    const loadData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Job Questions (Prioritize CoverLetter Detail if ID exists, else Recruitment)
            if (coverLetterId) {
                const res: any = await getCoverLetterDetail(coverLetterId);
                const detailData = res.data;

                setHeaderInfo({
                    title: detailData.title,
                    company: detailData.companyName || detailData.recruitmentTitle,
                    jobType: detailData.jobType,
                    isComplete: detailData.isComplete || false
                });
                setEditedTitle(detailData.title);

                if (detailData.essayList) {
                    // Real Backend
                    const questions = detailData.essayList.map((essay: any, idx: number) => ({
                        id: `q-${idx}`,
                        text: essay.question,
                        charMax: essay.charMax
                    }));
                    setJobQuestions(questions);

                    // Set Header Info
                    let jobTitle = detailData.jobType;

                    // Fallback: If jobType is missing in coverletter, fetch it from recruitment if possible
                    if (!jobTitle && detailData.recruitmentId) {
                        try {
                            const { data: rData } = await getRecruitmentDetail(detailData.recruitmentId);
                            jobTitle = rData.data?.position || rData.data?.jobType || rData.position || rData.jobType;
                        } catch (e) {
                            console.error("Failed to fetch recruitment title fallback:", e);
                        }
                    }

                    setHeaderInfo(prev => ({
                        ...prev,
                        // If jobType was missing in detailData, try to use fetched one, else keep prev
                        jobType: jobTitle || prev.jobType || '직무 미정'
                    }));

                    const initialAnswers: any = {};
                    questions.forEach((q: any, idx: number) => {
                        const versions = (detailData.essayList[idx].versions || []).sort((a: any, b: any) => a.version - b.version);
                        const mappedVersions = versions.length > 0
                            ? versions.map((v: any, vIdx: number) => ({
                                id: v.id ? String(v.id) : `v-${Date.now()}-${idx}-${vIdx}`,
                                versionNumber: v.version || vIdx + 1,
                                versionTitle: v.title || v.versionTitle || '',
                                content: v.content || '',
                                isCurrent: v.isCurrent || false
                            }))
                            : [{ id: `v-${Date.now()}-${idx}`, versionNumber: 1, versionTitle: '', content: '', isCurrent: true }];

                        // Find the index of the version where isCurrent is true. Default to last if not found.
                        const currentIdx = mappedVersions.findIndex((v: any) => v.isCurrent);

                        initialAnswers[`q-${idx}`] = {
                            currentVersionIndex: currentIdx !== -1 ? currentIdx : mappedVersions.length - 1,
                            versions: mappedVersions,
                        };
                    });
                    setAnswers(initialAnswers);
                    setHasGeneratedCoverLetter(true);

                    const initialBlocks: { [key: string]: DraggableItemData[] } = {};
                    questions.forEach((q: any) => { initialBlocks[q.id] = []; });
                    setDroppedBlocks(initialBlocks);

                } else if (detailData.questions) {
                    // Mock Data Fallback
                    const questions = detailData.questions.map((q: any, idx: number) => ({
                        id: `q-${idx}`,
                        text: q.q || q.question,
                        charMax: q.charMax
                    }));
                    setJobQuestions(questions);

                    const initialAnswers: any = {};
                    questions.forEach((q: any, idx: number) => {
                        initialAnswers[`q-${idx}`] = {
                            currentVersionIndex: 0,
                            versions: [{
                                id: `v-${Date.now()}-${idx}`,
                                versionNumber: 1,
                                content: detailData.questions[idx].a || detailData.questions[idx].answer || ''
                            }],
                        };
                    });
                    setAnswers(initialAnswers);
                    setHasGeneratedCoverLetter(true);

                    const initialBlocks: { [key: string]: DraggableItemData[] } = {};
                    questions.forEach((q: any) => { initialBlocks[q.id] = []; });
                    setDroppedBlocks(initialBlocks);
                }
            } else if (recruitmentId) {
                const { data } = await getRecruitmentDetail(recruitmentId);
                const recruitmentData = data.data || data;

                if (recruitmentData.questions) {
                    const questions = recruitmentData.questions.map((q: any, idx: number) => ({
                        id: `q-${idx}`,
                        text: q.content || q.question,
                        charMax: q.charMax
                    }));
                    setJobQuestions(questions);

                    // Set Header Info
                    setHeaderInfo({
                        title: `${recruitmentData.title || recruitmentData.companyName} 지원서`,
                        company: recruitmentData.companyName || '기업명 미상',
                        jobType: recruitmentData.position || recruitmentData.jobType || '직무 미정',
                        isComplete: false
                    });
                    setEditedTitle(`${recruitmentData.title || recruitmentData.companyName} 지원서`);

                    const initialAnswers: any = {};
                    questions.forEach((q: any, idx: number) => {
                        initialAnswers[`q-${idx}`] = {
                            currentVersionIndex: 0,
                            versions: [{ id: `v-${Date.now()}-${idx}`, versionNumber: 1, content: '', isCurrent: true, isNew: false }],
                        };
                    });
                    setAnswers(initialAnswers);

                    const initialBlocks: { [key: string]: DraggableItemData[] } = {};
                    questions.forEach((q: any) => { initialBlocks[q.id] = []; });
                    setDroppedBlocks(initialBlocks);
                }
            }

            // 2. Fetch Past Cover Letters
            // TODO: Replace with real user ID or auth context
            const clResponse = await getCoverLetters(0, 50);
            const clData = clResponse.data;
            if (clData) { // clData is array now
                const mappedCLs = clData
                    .filter((cl: any) => cl.id !== Number(coverLetterId) && cl.isComplete) // Filter current & incomplete
                    .map((cl: any) => ({
                        id: String(cl.id),
                        company: cl.companyName || cl.title || 'Untitled',
                        role: cl.jobType || cl.title || '직무 미정',
                        date: new Date(cl.createdAt || Date.now()).toLocaleDateString(),
                        isPassed: cl.isPassed // null, true, false
                    }));
                setPastCoverLetters(mappedCLs);
            }

            // 3. Fetch Blocks
            try {
                const blocksResponse = await getBlocks();
                // Real API: returns { data: { blocks: [...], pageInfo: ... } }
                // Axios returns response.data, so blocksResponse is the JSON body.
                // block list is in blocksResponse.data.blocks
                const blocksData = (blocksResponse as any).data || blocksResponse;

                if (blocksData.blocks) {
                    const mappedBlocks = blocksData.blocks.map((b: any) => ({
                        id: String(b.blockId),
                        title: b.title || 'Untitled Block',
                        tags: b.categories ? b.categories.map(String) : [], // Convert category codes to string
                        content: b.content // Store content if needed for generation
                    }));
                    setUserBlocks(mappedBlocks);
                } else if (Array.isArray(blocksData)) {
                    // Fallback if structure is different (e.g. just list)
                    const mappedBlocks = blocksData.map((b: any) => ({
                        id: String(b.id || b.blockId || Math.random()),
                        title: b.title || 'Untitled Block',
                        tags: b.tags || []
                    }));
                    setUserBlocks(mappedBlocks);
                }
            } catch (blockErr) {
                console.error("Failed to fetch blocks", blockErr);
            }

        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [recruitmentId, coverLetterId]);

    const handleTitleSave = async () => {
        if (!coverLetterId || !editedTitle.trim()) {
            setIsEditingTitle(false);
            return;
        }

        try {
            // Send empty essays list to avoid validation issues with temp IDs.
            // We only want to update the metadata (title) here.
            await updateCoverLetter(Number(coverLetterId), {
                title: editedTitle,
                isComplete: headerInfo.isComplete,
                isPassed: null,
                essays: []
            });
            setHeaderInfo(prev => ({ ...prev, title: editedTitle }));
        } catch (error) {
            console.error('Failed to update title:', error);
            setEditedTitle(headerInfo.title);
        } finally {
            setIsEditingTitle(false);
        }
    };

    const handleDragStart = (event: any) => setActiveId(event.active.id);

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const droppedItem = (active.data.current as unknown as { item: DraggableItemData })?.item;
        if (!droppedItem) return;

        if (activeTab === 'blocks' && jobQuestions.some(q => q.id === over.id)) {
            if (!droppedBlocks[over.id as string]?.some(b => b.id === droppedItem.id)) {
                setDroppedBlocks(prev => ({ ...prev, [over.id as string]: [...(prev[over.id as string] || []), droppedItem] }));
            }
        }
    };

    const handleAnswerStateChange = (questionId: string, newState: any) => {
        setAnswers((prev: any) => ({ ...prev, [questionId]: newState }));
    };

    const addNewVersionToQuestion = (questionId: string, content: string, isNew = false) => {
        const questionState = answers[questionId];
        const newVersionNumber = questionState.versions.length > 0 ? Math.max(...questionState.versions.map((v: any) => v.versionNumber)) + 1 : 1;
        const newVersion = { id: `v${Date.now()}`, versionNumber: newVersionNumber, content, isNew };
        const newVersions = [...questionState.versions, newVersion];
        return {
            currentVersionIndex: newVersions.length - 1,
            versions: newVersions,
        };
    };



    const executeGeneration = async () => {
        setIsSelectionModalOpen(false);
        setIsGenerating(true);
        try {
            let currentAnswers = answers;

            // 1. Auto-save if any temporary IDs exist
            const hasTempIds = jobQuestions.some(q => {
                const answerState = answers[q.id];
                if (!answerState) return false;
                const ver = answerState.versions[answerState.currentVersionIndex];
                return isNaN(Number(ver.id)) || String(ver.id).startsWith('v-');
            });

            if (hasTempIds) {
                const saveResult: any = await handleSave(false);
                if (!saveResult || !saveResult.data) {
                    setIsGenerating(false);
                    return;
                }
                currentAnswers = saveResult.answers;
            }

            // 2. Pre-create new versions for each question
            const essaysPromises = jobQuestions.map(async (q) => {
                const qState = currentAnswers[q.id];
                const currentVersion = qState.versions[qState.currentVersionIndex];
                const currentEssayIdNum = Number(currentVersion.id);

                if (isNaN(currentEssayIdNum)) return null;

                const userPrompt = [globalRequest, perQuestionRequests[q.id]].filter(Boolean).join('\n\n추가 요청: ');

                try {
                    // Create a placeholder version (v2) on the server first
                    const createRes: any = await createEssayVersion(currentEssayIdNum, "\u00A0");
                    const newVersionData = createRes.data?.data || createRes.data;
                    const newEssayId = newVersionData.essayId || newVersionData.id;

                    return {
                        qId: q.id,
                        essayId: Number(newEssayId),
                        referenceBlocks: droppedBlocks[q.id]?.map(b => Number(b.id)) || [],
                        essayContent: "", // New version starts empty
                        userPrompt: userPrompt
                    };
                } catch (err) {
                    console.error(`Failed to create new version for q ${q.id}`, err);
                    return null;
                }
            });

            const essays = (await Promise.all(essaysPromises)).filter((item): item is NonNullable<typeof item> => item !== null);

            if (essays.length === 0) {
                showToast("생성 가능한 문항이 없습니다. (버전 생성 실패)", 'error');
                setIsGenerating(false);
                return;
            }

            const requestBody = {
                recruitmentId: Number(recruitmentId),
                referenceCoverletters: globalReferencedCLs.map(cl => Number(cl.id)),
                essays: essays.map(({ qId, ...rest }) => rest)
            };

            const response = await generateAiCoverLetter(requestBody);
            const results = (response as any).data?.results || (response as any).results;

            if (results) {
                setAnswers((prev: any) => {
                    const nextState = { ...prev };

                    const essayIdToQId: { [key: number]: string } = {};
                    essays.forEach(e => {
                        essayIdToQId[e.essayId] = e.qId;
                    });

                    results.forEach((result: any) => {
                        if (!result.content) return;

                        const qId = essayIdToQId[result.essayId];
                        if (qId && nextState[qId]) {
                            const qState = { ...nextState[qId] };
                            const maxV = qState.versions.reduce((max: number, v: any) => Math.max(max, v.versionNumber || 0), 0);

                            const newVersion = {
                                id: String(result.essayId),
                                versionNumber: Math.max(Number(result.version) || 0, maxV + 1),
                                // Force v{N} format even if backend returns "AI 생성" or other titles
                                versionTitle: `v${Math.max(Number(result.version) || 0, maxV + 1)}`,
                                content: result.content,
                                isNew: true,
                                isCurrent: true
                            };

                            const updatedVersions = qState.versions.map((v: any) => ({ ...v, isCurrent: false }));
                            qState.versions = [...updatedVersions, newVersion];
                            qState.currentVersionIndex = qState.versions.length - 1;
                            nextState[qId] = qState;
                        }
                    });

                    return nextState;
                });
            }

            setHasGeneratedCoverLetter(true);
        } catch (error) {
            console.error(error);
            showToast("AI 자소서 생성 중 오류가 발생했습니다.", 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGlobalGenerate = async () => {
        if (!recruitmentId && !coverLetterId) {
            showToast("공고 정보나 자소서 정보가 없어 생성할 수 없습니다.", 'error');
            return;
        }

        // [수정] 버전이 20개 이상인 문항들을 모두 찾습니다.
        const limitReachedQuestions = jobQuestions.filter(q => {
            const qState = answers[q.id];
            return qState && qState.versions.length >= 20;
        });

        // [수정] 꽉 찬 문항이 하나라도 있다면, 질문 내용을 포함하여 경고를 띄웁니다.
        if (limitReachedQuestions.length > 0) {
            // 질문 목록을 줄바꿈 문자(\n)로 연결
            const questionList = limitReachedQuestions.map(q => `- ${q.text}`).join('\n');

            showToast(`버전은 문항당 최대 20개까지만 생성할 수 있습니다.\n\n${questionList}`, 'warning');
            return;
        }

        // If items are selected, show confirmation modal first
        if (globalReferencedCLs.length > 0 && !isSelectionModalOpen) {
            setIsSelectionModalOpen(true);
            return;
        }

        await executeGeneration();
    };

    // Alias for block based since logic defines the prompt
    const handleBlockBasedGenerate = handleGlobalGenerate;

    const handleRegenerate = async (questionId: string) => {
        if (!recruitmentId && !coverLetterId) return;

        // [수정] 해당 문항의 버전 개수 체크 (20개 제한)
        const currentQState = answers[questionId];
        if (currentQState && currentQState.versions.length >= 20) {
            showToast("이 문항의 버전이 20개에 도달하여 더 이상 생성할 수 없습니다.", 'warning');
            return;
        }

        setRegeneratingQuestionId(questionId);
        try {
            let currentAnswers = answers;
            let qState = answers[questionId];
            let currentVer = qState.versions[qState.currentVersionIndex];
            let essayIdNum = Number(currentVer.id);

            // Auto-save if temp ID
            if (isNaN(essayIdNum) || String(currentVer.id).startsWith('v-')) {
                const saveResult: any = await handleSave(false);
                if (!saveResult || !saveResult.data) {
                    setRegeneratingQuestionId(null);
                    return;
                }
                currentAnswers = saveResult.answers;
                qState = currentAnswers[questionId];
                currentVer = qState.versions[qState.currentVersionIndex];
                essayIdNum = Number(currentVer.id);
            }

            // Pre-create new version for this specific question
            const createRes: any = await createEssayVersion(essayIdNum, "\u00A0");
            const newVersionData = createRes.data?.data || createRes.data;
            const newEssayId = Number(newVersionData.essayId || newVersionData.id);

            const userPrompt = [globalRequest, perQuestionRequests[questionId]].filter(Boolean).join('\n\n추가 요청: ');

            const requestBody = {
                recruitmentId: Number(recruitmentId),
                referenceCoverletters: globalReferencedCLs.map(cl => Number(cl.id)),
                essays: [{
                    essayId: newEssayId,
                    referenceBlocks: droppedBlocks[questionId]?.map(b => Number(b.id)) || [],
                    essayContent: "",
                    userPrompt: userPrompt
                }]
            };

            const response = await generateAiCoverLetter(requestBody);
            const results = (response as any).data?.results || (response as any).results;

            if (results && results[0]) {
                const result = results[0];

                setAnswers((prev: any) => {
                    // Use the latest structure but we must ensure we append
                    const latestQState = prev[questionId] || currentAnswers[questionId];
                    if (!latestQState) return prev;

                    const maxV = latestQState.versions.reduce((max: number, v: any) => Math.max(max, v.versionNumber || 0), 0);

                    const newVersion = {
                        id: String(result.essayId),
                        versionNumber: Math.max(Number(result.version) || 0, maxV + 1),

                        // [수정] 버전 이름 'v{숫자}'로 변경
                        versionTitle: `v${Math.max(Number(result.version) || 0, maxV + 1)}`,

                        content: result.content,
                        isNew: true,
                        isCurrent: true
                    };

                    const nextVersions = latestQState.versions.map((v: any) => ({ ...v, isCurrent: false }));
                    nextVersions.push(newVersion);

                    return {
                        ...prev,
                        [questionId]: {
                            ...latestQState,
                            versions: nextVersions,
                            currentVersionIndex: nextVersions.length - 1
                        }
                    };
                });
            }
        } catch (error) {
            console.error("Failed to regenerate:", error);
            showToast("AI 재생성 중 오류가 발생했습니다.", 'error');
        } finally {
            setRegeneratingQuestionId(null);
        }
    };

    const isAllCompleted = jobQuestions.length > 0 && jobQuestions.every((q: any) => {
        const answer = answers[q.id];
        return answer && answer.versions[answer.currentVersionIndex]?.content?.trim().length > 0;
    });

    const handleSave = async (isFinal: boolean = false) => {
        if (!coverLetterId) return;

        if (isFinal) {
            // Validation: Check if all questions have at least one version with content
            const invalidQuestions = jobQuestions.filter((q: any) => {
                const answerFn = answers[q.id];
                if (!answerFn || !answerFn.versions || answerFn.versions.length === 0) return true;
                // Check if ANY version has non-empty content
                const hasContent = answerFn.versions.some((v: any) => v.content && v.content.trim().length > 0);
                return !hasContent;
            });

            if (invalidQuestions.length > 0) {
                showToast('아직 작성하지 않은 문항이 있어요.', 'error');
                return;
            }

            showAlert(
                '최종 저장',
                `"${headerInfo.title}" 자소서를 최종 저장하시겠습니까?\n저장 후에는 '작성 완료' 상태가 됩니다.`,
                'warning',
                async () => {
                    await performSave(true);
                }
            );
            return;
        }

        await performSave(false);
    };

    const performSave = async (isFinal: boolean) => {
        try {
            const updatedCoverLetter = await updateCoverLetter(Number(coverLetterId), {
                title: headerInfo.title,
                isComplete: isFinal,
                isPassed: null,
                essays: jobQuestions.map(q => {
                    const answerFn = answers[q.id];
                    // 혹시 모를 에러 방지를 위한 안전 장치
                    if (!answerFn) return { id: 0, content: "" };

                    const currentVer = answerFn.versions[answerFn.currentVersionIndex];
                    const eId = Number(currentVer.id);

                    return {
                        id: isNaN(eId) ? 0 : eId,
                        // ✅ 수정됨: 내용이 없으면(undefined/null/empty) "\u00A0"을 보내어 @NotBlank 우회
                        content: (currentVer.content && currentVer.content.trim().length > 0) ? currentVer.content : "\u00A0"
                    };
                })
            });

            if (isFinal) {
                navigate('/cover-letter');
            } else {
                showToast('임시 저장되었습니다.', 'success');
                setHeaderInfo(prev => ({ ...prev, isComplete: false }));
            }

            // Sync IDs and versions from response
            const freshAnswers = syncStateWithData(updatedCoverLetter.data || updatedCoverLetter);
            return { data: updatedCoverLetter.data || updatedCoverLetter, answers: freshAnswers };
        } catch (err) {
            console.error(err);
            // 에러 메시지 상세 표시 (디버깅용)
            // @ts-ignore
            const errorMsg = err.response?.data?.message || '저장에 실패했습니다.';
            showToast(isFinal ? `최종 저장 실패: ${errorMsg}` : `임시 저장 실패: ${errorMsg}`, 'error');
            return null;
        }
    };

    const handleGlobalAddVersion = async (questionId: string) => {
        if (isAddingVersion) return;

        const qState = answers[questionId];
        if (!qState) return;

        setIsAddingVersion(true);
        const currentVer = qState.versions[qState.currentVersionIndex];

        let baseEssayId = currentVer.id;
        let latestAnswers = { ...answers };

        // 1. Auto-save if ID is temporary
        if (isNaN(Number(baseEssayId)) || String(baseEssayId).startsWith('v-')) {
            try {
                // Save silently (Temp save)
                const savedData: any = await handleSave(false);
                if (!savedData || !savedData.data) return; // Save failed

                const detailData = savedData.data;
                const newAnswers: any = {};

                // Update answers state with real IDs from savedData to keep UI in sync
                jobQuestions.forEach((q: any, idx: number) => {
                    const essayInDB = detailData.essayList?.[idx];
                    if (!essayInDB) return;

                    const versionsFromDB = (essayInDB.versions || []).sort((a: any, b: any) => a.version - b.version);
                    const mappedVersions = versionsFromDB.map((v: any, vIdx: number) => ({
                        id: String(v.id),
                        versionNumber: v.version || vIdx + 1,
                        versionTitle: v.title || v.versionTitle || '',
                        content: v.content || '',
                        isCurrent: v.isCurrent || false
                    }));

                    const currentIdx = mappedVersions.findIndex((v: any) => v.isCurrent);
                    newAnswers[q.id] = {
                        currentVersionIndex: currentIdx !== -1 ? currentIdx : mappedVersions.length - 1,
                        versions: mappedVersions,
                    };
                });

                setAnswers(newAnswers);
                latestAnswers = newAnswers;

                // Find the persistent baseEssayId for the target question
                const targetEssayInDB = detailData.essayList?.find((e: any) => {
                    const qData = jobQuestions.find(jq => jq.id === questionId);
                    return e.question === qData?.text && (e.isCurrent?.value || e.isCurrent === true);
                });

                if (targetEssayInDB) {
                    baseEssayId = targetEssayInDB.id.value || targetEssayInDB.id;
                } else {
                    const qIdx = jobQuestions.findIndex(jq => jq.id === questionId);
                    if (qIdx !== -1 && detailData.essayList?.[qIdx]) {
                        baseEssayId = detailData.essayList[qIdx].id.value || detailData.essayList[qIdx].id;
                    } else {
                        throw new Error('Could not find saved essay ID');
                    }
                }
            } catch (e) {
                console.error("Auto-save failed", e);
                showToast('자동 저장에 실패했습니다.', 'error');
                return;
            }
        }

        // 2. Create the new version
        try {
            const { data }: any = await createEssayVersion(Number(baseEssayId), "\u00A0");
            const newVerDetails = data?.data || data;

            // 3. Update local state manually (No reload!)
            setAnswers((prev: any) => {
                const targetQ = latestAnswers[questionId] || prev[questionId];
                if (!targetQ) return prev;

                const updatedVersions = targetQ.versions.map((v: any) => ({ ...v, isCurrent: false }));
                const maxV = updatedVersions.reduce((max: number, v: any) => Math.max(max, v.versionNumber || 0), 0);

                const newVer = {
                    id: String(newVerDetails.essayId || newVerDetails.id),
                    // Ensure incremental numbering even if backend returns 1 for a newly persistent essay
                    versionNumber: Math.max(Number(newVerDetails.version) || 0, maxV + 1),
                    versionTitle: '',
                    content: '\u00A0',
                    isCurrent: true
                };

                const nextVersions = [...updatedVersions, newVer];
                return {
                    ...prev,
                    [questionId]: {
                        ...targetQ,
                        versions: nextVersions,
                        currentVersionIndex: nextVersions.length - 1
                    }
                };
            });
        } catch (error) {
            console.error(error);
            showToast('버전 생성에 실패했습니다.', 'error');
        } finally {
            setIsAddingVersion(false);
        }
    };

    // Unchanged Draggable/UI components
    const DraggableItem = ({ item, type }: { item: DraggableItemData, type: string }) => {
        const { attributes, listeners, setNodeRef } = useDraggable({ id: item.id, data: { item, type } });

        const isSelected = type === 'coverLetter' && globalReferencedCLs.some(cl => cl.id === item.id);

        const handleClick = (e: React.MouseEvent) => {
            if (type === 'coverLetter') {
                e.stopPropagation();
                if (isSelected) {
                    setGlobalReferencedCLs(p => p.filter(cl => cl.id !== item.id));
                } else {
                    setGlobalReferencedCLs(p => [...p, item]);
                }
            }
        };

        const dragProps = type === 'blocks' ? { ...listeners, ...attributes } : {};

        return (
            <div
                ref={setNodeRef}
                {...dragProps}
                onClick={!isGenerating ? handleClick : undefined}
                className={`draggable-item transition-all ${isSelected ? 'selected-item' : ''} ${isGenerating ? 'opacity-50 cursor-not-allowed' : (type === 'coverLetter' ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing')}`}
                style={{
                    cursor: isGenerating ? 'not-allowed' : (type === 'coverLetter' ? 'pointer' : 'grab'),
                    opacity: isGenerating ? 0.7 : 1,
                    border: isSelected ? '2px solid #7184e6' : '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundColor: isSelected ? 'rgba(113, 132, 230, 0.15)' : undefined,
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 20px rgba(113, 132, 230, 0.2)' : 'none',
                    zIndex: isSelected ? 1 : 0
                }}
            >
                {type === 'coverLetter' ? (
                    <>
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-white">{item.company}</p>
                            {isSelected && <div className="w-5 h-5 rounded-full bg-[#7184e6] flex items-center justify-center shrink-0 ml-2 shadow-lg"><CheckCircle className="w-4 h-4 text-white" /></div>}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{item.role}</p>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-[10px] text-slate-500">{item.date}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.isPassed === true ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                item.isPassed === false ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-slate-700/50 text-slate-400 border-slate-600/50'
                                }`}>
                                {item.isPassed === true ? '서합' : item.isPassed === false ? '불합' : '대기'}
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {item.tags?.map(tag => (
                                <span key={tag} className="tag-badge flex items-center gap-1">
                                    <Tag className="w-3 h-3" />{tag}
                                </span>
                            ))}
                        </div>
                        <p className="font-semibold text-slate-200 mb-1">{item.title}</p>
                    </>
                )}
            </div>
        );
    };


    const BlockDropZone = ({ questionId, blocks, onRemove }: { questionId: string, blocks: DraggableItemData[], onRemove: (qId: string, bId: string) => void }) => {
        const { setNodeRef, isOver } = useDroppable({ id: questionId });
        return (<div ref={setNodeRef} className={`drop-zone mt-2 ${isOver ? 'active' : ''}`}> {blocks.length > 0 ? (blocks.map(block => (<div key={block.id} className="dropped-chip">{block.title}<button onClick={() => onRemove(questionId, block.id)}><X className="w-4 h-4" /></button></div>))) : (<p className="text-slate-500 w-full text-center">블록을 여기에 놓으세요</p>)} </div>);
    };

    const TabButton = ({ id, activeTab, onClick, icon, label }: any) => (<button onClick={() => onClick(id)} className={`tab-button ${activeTab === id ? 'active' : 'inactive'}`}> {React.cloneElement(icon, { className: 'w-5 h-5' })} {label} </button>);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white"><Loader className="animate-spin w-8 h-8" /></div>;
    }

    return (
        <div className="ai-generator-container">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {/* Left Panel - Sticky */}
                <div className="w-80 flex flex-col glass-panel p-4 sticky top-20 self-start h-[calc(100vh-140px)] sticky-sidebar">
                    <div className="flex mb-4 gap-2 shrink-0">
                        <TabButton id="coverLetter" activeTab={activeTab} onClick={setActiveTab} icon={<FileText />} label="자소서" />
                        <TabButton id="blocks" activeTab={activeTab} onClick={setActiveTab} icon={<Blocks />} label="블록" />
                    </div>
                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-3 pb-4">
                            {(activeTab === 'coverLetter' ? pastCoverLetters : userBlocks).map(item => <DraggableItem key={item.id} item={item} type={activeTab} />)}
                        </div>
                    </div>
                </div>

                {/* Right Panel (Workspace) */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header Info - Reordered: Title, Company, Job Title */}
                    {(headerInfo.title || headerInfo.company) && (
                        <div className="bg-slate-800/50 p-6 border-b border-white/10 flex flex-col justify-center shrink-0">
                            <div className="flex items-center gap-3 group">
                                {isEditingTitle ? (
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (getByteLength(newValue) <= MAX_BYTE_LENGTH) {
                                                setEditedTitle(newValue);
                                            } else {
                                                showToast("제목은 한글 20자(영문 40자) 이내로 입력해주세요.", "warning");
                                            }
                                        }}
                                        onBlur={handleTitleSave}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                                        autoFocus
                                        className="text-2xl font-black text-white bg-white/5 border border-[#7184e6] rounded-lg px-2 py-1 outline-none w-full max-w-2xl shadow-[0_0_15px_rgba(113,132,230,0.2)]"
                                    />
                                ) : (
                                    <>
                                        <h2
                                            onClick={() => setIsEditingTitle(true)}
                                            className="text-2xl font-black text-white leading-tight cursor-pointer hover:text-[#7184e6] transition-colors"
                                        >
                                            {headerInfo.title}
                                        </h2>
                                        <button
                                            onClick={() => setIsEditingTitle(true)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs font-bold text-slate-300">
                                    {headerInfo.company}
                                </span>
                                <span className="text-slate-500 text-xs">•</span>
                                <span className="text-slate-400 text-sm font-medium">
                                    {headerInfo.jobType}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 glass-panel p-6 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="font-bold text-xl text-white">
                                {activeTab === 'coverLetter' ? '자소서 생성 Tip' : '블록 활용 Tip'}
                            </h2>
                            <div className="group relative">
                                <HelpCircle className="w-5 h-5 text-slate-500 cursor-help hover:text-slate-300 transition-colors" />
                                <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-slate-800 border border-white/10 rounded-xl text-xs leading-relaxed text-slate-300 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                    <p>
                                        {activeTab === 'coverLetter'
                                            ? '왼쪽 목록에서 참고할 자소서를 클릭하여 선택하세요. 선택된 자소서들이 AI 생성의 컨텍스트가 됩니다.'
                                            : '문항별로 원하는 내용의 블록을 드래그하여 담아서 생성해보세요.'}
                                    </p>
                                    <div className="absolute left-4 bottom-full border-4 border-transparent border-b-slate-800"></div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {jobQuestions.map((q, index) => (
                                <div key={q.id}>
                                    <h3 className="font-bold text-lg text-white mb-2">{q.text}</h3>

                                    {/* Conditional Rendering of AnswerEditor */}
                                    {(activeTab === 'blocks' || (activeTab === 'coverLetter' && hasGeneratedCoverLetter) || answers[q.id]?.versions[0]?.content) && (
                                        <AnswerEditor
                                            q={q}
                                            answerState={answers[q.id]}
                                            onStateChange={(newState) => handleAnswerStateChange(q.id, newState)}
                                            onRegenerate={handleRegenerate}
                                            onAddVersion={() => handleGlobalAddVersion(q.id)}
                                            isRegenerating={regeneratingQuestionId === q.id}
                                            isAddingVersion={isAddingVersion}
                                            showToast={showToast}
                                            showAlert={showAlert}
                                        />
                                    )}

                                    <div className="mt-4">
                                        {activeTab === 'blocks' && (
                                            <BlockDropZone questionId={q.id} blocks={droppedBlocks[q.id] || []} onRemove={(qId, bId) => setDroppedBlocks(p => ({ ...p, [qId]: p[qId].filter(b => b.id !== bId) }))} />
                                        )}
                                        <textarea
                                            value={perQuestionRequests[q.id] || ''}
                                            onChange={e => setPerQuestionRequests(p => ({ ...p, [q.id]: e.target.value }))}
                                            placeholder={`${q.id === 'global' ? '공통' : '이 문항'}에 대한 추가 요청사항을 입력하세요 (예: 도전정신 강조, 1인칭 시점 등).`}
                                            className="custom-textarea mt-3"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={() => handleRegenerate(q.id)}
                                                disabled={regeneratingQuestionId === q.id || isGenerating}
                                                className="flex items-center gap-1.5 btn-secondary disabled:opacity-50 py-1.5 px-3"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${regeneratingQuestionId === q.id ? 'animate-spin' : ''}`} />
                                                <span className="text-sm font-medium">이 문항만 다시 생성</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 pl-4 pr-1 relative group">
                        {/* Global Prompt moved here */}
                        {activeTab === 'coverLetter' && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="font-bold text-sm text-white">전체 추가 요청사항</h2>
                                </div>
                                <textarea
                                    value={globalRequest}
                                    onChange={e => setGlobalRequest(e.target.value)}
                                    placeholder="전체 자소서 생성을 위한 추가 요청사항 (톤앤매너, 강조할 점 등)"
                                    className="custom-textarea h-24 text-sm"
                                />
                            </div>
                        )}

                        <button
                            onClick={activeTab === 'coverLetter' ? handleGlobalGenerate : handleBlockBasedGenerate}
                            disabled={isGenerating}
                            className="w-full btn-primary relative"
                        >
                            {isGenerating ? <Loader className="animate-spin" /> : <BrainCircuit />}
                            <span>{isGenerating ? 'AI 자소서 생성 중...' : '✨ AI 자소서 생성'}</span>

                            {/* Selection Badge - Fixed clipping by adding room to container */}
                            {!isGenerating && activeTab === 'coverLetter' && globalReferencedCLs.length > 0 && (
                                <div className="absolute -top-3 -left-2 w-8 h-8 bg-red-600 text-white text-sm font-black rounded-full flex items-center justify-center border-2 border-[#1e1e1e] shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-in zoom-in duration-300 selection-badge-pulse z-30">
                                    {globalReferencedCLs.length}
                                </div>
                            )}
                        </button>

                        {!isGenerating && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 p-4 bg-slate-800 border border-white/10 rounded-2xl text-xs text-slate-300 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                <div className="flex items-start gap-2">
                                    <HelpCircle className="w-4 h-4 text-[#7184e6] shrink-0 mt-0.5" />
                                    <p className="leading-relaxed text-left">
                                        프롬프트에 <span className="text-white font-bold">인재상, 기업 뉴스, 직무 역량</span> 등 구체적인 정보를 입력하면 훨씬 더 뛰어난 결과물이 나옵니다!
                                    </p>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full border-8 border-transparent border-t-slate-800"></div>
                            </div>
                        )}
                    </div>
                    <div className="pt-2 pb-4 flex gap-3">
                        <button
                            onClick={() => handleSave(false)}
                            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 border border-white/10"
                        >
                            <Save className="w-5 h-5 text-slate-400" />
                            <span>임시 저장</span>
                        </button>
                        <button
                            onClick={() => handleSave(true)}
                            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            <span>최종 저장</span>
                        </button>
                    </div>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="opacity-80 shadow-2xl rounded-lg">
                            {(() => {
                                const foundItem = (activeTab === 'coverLetter' ? pastCoverLetters : userBlocks).find(i => i.id === activeId);
                                return foundItem ? <DraggableItem item={foundItem} type={activeTab} /> : null;
                            })()}
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Selection Confirmation Modal */}
                {isSelectionModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-[#1e1e1e] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col p-8 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="text-[#7184e6]" /> 선택된 참고 자소서
                                </h3>
                                <button onClick={() => setIsSelectionModalOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-slate-400 text-sm mb-6">아래 자소서들을 기반으로 AI가 새로운 내용을 작성합니다. 필요 없는 항목은 삭제할 수 있습니다.</p>

                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                                {globalReferencedCLs.map(cl => (
                                    <div key={cl.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-[#7184e6]/30 transition-all">
                                        <div>
                                            <p className="font-bold text-white group-hover:text-[#7184e6] transition-colors">{cl.company}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{cl.role}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setGlobalReferencedCLs(p => p.filter(item => item.id !== cl.id));
                                                if (globalReferencedCLs.length <= 1) setIsSelectionModalOpen(false);
                                            }}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button onClick={executeGeneration} className="w-full btn-primary py-4 text-lg shadow-xl shadow-[#7184e6]/20">
                                    <BrainCircuit /> ✨ AI 자소서 생성 시작
                                </button>
                                <button onClick={() => setIsSelectionModalOpen(false)} className="text-slate-500 hover:text-white text-sm py-2 transition-colors">
                                    나중에 하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </DndContext >
            {/* Toast & CustomAlert */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={closeToast}
            />
            <CustomAlert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={alertState.onConfirm}
                cancelText="취소"
            />
        </div >
    );
};

export default AiGeneratorPage;
