import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { FileText, Blocks, BrainCircuit, Loader, CheckCircle, X, Tag, Plus, RefreshCw } from 'lucide-react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook
import { experienceBlocks as mockBlocks } from '../api/mock/experienceBlocksData';

// --- Mock Data & Initial Setup ---
const jobQuestions = [
    { id: 'q1', text: '본인의 성장 과정을 구체적으로 서술해주세요. (1000자)' },
    { id: 'q2', text: '팀의 목표 달성을 위해 헌신했던 경험에 대해 이야기해주세요. (800자)' },
    { id: 'q3', text: '지원 직무에 필요한 역량을 갖추기 위해 어떤 노력을 했나요? (900자)' },
];

const pastCoverLettersData = [
    { id: 'cl1', company: '네이버', role: '프론트엔드 개발자', date: '2023-10-05' },
    { id: 'cl2', company: '카카오', role: '백엔드 개발자', date: '2023-08-12' },
    // ... more data
];

const createInitialAnswersState = () => {
    const state = {};
    jobQuestions.forEach(q => {
        state[q.id] = {
            currentVersionIndex: 0,
            versions: [{ id: `v${Date.now()}`, versionNumber: 1, content: '' }],
        };
    });
    return state;
};

// --- Sub-Components ---
const AnswerEditor = ({ q, answerState, onStateChange, onRegenerate, isRegenerating }) => {
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

    const handleContentChange = (e) => {
        // When user types, update the state immediately and stop typewriter effect
        if (!isUserTyping) setIsUserTyping(true);
        
        const newContent = e.target.value;
        setDisplayContent(newContent);

        const newVersions = [...versions];
        newVersions[currentVersionIndex] = { ...currentVersion, content: newContent };
        onStateChange({ ...answerState, versions: newVersions });
    };

    const handleVersionSwitch = (index) => {
        onStateChange({ ...answerState, currentVersionIndex: index });
    };

    const addVersion = () => {
        const newVersionNumber = versions.length > 0 ? Math.max(...versions.map(v => v.versionNumber)) + 1 : 1;
        const newVersions = [...versions, { id: `v${Date.now()}`, versionNumber: newVersionNumber, content: '' }];
        onStateChange({ currentVersionIndex: newVersions.length - 1, versions: newVersions });
    };

    return (
        <div className="mt-4">
            <div className="flex items-center gap-1 mb-2">
                {versions.map((v, index) => (
                    <button key={v.id} onClick={() => handleVersionSwitch(index)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${index === currentVersionIndex ? 'bg-[#7184e6] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        v{v.versionNumber}
                    </button>
                ))}
                <button onClick={addVersion} className="p-1.5 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="relative">
                {isRegenerating && <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md z-10"><Loader className="animate-spin text-[#7184e6]" /></div>}
                <textarea
                    value={displayContent}
                    onChange={handleContentChange}
                    placeholder="이곳에 답변이 생성됩니다."
                    className="w-full h-40 p-3 bg-white border border-slate-200 rounded-md text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <button onClick={() => onRegenerate(q.id)} disabled={isRegenerating}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-all disabled:bg-slate-200 disabled:text-slate-400">
                    <RefreshCw className="w-4 h-4" />
                    다시 생성
                </button>
            </div>
        </div>
    );
};

// --- Main Editor Component ---
const CoverLetterEditor = () => {
    const [activeTab, setActiveTab] = useState('coverLetter');
    const [pastCoverLetters] = useState(pastCoverLettersData);
    const [userBlocks] = useState(mockBlocks);

    // State
    const [globalReferencedCLs, setGlobalReferencedCLs] = useState([]);
    const [globalRequest, setGlobalRequest] = useState('');
    const [droppedBlocks, setDroppedBlocks] = useState(() => {
        const initial = {};
        jobQuestions.forEach(q => { initial[q.id] = []; });
        return initial;
    });
    const [perQuestionRequests, setPerQuestionRequests] = useState({});
    
    // New unified answers state
    const [answers, setAnswers] = useState(createInitialAnswersState);
    const [isGenerating, setIsGenerating] = useState(false);
    const [regeneratingQuestionId, setRegeneratingQuestionId] = useState(null);
    const [hasGeneratedCoverLetter, setHasGeneratedCoverLetter] = useState(false); // New state for cover letter generation

    const [activeId, setActiveId] = useState(null);

    const handleDragStart = (event) => setActiveId(event.active.id);

    const handleDragEnd = (event) => {
        // ... (drag and drop logic is unchanged)
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;
        const droppedItem = active.data.current?.item;
        if (!droppedItem) return;

        if (activeTab === 'coverLetter' && over.id === 'global-cl-drop-zone') {
            if (!globalReferencedCLs.some(cl => cl.id === droppedItem.id)) {
                setGlobalReferencedCLs(prev => [...prev, droppedItem]);
            }
        } else if (activeTab === 'blocks' && jobQuestions.some(q => q.id === over.id)) {
            if (!droppedBlocks[over.id]?.some(b => b.id === droppedItem.id)) {
                setDroppedBlocks(prev => ({...prev, [over.id]: [...(prev[over.id] || []), droppedItem]}));
            }
        }
    };

    const handleAnswerStateChange = (questionId, newState) => {
        setAnswers(prev => ({...prev, [questionId]: newState}));
    };
    
    const addNewVersionToQuestion = (questionId, content) => {
        const questionState = answers[questionId];
        const newVersionNumber = questionState.versions.length > 0 ? Math.max(...questionState.versions.map(v => v.versionNumber)) + 1 : 1;
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
                    const newContent = `[AI 생성 답변 for ${q.text.substring(0,10)}...] ${context}`;
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
                    const newContent = `[AI 생성 답변 for ${q.text.substring(0,10)}...] ${context}`;
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
                const newContent = `[AI 블록 기반 답변 for ${q.text.substring(0,10)}...] ${blockContext} ${requestContext}`;
                newAnswersState[q.id] = addNewVersionToQuestion(q.id, newContent);
            });
            setAnswers(newAnswersState);
            setIsGenerating(false);
         }, 2000);
    };

    const handleRegenerate = (questionId) => {
        // ... (regeneration logic is unchanged, creates new versions)
        setRegeneratingQuestionId(questionId);
        setTimeout(() => {
            const newContent = `[AI 재생성 답변 for ${answers[questionId].versions[answers[questionId].currentVersionIndex].content.substring(0, 15)}...]`;
            const newQuestionState = addNewVersionToQuestion(questionId, newContent);
            setAnswers(prev => ({ ...prev, [questionId]: newQuestionState }));
            setRegeneratingQuestionId(null);
        }, 1500);
    };
    
    // Unchanged Draggable/UI components
    const DraggableItem = ({ item, type }) => {
        const { attributes, listeners, setNodeRef } = useDraggable({ id: item.id, data: { item, type } });
        return ( <div ref={setNodeRef} {...listeners} {...attributes} className="bg-white border border-slate-200 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-400 transition-all duration-200"> {type === 'coverLetter' ? ( <><p className="font-bold text-slate-800">{item.company}</p><p className="text-sm text-slate-500">{item.role}</p></> ) : ( <><div className="flex items-center gap-2 mb-2">{item.tags.map(tag => (<span key={tag} className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Tag className="w-3 h-3" />{tag}</span>))}</div><p className="font-semibold text-slate-800 mb-1">{item.title}</p></> )} </div> );
    };
    const GlobalCLDropZone = ({ droppedItems, onRemove }) => {
        const { setNodeRef, isOver } = useDroppable({ id: 'global-cl-drop-zone' });
        return ( <div ref={setNodeRef} className={`min-h-[100px] flex flex-wrap gap-2 items-center content-start border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${isOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50/50'}`}> {droppedItems.length > 0 ? ( droppedItems.map(item => (<div key={item.id} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full">{item.company}<button onClick={() => onRemove(item.id)} className="text-blue-600 hover:text-blue-900"><X className="w-4 h-4" /></button></div>)) ) : (<p className="text-slate-400 w-full text-center">이곳으로 과거 자소서를 드래그하여 참고 자료로 추가하세요</p>)} </div> );
    };
    const BlockDropZone = ({ questionId, blocks, onRemove }) => {
        const { setNodeRef, isOver } = useDroppable({ id: questionId });
        return ( <div ref={setNodeRef} className={`relative min-h-[80px] mt-2 flex flex-wrap gap-2 items-center content-start border-2 border-dashed rounded-lg p-3 transition-all duration-200 ${isOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50/50'}`}> {blocks.length > 0 ? ( blocks.map(block => (<div key={block.id} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{block.title}<button onClick={() => onRemove(questionId, block.id)} className="text-blue-600 hover:text-blue-900"><X className="w-4 h-4" /></button></div>)) ) : (<p className="text-slate-400 w-full text-center">블록을 여기에 놓으세요</p>)} </div> );
    };
    const TabButton = ({ id, activeTab, onClick, icon, label }) => ( <button onClick={() => onClick(id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 font-semibold border ${activeTab === id ? 'bg-indigo-600 text-white shadow-md border-indigo-500' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 hover:text-slate-900'}`}> {React.cloneElement(icon, { className: 'w-5 h-5' })} {label} </button> );


    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-[calc(100vh-100px)] gap-6 bg-slate-50 font-sans">
                {/* Left Panel */}
                <div className="w-80 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                    <div className="flex mb-4 space-x-2"><TabButton id="coverLetter" activeTab={activeTab} onClick={setActiveTab} icon={<FileText />} label="자소서" /><TabButton id="blocks" activeTab={activeTab} onClick={setActiveTab} icon={<Blocks />} label="블록" /></div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar"><div className="space-y-3">{(activeTab === 'coverLetter' ? pastCoverLetters : userBlocks).map(item => <DraggableItem key={item.id} item={item} type={activeTab} />)}</div></div>
                </div>

                {/* Right Panel (Workspace) */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-y-auto custom-scrollbar">
                        {activeTab === 'coverLetter' && (
                            <><h2 className="font-bold text-xl text-slate-800 mb-2">자소서 선택</h2><p className="text-slate-500 mb-4">참고할 과거 자소서를 선택하여 AI에게 더 풍부한 컨텍스트를 제공하세요.</p><GlobalCLDropZone droppedItems={globalReferencedCLs} onRemove={(id) => setGlobalReferencedCLs(p => p.filter(cl => cl.id !== id))} /><textarea value={globalRequest} onChange={e => setGlobalRequest(e.target.value)} placeholder="전체 자소서 생성을 위한 추가 요청사항 (톤앤매너, 강조할 점 등)" className="w-full mt-4 p-3 h-24 bg-slate-50 border border-slate-200 rounded-md text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" /><div className="my-8 border-t border-slate-200"></div></>
                        )}
                        
                        <div className="space-y-8">
                             {jobQuestions.map((q, index) => (
                                <div key={q.id}>
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">{index + 1}. {q.text}</h3>
                                    
                                    {/* Conditional Rendering of AnswerEditor */}
                                    {(activeTab === 'blocks' || (activeTab === 'coverLetter' && hasGeneratedCoverLetter)) && (
                                        <AnswerEditor q={q} answerState={answers[q.id]} onStateChange={(newState) => handleAnswerStateChange(q.id, newState)} onRegenerate={handleRegenerate} isRegenerating={regeneratingQuestionId === q.id} />
                                    )}

                                    {activeTab === 'blocks' && (
                                        <div className="mt-4">
                                            <BlockDropZone questionId={q.id} blocks={droppedBlocks[q.id] || []} onRemove={(qId, bId) => setDroppedBlocks(p => ({...p, [qId]: p[qId].filter(b => b.id !== bId)}))} />
                                            <textarea value={perQuestionRequests[q.id]} onChange={e => setPerQuestionRequests(p => ({...p, [q.id]: e.target.value}))} placeholder="이 문항에 대한 추가 요청사항을 입력하세요." className="w-full mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4">
                        <button onClick={activeTab === 'coverLetter' ? handleGlobalGenerate : handleBlockBasedGenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-md hover:bg-indigo-700 transform hover:scale-[1.01] transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed">
                            {isGenerating ? <Loader className="animate-spin" /> : <BrainCircuit />}
                            <span>{isGenerating ? 'AI 자소서 생성 중...' : '✨ AI 자소서 생성'}</span>
                        </button>
                    </div>
                </div>
            </div>
            <DragOverlay>{activeId ? <div className="opacity-80 shadow-2xl rounded-lg"><DraggableItem item={(activeTab === 'coverLetter' ? pastCoverLetters : userBlocks).find(i => i.id === activeId)} type={activeTab} /></div> : null}</DragOverlay>
        </DndContext>
    );
};

export default CoverLetterEditor;