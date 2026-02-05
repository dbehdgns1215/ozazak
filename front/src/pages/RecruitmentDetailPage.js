import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Heart, Sparkles, ExternalLink, Share2, Briefcase } from 'lucide-react';
import { getRecruitmentDetail, addBookmark, deleteBookmark } from '../api/recruitment';
import KakaoMap from '../components/KakaoMap';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import CustomAlert from '../components/CustomAlert';
import Toast from '../components/ui/Toast';

// --- Share Modal Component ---
const ShareModal = ({ isOpen, onClose, title, url, onCopy }) => {
    if (!isOpen) return null;

    const copyOptions = [
        { label: '링크 복사', text: url, icon: <ExternalLink className="w-4 h-4" /> },
        { label: 'Markdown', text: `[${title}](${url})`, icon: <span className="font-mono text-xs">MD</span> },
        { label: 'HTML', text: `<a href="${url}">${title}</a>`, icon: <span className="font-mono text-xs">&lt;/&gt;</span> }
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">공유하기</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowLeft className="w-5 h-5 rotate-180" /> {/* Close Icon alternative */}
                    </button>
                </div>
                <div className="p-2">
                    {copyOptions.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => onCopy(option.text, option.label)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors border border-indigo-100">
                                    {option.icon}
                                </div>
                                <span className="text-gray-700 font-medium group-hover:text-gray-900">{option.label}</span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">복사</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RecruitmentDetailPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // Auth & Alert State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signin');
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null
    });

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
    const showToast = (message, type = 'info') => {
        setToast({ visible: true, message, type });
    };
    const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

    // 다중 공고 ID 처리 (?ids=432,433,434)
    const idsParam = searchParams.get('ids');
    const jobIds = idsParam ? idsParam.split(',') : [id];
    const isMultiJob = jobIds.length > 1;

    const [jobs, setJobs] = useState([]);  // 모든 공고 정보
    const [primaryJob, setPrimaryJob] = useState(null);  // 대표 공고 (헤더용)
    const [loading, setLoading] = useState(true);
    const [bookmarkStates, setBookmarkStates] = useState({});  // 공고별 북마크 상태

    // Share State
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label}가 클립보드에 복사되었습니다!`, 'success');
            setIsShareModalOpen(false);
        }).catch(() => {
            showToast('복사에 실패했습니다.', 'error');
        });
    };

    useEffect(() => {
        const loadJobs = async () => {
            try {
                // 모든 공고 병렬 fetch
                const responses = await Promise.all(
                    jobIds.map(jobId => getRecruitmentDetail(jobId))
                );

                const loadedJobs = responses.map(res => {
                    const data = res.data;
                    console.log('📦 백엔드 응답 데이터:', data);

                    // 주소 필드 우선순위: address > companyLocation > location
                    const address = data.address || data.companyLocation || data.location || '';
                    console.log('📍 추출된 주소:', address);

                    // content 파싱: 이미지 URL과 텍스트 분리
                    let posterImage = '';
                    let description = '';

                    if (data.content) {
                        const parts = data.content.split('\n\n');
                        // 첫 번째 부분이 URL이면 이미지로 사용
                        if (parts[0] && (parts[0].startsWith('http://') || parts[0].startsWith('https://'))) {
                            posterImage = parts[0].trim();
                            description = parts.slice(1).join('\n\n').trim();
                        } else {
                            // URL이 없으면 전체를 설명으로
                            description = data.content;
                        }
                    }

                    return {
                        id: data.recruitmentId,
                        company: data.companyName,
                        companyImg: data.companyImg,
                        title: data.title,
                        posterImage: posterImage,
                        description: description || data.description || "",
                        workplaceInfo: address || '주소 정보 없음',
                        address: address,
                        dDay: data.dday,
                        deadline: data.endedAt,
                        applyUrl: data.applyUrl,
                        questions: data.questions || [],
                        isBookmarked: data.bookmarked,
                        tags: data.tags || [],
                        position: data.position
                    };
                });

                setJobs(loadedJobs);
                setPrimaryJob(loadedJobs[0]);

                // 북마크 상태 초기화
                const bookmarks = {};
                loadedJobs.forEach(job => {
                    bookmarks[job.id] = job.isBookmarked;
                });
                setBookmarkStates(bookmarks);

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, [id, idsParam]);

    const handleBookmarkToggle = async (jobId) => {
        if (!isAuthenticated) {
            setAlertConfig({
                isOpen: true,
                title: '로그인 필요',
                message: '북마크 기능은 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?',
                type: 'warning',
                onConfirm: () => {
                    navigate('/signin', { state: { from: location.pathname + location.search } });
                }
            });
            return;
        }

        try {
            // Optimistic update for better UX
            setBookmarkStates(prev => ({
                ...prev,
                [jobId]: !prev[jobId]
            }));

            if (bookmarkStates[jobId]) {
                await deleteBookmark(jobId);
                showToast('북마크가 해제되었습니다.', 'info');
            } else {
                await addBookmark(jobId);
                showToast('북마크에 추가되었습니다.', 'success');
            }
        } catch (error) {
            // Revert on failure
            setBookmarkStates(prev => ({
                ...prev,
                [jobId]: !prev[jobId]
            }));
            showToast('북마크 변경에 실패했습니다.', 'error');
        }
    };

    const formatDetailDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-slate-500">Loading...</div>;
    if (!primaryJob) return <div className="min-h-screen pt-32 text-center text-slate-500">Job Not Found</div>;

    const isClosed = primaryJob.dDay < 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 relative font-sans fade-in rounded-[30px] pt-8 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 max-w-4xl mx-auto pb-32">
                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-8 transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" /> 뒤로가기
                </button>

                {/* Header Section */}
                <header className="mb-10">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-[20px] bg-white flex items-center justify-center text-3xl font-bold text-slate-900 shadow-sm border border-slate-100 overflow-hidden">
                                {primaryJob.companyImg ? (
                                    <img src={primaryJob.companyImg} alt={primaryJob.company} className="w-full h-full object-contain p-2" />
                                ) : (
                                    primaryJob.company[0]
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">{primaryJob.company}</h1>
                                    {isMultiJob && (
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg">
                                            {jobs.length}개 직무
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" /> {primaryJob.workplaceInfo}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {isClosed ? (
                                <div className="text-slate-900 font-bold flex items-center gap-1.5 text-lg">
                                    지원 마감
                                </div>
                            ) : (
                                <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5 ${primaryJob.dDay <= 3 ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <Clock className="w-4 h-4" /> D-{primaryJob.dDay === 0 ? 'Day' : primaryJob.dDay}
                                </div>
                            )}
                            <span className="text-sm text-slate-500 font-medium">
                                마감일: {formatDetailDate(primaryJob.deadline)}
                            </span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {primaryJob.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white text-slate-700 rounded-full text-sm font-medium border border-slate-300 shadow-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Main Content Body */}
                <div className="grid gap-8">

                    {/* 1. 직무 리스트 섹션 */}
                    <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                            <Briefcase className="w-5 h-5 text-indigo-500" />
                            {isMultiJob ? '나와 관련된 모집부문' : '자기소개서 문항'}
                        </h2>

                        <div className="space-y-3">
                            {jobs.map((job, idx) => (
                                <div
                                    key={job.id}
                                    className="flex items-center justify-between h-16 px-5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors"
                                >
                                    {/* 왼쪽: 직무 정보 (Index + Title) */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4 relative group">
                                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-xs font-bold shrink-0">
                                            {idx + 1}
                                        </span>
                                        <span className="font-bold text-slate-800 text-base truncate cursor-help">
                                            {job.position || job.title}
                                        </span>
                                        {/* Custom Tooltip: Only for long titles (>40 chars) */}
                                        {(job.position || job.title).length > 50 && (
                                            <div className="absolute left-10 bottom-full mb-2 hidden group-hover:block z-50 w-max max-w-sm px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal break-words">
                                                {job.position || job.title}
                                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 오른쪽: Controls (Heart, Count, Button) */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBookmarkToggle(job.id);
                                            }}
                                            className={`p-1.5 rounded-full transition-all ${bookmarkStates[job.id]
                                                ? 'text-red-500 bg-red-50'
                                                : 'text-slate-300 hover:text-red-400 hover:bg-slate-200'
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${bookmarkStates[job.id] ? 'fill-current' : ''}`} />
                                        </button>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-bold min-w-[3.5rem] text-center">
                                            {job.questions?.length || 0}문항
                                        </span>

                                        {/* 오른쪽: 자소서 쓰기 버튼 */}
                                        <button
                                            onClick={async () => {
                                                if (!isAuthenticated) {
                                                    setAlertConfig({
                                                        isOpen: true,
                                                        title: '로그인 필요',
                                                        message: '자소서 작성 기능을 이용하시려면\n로그인이 필요합니다.',
                                                        type: 'warning',
                                                        confirmText: '로그인',
                                                        cancelText: '취소',
                                                        onConfirm: () => {
                                                            setAlertConfig(prev => ({ ...prev, isOpen: false }));
                                                            setIsAuthModalOpen(true);
                                                            setAuthMode('signin');
                                                        }
                                                    });
                                                    return;
                                                }
                                                try {
                                                    const { checkCoverLetter } = await import('../api/coverLetter');
                                                    const response = await checkCoverLetter(job.id);
                                                    const coverLetterId = response.data.coverLetterId;
                                                    navigate(`/generate?coverLetterId=${coverLetterId}&recruitmentId=${job.id}`);
                                                } catch (error) {
                                                    console.error("자소서 확인/생성 실패:", error);
                                                    showToast("자소서 생성 중 오류가 발생했습니다.", "error");
                                                }
                                            }}
                                            disabled={isClosed}
                                            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-sm
                                            ${isClosed
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-md hover:-translate-y-0.5'
                                                }`}
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            자소서 쓰기
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Poster Image */}
                    <div className="w-full rounded-[30px] overflow-hidden shadow-sm border border-slate-200 bg-white">
                        <img
                            src={primaryJob.posterImage}
                            alt={primaryJob.title}
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* 3. Description */}
                    {primaryJob.description && (
                        <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                                <Sparkles className="w-5 h-5 text-yellow-500" /> 상세 요강
                            </h2>
                            <div className="prose prose-slate max-w-none leading-relaxed space-y-2 text-slate-700">
                                {primaryJob.description.split('•').map((item, idx) => {
                                    const trimmed = item.trim();
                                    if (!trimmed) return null;
                                    return (
                                        <div key={idx} className="flex gap-2.5">
                                            {idx > 0 && <span className="text-indigo-500 font-bold">•</span>}
                                            <span className={idx === 0 ? '' : 'flex-1'}>{trimmed}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 4. Workplace Info */}
                    <div className="bg-white p-8 rounded-[30px] border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                            <MapPin className="w-5 h-5 text-green-500" /> 근무지 정보
                        </h2>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 h-64 md:h-80 shadow-inner bg-slate-50">
                                <KakaoMap
                                    address={primaryJob.address}
                                    companyName={primaryJob.company}
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="font-bold text-xl text-slate-900 mb-2">{primaryJob.workplaceInfo}</h3>
                                <p className="text-slate-600 mb-6 font-medium">{primaryJob.address || '주소 정보가 없습니다'}</p>
                                {primaryJob.address && (
                                    <a
                                        href={`https://map.kakao.com/link/search/${encodeURIComponent(primaryJob.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold self-start transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        카카오맵에서 보기
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex flex-col items-center gap-1 min-w-[60px] text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <Share2 className="w-6 h-6" />
                        <span className="text-xs font-medium">공유</span>
                    </button>

                    <div className="flex-1 text-right">
                        <a
                            href={primaryJob.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-base gap-2 transition-all shadow-lg hover:-translate-y-0.5
                                ${isClosed
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                                }`}
                            onClick={(e) => isClosed && e.preventDefault()}
                        >
                            {isClosed ? '지원 기간이 끝났습니다' : '공식 홈페이지 지원하기'}
                            {!isClosed && <ExternalLink className="w-4 h-4 opacity-50" />}
                        </a>
                    </div>
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                title={primaryJob.company + ' - ' + (primaryJob.title || '채용 공고')}
                url={window.location.href}
                onCopy={handleCopy}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />

            <CustomAlert
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                confirmText={alertConfig.confirmText}
                cancelText={alertConfig.cancelText}
                onConfirm={alertConfig.onConfirm}
            />

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.visible}
                    onClose={closeToast}
                />
            )}
        </div >
    );
};

export default RecruitmentDetailPage;
