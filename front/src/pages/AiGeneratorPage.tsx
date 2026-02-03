import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { FileText, Blocks, BrainCircuit, Loader, CheckCircle, X, Tag, Plus, RefreshCw, Save } from 'lucide-react';
import useTypewriter from '../hooks/useTypewriter';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getRecruitmentDetail } from '../api/recruitment';
import { getCoverLetters, getBlocks, getCoverLetterDetail, updateCoverLetter } from '../api/coverLetter';
import './AiGeneratorPage.css';

// --- Types ---
interface DraggableItemData {
    id: string;
    company?: string; // for coverLetter
    role?: string;    // for coverLetter
    date?: string;    // for coverLetter
    title?: string;   // for blocks
    tags?: string[];   // for blocks
}

// --- Sub-Components ---
interface AnswerEditorProps {
    q: { id: string, text: string };
    answerState: any;
    onStateChange: (newState: any) => void;
    onRegenerate: (id: string) => void;
    isRegenerating: boolean;
}

const AnswerEditor: React.FC<AnswerEditorProps> = ({ q, answerState, onStateChange, onRegenerate, isRegenerating }) => {
    const { currentVersionIndex, versions } = answerState;
    const currentVersion = versions[currentVersionIndex];

    // State to manage typewriter effect vs. user input
    const [isUserTyping, setIsUserTyping] = useState(false);
    const typedText = useTypewriter(isUserTyping ? '' : (currentVersion.content || '').trimStart());

    const [displayContent, setDisplayContent] = useState('');

    useEffect(() => {
        // When version content changes
        setIsUserTyping(false);
        // If it's a new AI generation (isNew=true), start typewriter by resetting display
        // If it's existing content (isNew=false), show immediately
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
        // When user types, update the state immediately and stop typewriter effect
        if (!isUserTyping) setIsUserTyping(true);

        const newContent = e.target.value;
        setDisplayContent(newContent);

        const newVersions = [...versions];
        newVersions[currentVersionIndex] = { ...currentVersion, content: newContent };
        onStateChange({ ...answerState, versions: newVersions });
    };

    const handleVersionSwitch = (index: number) => {
        onStateChange({ ...answerState, currentVersionIndex: index });
    };

    const addVersion = () => {
        const newVersionNumber = versions.length > 0 ? Math.max(...versions.map((v: any) => v.versionNumber)) + 1 : 1;
        const newVersions = [...versions, { id: `v${Date.now()}`, versionNumber: newVersionNumber, content: '' }];
        onStateChange({ currentVersionIndex: newVersions.length - 1, versions: newVersions });
    };

    return (
        <div className="mt-4">
            <div className="flex items-center gap-1 mb-2">
                {versions.map((v: any, index: number) => (
                    <button key={v.id} onClick={() => handleVersionSwitch(index)}
                        className={`version-btn ${index === currentVersionIndex ? 'active' : 'inactive'}`}>
                        v{v.versionNumber}
                    </button>
                ))}
                <button onClick={addVersion} className="p-1.5 rounded-md bg-white/5 text-slate-500 hover:bg-white/10 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="relative">
                {isRegenerating && <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center rounded-md z-10 backdrop-blur-sm"><Loader className="animate-spin text-[#7184e6]" /></div>}
                <textarea
                    value={displayContent}
                    onChange={handleContentChange}
                    placeholder="이곳에 답변이 생성됩니다."
                    className="custom-textarea h-40"
                />
                <button onClick={() => onRegenerate(q.id)} disabled={isRegenerating}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 btn-secondary disabled:opacity-50">
                    <RefreshCw className="w-4 h-4" />
                    다시 생성
                </button>
            </div>
        </div>
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
    const [headerInfo, setHeaderInfo] = useState<{ company: string, title: string }>({ company: '', title: '' });

    const [activeId, setActiveId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Job Questions (Prioritize CoverLetter Detail if ID exists, else Recruitment)
                if (coverLetterId) {
                    const { data } = await getCoverLetterDetail(coverLetterId);
                    const detailData = (data as any).data || data;

                    if (detailData.essayList) {
                        // Real Backend
                        const questions = detailData.essayList.map((essay: any, idx: number) => ({
                            id: `q-${idx}`,
                            text: essay.question
                        }));
                        setJobQuestions(questions);

                        // Set Header Info
                        setHeaderInfo({
                            company: detailData.companyName || '기업명 미상',
                            title: detailData.jobType || detailData.title || '직무 미정'
                        });

                        const initialAnswers: any = {};
                        questions.forEach((q: any, idx: number) => {
                            const versions = detailData.essayList[idx].versions || [];
                            const mappedVersions = versions.length > 0
                                ? versions.map((v: any, vIdx: number) => ({
                                    id: v.id ? String(v.id) : `v-${Date.now()}-${idx}-${vIdx}`,
                                    versionNumber: v.version || vIdx + 1,
                                    content: v.content || ''
                                }))
                                : [{ id: `v-${Date.now()}-${idx}`, versionNumber: 1, content: '' }];

                            initialAnswers[`q-${idx}`] = {
                                currentVersionIndex: mappedVersions.length - 1,
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
                            text: q.q || q.question
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
                            text: q.content || q.question
                        }));
                        setJobQuestions(questions);

                        // Set Header Info
                        setHeaderInfo({
                            company: recruitmentData.company?.name || recruitmentData.companyName || '기업명 로딩 중...',
                            title: recruitmentData.jobType || recruitmentData.title || '직무 미정'
                        });

                        const initialAnswers: any = {};
                        questions.forEach((q: any) => {
                            initialAnswers[q.id] = {
                                currentVersionIndex: 0,
                                versions: [{ id: `v-${Date.now()}-${q.id}`, versionNumber: 1, content: '' }],
                            };
                        });
                        setAnswers(initialAnswers);

                        // Set Header Info
                        setHeaderInfo({
                            company: recruitmentData.company?.name || recruitmentData.companyName || '기업명 로딩 중...',
                            title: recruitmentData.title || '공고 제목 없음'
                        });

                        const initialBlocks: { [key: string]: DraggableItemData[] } = {};
                        questions.forEach((q: any) => { initialBlocks[q.id] = []; });
                        setDroppedBlocks(initialBlocks);
                    }
                }

                // 2. Fetch Past Cover Letters
                const clResponse: any = await getCoverLetters(0, 50);
                // API now returns items array directly, or { data: [...], items: [...] }
                const items = Array.isArray(clResponse) ? clResponse : (clResponse?.items || clResponse?.data || []);
                if (items.length > 0) {
                    const mappedCLs = items.map((cl: any) => ({
                        id: String(cl.id),
                        company: cl.companyName || cl.title || 'Untitled',
                        role: cl.jobType || cl.title || '직무 미정',
                        date: new Date(cl.createdAt || Date.now()).toLocaleDateString()
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

        loadData();
    }, [recruitmentId, coverLetterId]);

    const handleDragStart = (event: any) => setActiveId(event.active.id);

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const droppedItem = (active.data.current as unknown as { item: DraggableItemData })?.item;
        if (!droppedItem) return;

        if (activeTab === 'coverLetter' && over.id === 'global-cl-drop-zone') {
            if (!globalReferencedCLs.some(cl => cl.id === droppedItem.id)) {
                setGlobalReferencedCLs(prev => [...prev, droppedItem]);
            }
        } else if (activeTab === 'blocks' && jobQuestions.some(q => q.id === over.id)) {
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

    const handleSave = async () => {
        if (!coverLetterId) return;

        if (!window.confirm(`"${headerInfo.title}" 자소서를 최종 저장하시겠습니까?\n저장 후에는 '작성 완료' 상태가 되며, 목록에서 체크 표시(✅)가 뜹니다.`)) {
            return;
        }

        try {
            await updateCoverLetter(coverLetterId, {
                title: headerInfo.title,
                isComplete: true,
                isPassed: null,
                essays: jobQuestions.map(q => {
                    const answerFn = answers[q.id];
                    const currentVer = answerFn.versions[answerFn.currentVersionIndex];
                    // We need a valid ID. If it's a temp ID (starts with v), we can't update it easily unless backend accepts 0 or handles it.
                    // But here we are saving *existing* structure usually.
                    // If AI added new answers, they might have temp IDs?
                    // Wait, handleGlobalGenerate assigns essayId from backend response.
                    // So they should have IDs.
                    // If it's a purely new question added frontend-side? (Not possible in current UI)
                    // So we try to parse ID.
                    const eId = Number(currentVer.id);
                    return {
                        id: isNaN(eId) ? 0 : eId, // 0 might mean "create" if backend supports, or it might fail if ID is required
                        content: currentVer.content
                    };
                })
            });
            alert('자소서가 최종 저장되었습니다!');
            navigate('/cover-letter');
        } catch (err) {
            console.error(err);
            alert('최종 저장에 실패했습니다.');
        }
    };

    // Unchanged Draggable/UI components
    const DraggableItem = ({ item, type }: { item: DraggableItemData, type: string }) => {
        const { attributes, listeners, setNodeRef } = useDraggable({ id: item.id, data: { item, type } });
        return (<div ref={setNodeRef} {...listeners} {...attributes} className="draggable-item"> {type === 'coverLetter' ? (<><p className="font-bold">{item.company}</p><p className="text-sm">{item.role}</p></>) : (<><div className="flex items-center gap-2 mb-2">{item.tags?.map(tag => (<span key={tag} className="tag-badge flex items-center gap-1"><Tag className="w-3 h-3" />{tag}</span>))}</div><p className="font-semibold text-slate-200 mb-1">{item.title}</p></>)} </div>);
    };

    const GlobalCLDropZone = ({ droppedItems, onRemove }: { droppedItems: DraggableItemData[], onRemove: (id: string) => void }) => {
        const { setNodeRef, isOver } = useDroppable({ id: 'global-cl-drop-zone' });
        return (<div ref={setNodeRef} className={`drop-zone ${isOver ? 'active' : ''}`}> {droppedItems.length > 0 ? (droppedItems.map(item => (<div key={item.id} className="dropped-chip">{item.company}<button onClick={() => onRemove(item.id)}><X className="w-4 h-4" /></button></div>))) : (<p className="text-slate-500 w-full text-center">이곳으로 과거 자소서를 드래그하여 참고 자료로 추가하세요</p>)} </div>);
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
                {/* Left Panel */}
                <div className="w-80 flex flex-col glass-panel p-4">
                    <div className="flex mb-4 gap-2 shrink-0">
                        <TabButton id="coverLetter" activeTab={activeTab} onClick={setActiveTab} icon={<FileText />} label="자소서" />
                        <TabButton id="blocks" activeTab={activeTab} onClick={setActiveTab} icon={<Blocks />} label="블록" />
                    </div>
                    {/* Scrollable list with max height constraint (approx 6 items) */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '520px' }}>
                        <div className="space-y-3 pb-4">
                            {(activeTab === 'coverLetter' ? pastCoverLetters : userBlocks).map(item => <DraggableItem key={item.id} item={item} type={activeTab} />)}
                        </div>
                    </div>
                </div>

                {/* Right Panel (Workspace) */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header Info */}
                    {(headerInfo.company || headerInfo.title) && (
                        <div className="bg-slate-800/50 p-4 border-b border-white/10 flex flex-col justify-center shrink-0">
                            <h2 className="text-xl font-bold text-white leading-tight">{headerInfo.company}</h2>
                            <p className="text-slate-400 text-sm mt-1">{headerInfo.title}</p>
                        </div>
                    )}

                    <div className="flex-1 glass-panel p-6 overflow-y-auto custom-scrollbar">
                        {activeTab === 'coverLetter' && (
                            <>
                                <h2 className="font-bold text-xl text-white mb-2">자소서 선택</h2>
                                <p className="text-slate-400 mb-4">참고할 과거 자소서를 선택하여 AI에게 더 풍부한 컨텍스트를 제공하세요.</p>

                                {/* Limited height container for dropped items if it gets too long? 
                                    Actually user wants the LEFT list to be scrollable.
                                    "기존 자소서도 한 6개 정도 보이는 선에서 스크롤 되게 해줘" could mean the Draggable Source List.
                                    Let's check the Left Panel structure.
                                */}
                                <GlobalCLDropZone droppedItems={globalReferencedCLs} onRemove={(id) => setGlobalReferencedCLs(p => p.filter(cl => cl.id !== id))} />
                                <textarea value={globalRequest} onChange={e => setGlobalRequest(e.target.value)} placeholder="전체 자소서 생성을 위한 추가 요청사항 (톤앤매너, 강조할 점 등)" className="custom-textarea mt-4 h-24" />
                                <div className="my-8 border-t border-white/10"></div>
                            </>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4">
                        <button onClick={activeTab === 'coverLetter' ? handleGlobalGenerate : handleBlockBasedGenerate} disabled={isGenerating} className="w-full btn-primary">
                            {isGenerating ? <Loader className="animate-spin" /> : <BrainCircuit />}
                            <span>{isGenerating ? 'AI 자소서 생성 중...' : '✨ AI 자소서 생성'}</span>
                        </button>
                    </div>
                    {isAllCompleted && (
                        <div className="pt-2 pb-4">
                            <button
                                onClick={handleSave}
                                className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 animate-pulse"
                            >
                                <Save className="w-5 h-5" />
                                <span>최종 저장 및 나가기</span>
                            </button>
                        </div>
                    )}
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
            </DndContext >
        </div >
    );
};

export default AiGeneratorPage;
