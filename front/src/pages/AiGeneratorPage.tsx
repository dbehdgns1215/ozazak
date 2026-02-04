import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { BLOCK_CATEGORY_MAP } from '../constants/blockCategories';
import { FileText, Blocks, BrainCircuit, Loader, CheckCircle, X, Tag, Plus, RefreshCw, Save, Pencil, HelpCircle, Trash } from 'lucide-react';
import useTypewriter from '../hooks/useTypewriter';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getRecruitmentDetail } from '../api/recruitment';
import { getCoverLetters, getBlocks, getCoverLetterDetail, updateCoverLetter, updateEssay, createEssayVersion, setCurrentEssay, deleteEssay } from '../api/coverLetter';
import './AiGeneratorPage.css';

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
    isRegenerating: boolean;
}

const AnswerEditor: React.FC<AnswerEditorProps> = ({ q, answerState, onStateChange, onRegenerate, isRegenerating }) => {
    const { currentVersionIndex, versions } = answerState;
    const currentVersion = versions[currentVersionIndex];

    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // State to manage typewriter effect vs. user input
    const [isUserTyping, setIsUserTyping] = useState(false);
    const typedText = useTypewriter(isUserTyping ? '' : (currentVersion.content || '').trimStart());
    const [displayContent, setDisplayContent] = useState('');

    // Version Title Edit State
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    useEffect(() => {
        // When version content changes
        setIsUserTyping(false);
        // If it's a new AI generation (isNew=true), start typewriter by resetting display
        if (currentVersion.isNew) {
            setDisplayContent('');
        } else {
            setDisplayContent(currentVersion.content || '');
        }
    }, [currentVersion.id, currentVersion.isNew]); // Depend on version ID

    useEffect(() => {
        if (!isUserTyping && currentVersion.isNew) {
            setDisplayContent(typedText);
        }
    }, [typedText, isUserTyping, currentVersion.isNew]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isUserTyping) setIsUserTyping(true);

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
        if (index === currentVersionIndex) return;

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
        } catch (error) {
            console.error('Failed to switch version:', error);
        }
    };

    const addVersion = async () => {
        // Prevent adding version to unsaved/temp essay
        if (isNaN(Number(currentVersion.id)) || currentVersion.id.startsWith('v-')) {
            alert('먼저 현재 내용을 저장해야 버전을 추가할 수 있습니다.');
            return;
        }

        try {
            // User requested "+" button creates empty version
            // Backend @NotBlank requires content, so we send a non-breaking space
            const { data } = await createEssayVersion(Number(currentVersion.id), "\u00A0");
            const newVersionDetails = (data as any).data || data;

            const newVersions = [...versions.map((v: any) => ({ ...v, isCurrent: false })), {
                id: String(newVersionDetails.essayId || newVersionDetails.id),
                versionNumber: newVersionDetails.version || versions.length + 1,
                versionTitle: '',
                content: '\u00A0',
                isCurrent: true
            }];
            onStateChange({ currentVersionIndex: newVersions.length - 1, versions: newVersions });
        } catch (error) {
            console.error('Failed to add version:', error);
        }
    };

    const handleDeleteVersion = async (index: number) => {
        if (!window.confirm('정말 이 버전을 삭제하시겠습니까?')) return;

        const versionToDelete = versions[index];
        try {
            if (!versionToDelete.id.startsWith('v-')) {
                await deleteEssay(Number(versionToDelete.id));
            }

            const newVersions = versions.filter((_: any, idx: number) => idx !== index);

            let newIndex = currentVersionIndex;
            if (index === currentVersionIndex) {
                newIndex = Math.max(0, index - 1);
                if (newVersions.length > 0) {
                    const newCurrentDetails = newVersions[newIndex];
                    if (!newCurrentDetails.id.startsWith('v-')) {
                        await setCurrentEssay(Number(newCurrentDetails.id), -1);
                    }
                }
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

        } catch (error) {
            console.error('Failed to delete version:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        const newVersions = [...versions];
        newVersions[currentVersionIndex] = { ...currentVersion, versionTitle: newTitle };
        onStateChange({ ...answerState, versions: newVersions });
    };

    return (
        <div className="mt-1">
            <div className="flex items-center justify-between mb-1 gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1 overflow-x-auto flex-1 scrollbar-hide pt-12 pb-1 px-1 -mt-12">
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
                                <div key={v.id} className="relative group/version flex-shrink-0">
                                    {/* Hover Bubble for Edit/Delete */}
                                    {isCurrent && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover/version:flex bg-[#2F323D] border border-white/10 rounded-lg shadow-xl p-1 gap-0.5 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[4px] after:border-transparent after:border-t-[#2F323D]">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsEditingTitle(true);
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
                                        className={`relative version-btn ${isCurrent ? 'active' : 'inactive'} transition-all duration-200 whitespace-nowrap`}
                                    >
                                        {v.versionTitle || `v${v.versionNumber}`}
                                    </button>
                                </div>
                            );
                        })}
                        {/* Plus Button - Sticky to right */}
                        <div className="sticky right-0 z-10 pl-2 flex items-center gap-2 flex-shrink-0 h-full">
                            <button onClick={addVersion} className="p-1.5 rounded-md bg-white/5 text-slate-500 hover:bg-white/10 transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
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

    useEffect(() => {
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
                            tags: b.categories ? b.categories.map((code: number) => (BLOCK_CATEGORY_MAP as Record<number, string>)[code] || '기타') : [],
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

    const handleGlobalGenerate = async () => {
        if (!recruitmentId && !coverLetterId) {
            alert("공고 정보나 자소서 정보가 없어 생성할 수 없습니다.");
            return;
        }

        // If items are selected, show confirmation modal first
        if (globalReferencedCLs.length > 0 && !isSelectionModalOpen) {
            setIsSelectionModalOpen(true);
            return;
        }

        await executeGeneration();
    };

    const executeGeneration = async () => {
        setIsSelectionModalOpen(false);
        setIsGenerating(true);
        try {
            // Construct Request Body
            // We need recruitmentId. If missing (Archive mode), we rely on coverLetterId context?
            // But API requires recruitmentId. Check if we have it from searchParams.
            // If strictly from archive without recruitmentId param, we might fail.
            // But CoverLetterListPage passes it.

            const essays = jobQuestions.map(q => {
                const answerState = answers[q.id];
                const currentVersion = answerState.versions[answerState.currentVersionIndex];

                // Ensure we have a valid numeric ID for the essay
                const essayIdNum = Number(currentVersion.id);
                if (isNaN(essayIdNum)) {
                    console.warn(`Skipping generation for ${q.id}: Invalid Essay ID ${currentVersion.id}. Is it a temp ID?`);
                    return null;
                }

                // Combine global request and per-question request
                const userPrompt = [globalRequest, perQuestionRequests[q.id]].filter(Boolean).join('\n\n추가 요청: ');

                return {
                    essayId: essayIdNum,
                    referenceBlocks: droppedBlocks[q.id]?.map(b => Number(b.id)) || [],
                    essayContent: currentVersion.content || "",
                    userPrompt: userPrompt
                };
            }).filter((item): item is NonNullable<typeof item> => item !== null);

            if (essays.length === 0) {
                alert("생성 가능한 문항이 없습니다. (유효한 자소서 ID가 없음)");
                setIsGenerating(false);
                return;
            }

            const requestBody = {
                recruitmentId: Number(recruitmentId), // What if null?
                referenceCoverletters: globalReferencedCLs.map(cl => Number(cl.id)),
                essays: essays
            };

            console.log("🚀 AI Generation Request Body:", JSON.stringify(requestBody, null, 2));

            // Call API
            const { generateAiCoverLetter } = await import('../api/coverLetter');
            const response = await generateAiCoverLetter(requestBody);

            console.log("✅ AI Generation Response:", response);

            // Response: { data: { results: [...], summary: ... } }
            // Or response.data depending on how generateAiCoverLetter returns. 
            // In api/coverLetter.js: returns response.data directly. So response IS the payload.
            const results = (response as any).data?.results || (response as any).results;

            if (results) {
                const newAnswersState = { ...answers };

                // Updated Logic:
                // 1. Create a map of `requestEssayId` -> `questionId` (frontend q-id).
                const requestIdToQId: any = {};
                essays.forEach(e => {
                    // Find qId that has this essayId as current
                    const qId = jobQuestions.find(q =>
                        answers[q.id].versions[answers[q.id].currentVersionIndex].id == e.essayId
                    )?.id;
                    if (qId) requestIdToQId[e.essayId] = qId;
                });

                // Apply results in order
                results.forEach((result: any, idx: number) => {
                    if (!result.content) return; // Warning?

                    // Get corresponding request item to find Question ID
                    const requestItem = essays[idx];
                    if (!requestItem) return;
                    // Find Q ID
                    const qId = requestIdToQId[requestItem.essayId];

                    if (qId && newAnswersState[qId]) {
                        const newVersion = {
                            id: String(result.essayId),
                            versionNumber: result.version,
                            content: result.content,
                            isNew: true
                        };
                        newAnswersState[qId].versions.push(newVersion);
                        newAnswersState[qId].currentVersionIndex = newAnswersState[qId].versions.length - 1;
                    }
                });

                setAnswers(newAnswersState);
            }

            setHasGeneratedCoverLetter(true);
        } catch (error) {
            console.error(error);
            alert("AI 자소서 생성 중 오류가 발생했습니다.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Alias for block based since logic defines the prompt
    const handleBlockBasedGenerate = handleGlobalGenerate;

    const handleRegenerate = async (questionId: string) => {
        if (!recruitmentId && !coverLetterId) return;

        setRegeneratingQuestionId(questionId);
        try {
            const answerState = answers[questionId];
            const currentVersion = answerState.versions[answerState.currentVersionIndex];
            const essayIdNum = Number(currentVersion.id);

            // If it's a temp ID, we might need to handle it or show error.
            // But usually for regeneration, we should have an ID if it was previously saved.
            // If not, we might need to use recruitmentId if available.

            const userPrompt = [globalRequest, perQuestionRequests[questionId]].filter(Boolean).join('\n\n추가 요청: ');

            const requestBody = {
                recruitmentId: Number(recruitmentId),
                referenceCoverletters: globalReferencedCLs.map(cl => Number(cl.id)),
                essays: [{
                    essayId: isNaN(essayIdNum) ? 0 : essayIdNum, // 0 might mean "create new or handle by index"
                    referenceBlocks: droppedBlocks[questionId]?.map(b => Number(b.id)) || [],
                    essayContent: currentVersion.content || "",
                    userPrompt: userPrompt
                }]
            };

            const { generateAiCoverLetter } = await import('../api/coverLetter');
            const response = await generateAiCoverLetter(requestBody);
            const results = (response as any).data?.results || (response as any).results;

            if (results && results[0]) {
                const result = results[0];
                const newVersion = {
                    id: String(result.essayId),
                    versionNumber: result.version,
                    content: result.content,
                    isNew: true
                };

                setAnswers((prev: any) => {
                    const qState = prev[questionId];
                    const nextVersions = [...qState.versions, newVersion];
                    return {
                        ...prev,
                        [questionId]: {
                            ...qState,
                            versions: nextVersions,
                            currentVersionIndex: nextVersions.length - 1
                        }
                    };
                });
            }
        } catch (error) {
            console.error("Failed to regenerate:", error);
            alert("AI 재생성 중 오류가 발생했습니다.");
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
            if (!window.confirm(`"${headerInfo.title}" 자소서를 최종 저장하시겠습니까?\n저장 후에는 '작성 완료' 상태가 되며, 목록에서 체크 표시(✅)가 뜹니다.`)) {
                return;
            }
        }

        try {
            await updateCoverLetter(coverLetterId, {
                title: headerInfo.title,
                isComplete: isFinal, // Final=true, Temp=false (implies WIP)
                isPassed: null,
                essays: jobQuestions.map(q => {
                    const answerFn = answers[q.id];
                    const currentVer = answerFn.versions[answerFn.currentVersionIndex];
                    const eId = Number(currentVer.id);
                    return {
                        id: isNaN(eId) ? 0 : eId,
                        content: currentVer.content
                    };
                })
            });

            if (isFinal) {
                alert('자소서가 최종 저장되었습니다!');
                navigate('/cover-letter');
            } else {
                alert('임시 저장되었습니다.');
                // Update local state if needed
                setHeaderInfo(prev => ({ ...prev, isComplete: false }));
            }
        } catch (err) {
            console.error(err);
            alert(isFinal ? '최종 저장에 실패했습니다.' : '임시 저장에 실패했습니다.');
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
                <div className="w-80 flex flex-col glass-panel p-4 sticky top-6 self-start h-[calc(100vh-140px)] sticky-sidebar">
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
                                        onChange={(e) => setEditedTitle(e.target.value)}
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
                        {activeTab === 'coverLetter' && (
                            <div className="flex items-center gap-2 mb-6">
                                <h2 className="font-bold text-xl text-white">자소서 생성 정보</h2>
                                <div className="group relative">
                                    <HelpCircle className="w-5 h-5 text-slate-500 cursor-help hover:text-slate-300 transition-colors" />
                                    <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-slate-800 border border-white/10 rounded-xl text-xs leading-relaxed text-slate-300 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                        <p>왼쪽 목록에서 참고할 자소서를 클릭하여 선택하세요. 선택된 자소서들이 AI 생성의 컨텍스트가 됩니다.</p>
                                        <div className="absolute left-4 bottom-full border-4 border-transparent border-b-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-8">
                            {jobQuestions.map((q, index) => (
                                <div key={q.id}>
                                    <h3 className="font-bold text-lg text-white mb-2">{q.text}</h3>

                                    {/* Conditional Rendering of AnswerEditor */}
                                    {(activeTab === 'blocks' || (activeTab === 'coverLetter' && hasGeneratedCoverLetter) || answers[q.id]?.versions[0]?.content) && (
                                        <AnswerEditor q={q} answerState={answers[q.id]} onStateChange={(newState) => handleAnswerStateChange(q.id, newState)} onRegenerate={handleRegenerate} isRegenerating={regeneratingQuestionId === q.id} />
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
        </div >
    );
};

export default AiGeneratorPage;
