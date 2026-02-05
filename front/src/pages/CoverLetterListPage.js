import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Calendar, ChevronRight, ChevronDown, Building2, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { getCoverLetters, updateCoverLetter, deleteCoverLetter } from '../api/coverLetter';
import Toast from '../components/ui/Toast';
import CustomAlert from '../components/CustomAlert';

const CoverLetterListPage = () => {
    const navigate = useNavigate();
    const [coverLetters, setCoverLetters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Custom UI State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null
    });

    const showToast = (message, type = 'info') => {
        setToast({ visible: true, message, type });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
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

    useEffect(() => {
        fetchCoverLetters();

        // Refetch when page becomes visible (user returns from another page)
        const handleFocus = () => {
            fetchCoverLetters(true); // isBackground = true (hide loading spinner)
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchCoverLetters = async (isBackground = false) => {
        try {
            if (!isBackground) setIsLoading(true);
            const response = await getCoverLetters(0, 100);

            let items = [];
            if (Array.isArray(response)) items = response;
            else if (response?.data?.items) items = response.data.items;
            else if (response?.items) items = response.items;

            // [임시 해결책] position이 없으면 recruitmentId로 상세 정보를 가져와서 채워넣기
            // 주의: 목록 개수만큼 API를 호출하므로 느릴 수 있습니다.
            const itemsWithPosition = await Promise.all(items.map(async (item) => {
                if ((!item.position && !item.jobType) && item.recruitmentId) {
                    try {
                        const { getRecruitmentDetail } = await import('../api/recruitment');
                        const res = await getRecruitmentDetail(item.recruitmentId);
                        // 공고 상세에서 가져온 position 정보를 덮어씌움
                        return {
                            ...item,
                            position: res.data.position || res.data.jobType
                        };
                    } catch (e) {
                        return item;
                    }
                }
                return item;
            }));

            setCoverLetters(itemsWithPosition);
        } catch (err) {
            console.error(err);
            if (!isBackground) setError("자소서 목록을 불러오는데 실패했습니다.");
        } finally {
            if (!isBackground) setIsLoading(false);
        }
    };

    const handlePassStatusChange = async (e, item) => {
        e.stopPropagation(); // Prevent card click
        const value = e.target.value;

        try {
            let isPassed = null;
            if (value === 'passed') isPassed = true;
            else if (value === 'failed') isPassed = false;

            await updateCoverLetter(item.id, {
                title: item.title,
                isComplete: item.isComplete,
                isPassed: isPassed,
                essays: [] // Empty array since we're only updating status
            });

            // Update local state
            setCoverLetters(prev => prev.map(cl =>
                cl.id === item.id ? { ...cl, isPassed } : cl
            ));

        } catch (err) {
            console.error('Failed to update pass status', err);
            showToast('합격 상태 업데이트에 실패했습니다.', 'error');
        }
    };

    const handleDelete = async (e, item) => {
        e.stopPropagation(); // Prevent card click

        showAlert(
            '삭제 확인',
            `"${item.title || '제목 없음'}" 자소서를 삭제하시겠습니까?\n삭제된 자소서는 복구할 수 없습니다.`,
            'warning',
            async () => {
                try {
                    await deleteCoverLetter(item.id);
                    // Update local state to remove deleted item
                    setCoverLetters(prev => prev.filter(cl => cl.id !== item.id));
                    showToast('자소서가 삭제되었습니다.', 'success');
                } catch (err) {
                    console.error('Failed to delete cover letter', err);
                    const errorMessage = err.response?.data?.message || err.message || '자소서 삭제에 실패했습니다.';
                    showToast(`자소서 삭제 실패: ${errorMessage}`, 'error');
                }
            }
        );
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
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                {item.title || '제목 없음'}
            </h3>

            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <Building2 className="w-4 h-4" />
                <span>{item.companyName || '회사명 미정'}</span>
                <span className="text-slate-600">|</span>
                <span>
                    {item.jobType || item.position || item.recruitment?.jobType || item.recruitment?.position || '직무 미정'}
                </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 ${item.isComplete
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                    {item.isComplete ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {item.isComplete ? '작성 완료' : '작성 중'}
                </span>

                <div className="flex items-center gap-2">
                    {item.isComplete && (
                        <select
                            value={item.isPassed === null ? 'pending' : item.isPassed ? 'passed' : 'failed'}
                            onChange={(e) => handlePassStatusChange(e, item)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 rounded-md border bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                            style={{
                                color: item.isPassed === null ? '#94a3b8' : item.isPassed ? '#4ade80' : '#f87171',
                                borderColor: item.isPassed === null ? '#475569' : item.isPassed ? '#22c55e' : '#ef4444'
                            }}
                        >
                            <option value="pending">대기중</option>
                            <option value="passed">서합</option>
                            <option value="failed">불합</option>
                        </select>
                    )}

                    <button
                        onClick={(e) => handleDelete(e, item)}
                        className="text-xs px-2 py-1 rounded-md border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        title="삭제"
                    >
                        삭제
                    </button>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
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
                    onClick={() => navigate('/recruitments', { state: { message: "작성할 공고를 선택해주세요." } })}
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
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
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
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
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

            {/* Custom Alert & Toast */}
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

export default CoverLetterListPage;
