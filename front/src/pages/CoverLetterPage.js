import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Save, Layout, ArrowLeft } from 'lucide-react'; // Changed Sidebar to Layout
import { getCoverLetters, getCoverLetterQuestions, getCoverLetterDetail } from '../api/coverLetter';

const CoverLetterPage = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'edit'
    const [coverLetters, setCoverLetters] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [editorContent, setEditorContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Load List
    useEffect(() => {
        const loadList = async () => {
            setIsLoading(true);
            try {
                const res = await getCoverLetters();
                setCoverLetters(res.data);
            } catch (e) {
                console.error("Failed", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadList();
    }, []);

    // Load Detail when edit mode
    useEffect(() => {
        if (viewMode === 'edit' && selectedId) {
            const loadDetail = async () => {
                try {
                    const [qRes, dRes] = await Promise.all([
                        getCoverLetterQuestions(selectedId),
                        getCoverLetterDetail(selectedId)
                    ]);
                    setQuestions(qRes.data);
                    // Mock content loading - usually we'd load answers per question
                    setEditorContent(dRes.data?.answers?.[0] || "");
                } catch (e) { console.error(e); }
            };
            loadDetail();
        }
    }, [viewMode, selectedId]);

    const handleSelect = (id) => {
        setSelectedId(id);
        setViewMode('edit');
    };

    if (viewMode === 'list') {
        return (
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-6 pb-20 fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-slate-900 font-bold text-2xl tracking-tight">자소서 관리</h1>
                        <p className="text-slate-600 mt-1">자기소개서를 체계적으로 관리하고 AI 분석을 받아보세요.</p>
                    </div>
                    <button className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 transition-all">
                        + 새로 만들기
                    </button>
                </div>

                {isLoading ? <div>Loading...</div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coverLetters.map(cv => (
                            <div
                                key={cv.id}
                                onClick={() => handleSelect(cv.id)}
                                className="group bg-white/90 border border-slate-200 rounded-xl p-6 cursor-pointer hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${cv.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {cv.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-primary transition-colors">{cv.company}</h3>
                                <p className="text-slate-500 text-sm mb-4">{cv.job}</p>
                                <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
                                    <span>Updated {new Date(cv.updatedAt).toLocaleDateString()}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Editor Mode
    return (
        <div className="h-[calc(100vh-120px)] flex flex-col fade-in">
            <div className="mb-4 flex items-center justify-between">
                <button onClick={() => setViewMode('list')} className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </button>
                <button className="px-4 py-2 bg-[#7184e6] text-white rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm">
                    <Save className="w-4 h-4" /> Save Draft
                </button>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left: Questions */}
                <div className="col-span-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl shadow-sm p-6 overflow-y-auto">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Questions
                    </h3>
                    <div className="space-y-3">
                        {questions.map((q, idx) => (
                            <div
                                key={q.id}
                                onClick={() => setActiveQuestionIndex(idx)}
                                className={`p-4 rounded-lg cursor-pointer transition-all border ${activeQuestionIndex === idx
                                        ? 'bg-blue-50 border-[#7184e6]'
                                        : 'bg-white border-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                <span className={`text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block ${activeQuestionIndex === idx ? 'bg-[#7184e6] text-white' : 'bg-slate-200 text-slate-600'
                                    }`}>Q{idx + 1}</span>
                                <p className={`text-sm font-medium ${activeQuestionIndex === idx ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {q.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Editor */}
                <div className="col-span-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-slate-500">Answer Editor</span>
                        <span className="text-xs font-mono text-slate-400">{editorContent.length} / {questions[activeQuestionIndex]?.limit || 1000} chars</span>
                    </div>
                    <textarea
                        className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-6 focus:ring-2 focus:ring-[#7184e6] focus:border-transparent outline-none resize-none font-sans leading-relaxed text-slate-800"
                        placeholder="Write your answer here..."
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CoverLetterPage;
