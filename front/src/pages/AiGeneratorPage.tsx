import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { FileText, Blocks, BrainCircuit, Loader, CheckCircle, X, Tag, Plus, RefreshCw } from 'lucide-react';
import useTypewriter from '../hooks/useTypewriter';
import { experienceBlocks as mockBlocks } from '../api/mock/experienceBlocksData';
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

// --- Mock Data & Initial Setup ---
const jobQuestions = [
    { id: 'q1', text: '본인의 성장 과정을 구체적으로 서술해주세요. (1000자)' },
    { id: 'q2', text: '팀의 목표 달성을 위해 헌신했던 경험에 대해 이야기해주세요. (800자)' },
    { id: 'q3', text: '지원 직무에 필요한 역량을 갖추기 위해 어떤 노력을 했나요? (900자)' },
];

const pastCoverLettersData: DraggableItemData[] = [
    { id: 'cl1', company: '네이버', role: '프론트엔드 개발자', date: '2023-10-05' },
    { id: 'cl2', company: '카카오', role: '백엔드 개발자', date: '2023-08-12' },
    { id: 'cl3', company: '토스', role: 'Product Designer', date: '2023-09-01' },
    { id: 'cl4', company: '쿠팡', role: '물류 시스템', date: '2023-09-15' },
    { id: 'cl5', company: '당근마켓', role: 'iOS 개발자', date: '2023-10-10' },
];

