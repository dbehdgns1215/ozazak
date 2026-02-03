import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Calendar, ChevronRight, Building2, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { getCoverLetters } from '../api/coverLetter';

const CoverLetterListPage = () => {
    const navigate = useNavigate();
    const [coverLetters, setCoverLetters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCoverLetters();
    }, []);

    const fetchCoverLetters = async () => {
        try {
            setIsLoading(true);
            // Default fetch size 100 to get most items for now
            const response = await getCoverLetters(0, 100);
            // API now returns items array directly, not { data: { items: [...] } }
            const items = Array.isArray(response) ? response : (response?.data?.items || response?.items || []);
            setCoverLetters(items);
        } catch (err) {
            console.error("Failed to fetch cover letters", err);
            setError("자소서 목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter by status
    const completedItems = coverLetters.filter(item => item.isComplete);
    const inProgressItems = coverLetters.filter(item => !item.isComplete);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const EmptyState = ({ message }) => (
        <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-white/5">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">{message}</p>
        </div>
    );

    const CoverLetterCard = ({ item }) => (
        <div
            onClick={() => navigate(`/generate?coverLetterId=${item.id}&recruitmentId=${item.recruitmentId}`)}
            className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-blue-500/30 rounded-xl p-5 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/10"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.createdAt)}</span>
                </div>
                {item.isPassed && (
                    <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20">
                        합격
                    </span>
                )}
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                {item.title || '제목 없음'}
            </h3>

            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <Building2 className="w-4 h-4" />
                <span>{item.companyName || '회사명 미정'}</span>
                <span className="text-slate-600">|</span>
                <span>{item.jobType || '직무 미정'}</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 ${item.isComplete
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                    {item.isComplete ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.isComplete ? '작성 완료' : '작성 중'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">나의 자소서 보관함</h1>
                    <p className="text-slate-400">지금까지 작성한 모든 자기소개서를 모아보세요.</p>
                </div>
                <button
                    onClick={() => navigate('/jobs', { state: { message: "작성할 공고를 선택해주세요." } })}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    새 자소서 작성
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-400">
                    {error}
                </div>
            ) : (
                <div className="space-y-12">
                    {/* 작성 중인 자소서 Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="w-6 h-6 text-orange-400" />
                            <h2 className="text-xl font-bold text-white">작성 중인 자소서</h2>
                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">{inProgressItems.length}</span>
                        </div>

                        {inProgressItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {inProgressItems.map(item => (
                                    <CoverLetterCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="작성 중인 자소서가 없습니다." />
                        )}
                    </section>

                    {/* 완료된 자소서 Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold text-white">완료된 자소서</h2>
                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">{completedItems.length}</span>
                        </div>

                        {completedItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedItems.map(item => (
                                    <CoverLetterCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="아직 완료된 자소서가 없습니다." />
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};

export default CoverLetterListPage;