const createInitialAnswersState = () => {
    const state: any = {};
    jobQuestions.forEach(q => {
        state[q.id] = {
            currentVersionIndex: 0,
            versions: [{ id: `v${Date.now()}`, versionNumber: 1, content: '' }],
        };
    });
    return state;
};

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
    const typedText = useTypewriter(isUserTyping ? '' : currentVersion.content); // Only run typewriter if user is not typing

    const [displayContent, setDisplayContent] = useState('');

    useEffect(() => {
        // When version content changes from generation, reset user typing flag and start typewriter
        setIsUserTyping(false);
        setDisplayContent(''); // Reset display content to trigger typewriter
    }, [currentVersion.id]); // Depend on version ID to detect a new version

    useEffect(() => {
        if (!isUserTyping) {
            setDisplayContent(typedText);
        }
    }, [typedText, isUserTyping]);

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
    const [activeTab, setActiveTab] = useState<'coverLetter' | 'blocks'>('coverLetter');
    const [pastCoverLetters] = useState<DraggableItemData[]>(pastCoverLettersData);
    const [userBlocks] = useState<DraggableItemData[]>(mockBlocks); // Assuming mockBlocks structure matches DraggableItemData roughly

    // State
    const [globalReferencedCLs, setGlobalReferencedCLs] = useState<DraggableItemData[]>([]);
    const [globalRequest, setGlobalRequest] = useState('');
    const [droppedBlocks, setDroppedBlocks] = useState<{ [key: string]: DraggableItemData[] }>(() => {
        const initial: { [key: string]: DraggableItemData[] } = {};
        jobQuestions.forEach(q => { initial[q.id] = []; });
        return initial;
    });
    const [perQuestionRequests, setPerQuestionRequests] = useState<{ [key: string]: string }>({});

    // New unified answers state
    const [answers, setAnswers] = useState<any>(createInitialAnswersState);
    const [isGenerating, setIsGenerating] = useState(false);
    const [regeneratingQuestionId, setRegeneratingQuestionId] = useState<string | null>(null);
    const [hasGeneratedCoverLetter, setHasGeneratedCoverLetter] = useState(false); // New state for cover letter generation

    const [activeId, setActiveId] = useState<string | null>(null);

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

    const addNewVersionToQuestion = (questionId: string, content: string) => {
        const questionState = answers[questionId];
        const newVersionNumber = questionState.versions.length > 0 ? Math.max(...questionState.versions.map((v: any) => v.versionNumber)) + 1 : 1;
        const newVersion = { id: `v${Date.now()}`, versionNumber: newVersionNumber, content };
        const newVersions = [...questionState.versions, newVersion];
        return {
            currentVersionIndex: newVersions.length - 1,
            versions: newVersions,
        };
    };

    const handleGlobalGenerate = () => {
        setIsGenerating(true);
        if (hasGeneratedCoverLetter) { // If we've generated before, just add new versions
            setTimeout(() => {
                const newAnswersState = { ...answers };
                const context = `참고 자료: ${globalReferencedCLs.map(cl => cl.company).join(', ')}. 추가 요청: ${globalRequest || '없음'}.`;
                jobQuestions.forEach(q => {
                    const newContent = `[AI 생성 답변 for ${q.text.substring(0, 10)}...] ${context}`;
                    newAnswersState[q.id] = addNewVersionToQuestion(q.id, newContent);
                });
                setAnswers(newAnswersState);
                setIsGenerating(false);
            }, 2000);
        } else { // First time generating
            setTimeout(() => {
                const newAnswersState = { ...answers };
                const context = `참고 자료: ${globalReferencedCLs.map(cl => cl.company).join(', ')}. 추가 요청: ${globalRequest || '없음'}.`;
                jobQuestions.forEach(q => {
                    const newContent = `[AI 생성 답변 for ${q.text.substring(0, 10)}...] ${context}`;
                    // Replace the content of the first version instead of adding a new one
                    newAnswersState[q.id].versions[0].content = newContent;
                });
                setAnswers(newAnswersState);
                setHasGeneratedCoverLetter(true); // Set flag to show editors
                setIsGenerating(false);
            }, 2000);
        }
    };

    const handleBlockBasedGenerate = () => {
        // ... (block generation logic is unchanged, creates new versions)
        setIsGenerating(true);
        setTimeout(() => {
            const newAnswersState = { ...answers };
            jobQuestions.forEach(q => {
                const blockContext = droppedBlocks[q.id]?.length > 0 ? `사용된 블록: ${droppedBlocks[q.id].map(b => b.title).join(', ')}.` : '';
                const requestContext = perQuestionRequests[q.id] ? `추가 요청: ${perQuestionRequests[q.id]}` : '';
                const newContent = `[AI 블록 기반 답변 for ${q.text.substring(0, 10)}...] ${blockContext} ${requestContext}`;
                newAnswersState[q.id] = addNewVersionToQuestion(q.id, newContent);
            });
            setAnswers(newAnswersState);
            setIsGenerating(false);
        }, 2000);
    };

    const handleRegenerate = (questionId: string) => {
        setRegeneratingQuestionId(questionId);
        setTimeout(() => {
            const newContent = `[AI 재생성 답변 for ${answers[questionId].versions[answers[questionId].currentVersionIndex].content.substring(0, 15)}...]`;
            const newQuestionState = addNewVersionToQuestion(questionId, newContent);
            setAnswers((prev: any) => ({ ...prev, [questionId]: newQuestionState }));
            setRegeneratingQuestionId(null);
        }, 1500);
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


    return (
        <div className="ai-generator-container">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {/* Left Panel */}
                <div className="w-80 flex flex-col glass-panel p-4">
                    <div className="flex mb-4 gap-2">
                        <TabButton id="coverLetter" activeTab={activeTab} onClick={setActiveTab} icon={<FileText />} label="자소서" />
                        <TabButton id="blocks" activeTab={activeTab} onClick={setActiveTab} icon={<Blocks />} label="블록" />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-3">
                            {(activeTab === 'coverLetter' ? pastCoverLetters : userBlocks).map(item => <DraggableItem key={item.id} item={item} type={activeTab} />)}
                        </div>
                    </div>
                </div>

                {/* Right Panel (Workspace) */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 glass-panel p-6 overflow-y-auto custom-scrollbar">
                        {activeTab === 'coverLetter' && (
                            <>
                                <h2 className="font-bold text-xl text-white mb-2">자소서 선택</h2>
                                <p className="text-slate-400 mb-4">참고할 과거 자소서를 선택하여 AI에게 더 풍부한 컨텍스트를 제공하세요.</p>
                                <GlobalCLDropZone droppedItems={globalReferencedCLs} onRemove={(id) => setGlobalReferencedCLs(p => p.filter(cl => cl.id !== id))} />
                                <textarea value={globalRequest} onChange={e => setGlobalRequest(e.target.value)} placeholder="전체 자소서 생성을 위한 추가 요청사항 (톤앤매너, 강조할 점 등)" className="custom-textarea mt-4 h-24" />
                                <div className="my-8 border-t border-white/10"></div>
                            </>
                        )}

                        <div className="space-y-8">
                            {jobQuestions.map((q, index) => (
                                <div key={q.id}>
                                    <h3 className="font-bold text-lg text-white mb-2">{index + 1}. {q.text}</h3>

                                    {/* Conditional Rendering of AnswerEditor */}
                                    {(activeTab === 'blocks' || (activeTab === 'coverLetter' && hasGeneratedCoverLetter)) && (
                                        <AnswerEditor q={q} answerState={answers[q.id]} onStateChange={(newState) => handleAnswerStateChange(q.id, newState)} onRegenerate={handleRegenerate} isRegenerating={regeneratingQuestionId === q.id} />
                                    )}

                                    {activeTab === 'blocks' && (
                                        <div className="mt-4">
                                            <BlockDropZone questionId={q.id} blocks={droppedBlocks[q.id] || []} onRemove={(qId, bId) => setDroppedBlocks(p => ({ ...p, [qId]: p[qId].filter(b => b.id !== bId) }))} />
                                            <textarea value={perQuestionRequests[q.id]} onChange={e => setPerQuestionRequests(p => ({ ...p, [q.id]: e.target.value }))} placeholder="이 문항에 대한 추가 요청사항을 입력하세요." className="custom-textarea mt-3" />
                                        </div>
                                    )}
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
            </DndContext>
        </div>
    );
};

export default AiGeneratorPage;
