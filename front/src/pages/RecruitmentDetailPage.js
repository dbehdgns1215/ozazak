import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Heart, Sparkles, ExternalLink, Share2, Briefcase } from 'lucide-react';
import { getRecruitmentDetail, addBookmark, deleteBookmark } from '../api/recruitment';
import KakaoMap from '../components/KakaoMap';

const RecruitmentDetailPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 다중 공고 ID 처리 (?ids=432,433,434)
    const idsParam = searchParams.get('ids');
    const jobIds = idsParam ? idsParam.split(',') : [id];
    const isMultiJob = jobIds.length > 1;

    const [jobs, setJobs] = useState([]);  // 모든 공고 정보
    const [primaryJob, setPrimaryJob] = useState(null);  // 대표 공고 (헤더용)
    const [loading, setLoading] = useState(true);
    const [bookmarkStates, setBookmarkStates] = useState({});  // 공고별 북마크 상태

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
        try {
            if (bookmarkStates[jobId]) {
                await deleteBookmark(jobId);
            } else {
                await addBookmark(jobId);
            }
            setBookmarkStates(prev => ({
                ...prev,
                [jobId]: !prev[jobId]
            }));
        } catch (error) {
            console.error('북마크 실패:', error);
        }
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!primaryJob) return <div className="min-h-screen pt-32 text-center text-white">Job Not Found</div>;

    return (
        <div className="min-h-screen text-white relative">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-32">
                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 채용 공고 목록
                </button>

                {/* Header Section - 대표 공고 정보 */}
                <header className="mb-10">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-slate-900 shadow-lg">
                                {primaryJob.company[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-3xl font-bold">{primaryJob.company}</h1>
                                    {isMultiJob && (
                                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg border border-indigo-500/30">
                                            {jobs.length}개 직무
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {primaryJob.workplaceInfo}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg border border-red-500/30 flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4" /> D-{primaryJob.dDay}
                            </div>
                            <span className="text-sm text-slate-500">
                                마감일: {new Date(primaryJob.deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {primaryJob.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Main Content Body */}
                <div className="grid gap-8">

                    {/* 1. 직무 리스트 섹션 (Option A: 리스트 형태) */}
                    <div className="glass-dark p-6 rounded-3xl border border-white/5 bg-slate-800/30 backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-400" />
                            {isMultiJob ? '나와 관련된 모집부문' : '자기소개서 문항'}
                        </h2>

                        {/* 직무 리스트 */}
                        <div className="space-y-2">
                            {jobs.map((job, idx) => (
                                <div
                                    key={job.id}
                                    className="flex items-center justify-between py-2 px-4 bg-slate-700/30 hover:bg-slate-700/40 rounded-lg border border-slate-600/50 transition-colors"
                                >
                                    {/* 왼쪽: 직무 정보 */}
                                    <div className="flex items-center gap-3">
                                        {/* 순번 */}
                                        <span className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </span>

                                        {/* 직무명 */}
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white text-sm">
                                                {job.position || job.title}
                                            </span>
                                        </div>

                                        {/* 북마크 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBookmarkToggle(job.id);
                                            }}
                                            className={`p-1.5 rounded-md transition-colors ${bookmarkStates[job.id]
                                                ? 'text-red-400 bg-red-500/10'
                                                : 'text-slate-400 hover:text-red-400 hover:bg-slate-600/50'
                                                }`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${bookmarkStates[job.id] ? 'fill-current' : ''}`} />
                                        </button>

                                        {/* 문항 수 */}
                                        <span className="text-xs text-slate-500">
                                            {job.questions?.length || 0}문항
                                        </span>
                                    </div>

                                    {/* 오른쪽: 자소서 쓰기 버튼 */}
                                    <button
                                        onClick={() => navigate(`/cover-letter?recruitmentId=${job.id}`)}
                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium text-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        자소서 쓰기
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Poster Image */}
                    <div
                        className="w-full rounded-3xl shadow-2xl border border-slate-800 bg-slate-800"
                        style={{ height: 'auto', maxHeight: 'none', overflow: 'visible' }}
                    >
                        <img
                            src={primaryJob.posterImage}
                            alt={primaryJob.title}
                            className="w-full block rounded-3xl"
                            style={{
                                height: 'auto',
                                maxHeight: 'none',
                                width: '100%',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                    </div>

                    {/* 3. Description / 상세 요강 */}
                    {primaryJob.description && (
                        <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-slate-800/30 backdrop-blur-xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" /> 상세 요강
                            </h2>
                            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-2">
                                {primaryJob.description.split('•').map((item, idx) => {
                                    const trimmed = item.trim();
                                    if (!trimmed) return null;
                                    return (
                                        <div key={idx} className="flex gap-2">
                                            {idx > 0 && <span className="text-indigo-400 font-bold">•</span>}
                                            <span className={idx === 0 ? '' : 'flex-1'}>{trimmed}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 4. Workplace Info */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-slate-800/30 backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-400" /> 근무지 정보
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* 지도 */}
                            <div className="flex-1 overflow-hidden rounded-xl border border-slate-700 h-64 md:h-auto">
                                <KakaoMap
                                    address={primaryJob.address}
                                    companyName={primaryJob.company}
                                />
                            </div>

                            {/* 주소 정보 */}
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="font-bold text-lg mb-2">{primaryJob.workplaceInfo}</h3>
                                <p className="text-slate-400 mb-4">{primaryJob.address || '주소 정보가 없습니다'}</p>
                                {primaryJob.address && (
                                    <a
                                        href={`https://map.kakao.com/link/search/${encodeURIComponent(primaryJob.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm self-start transition-colors flex items-center gap-2"
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

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 w-full glass-dark border-t border-white/10 p-4 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button className="flex flex-col items-center gap-1 min-w-[60px] text-slate-400 hover:text-white transition-colors">
                            <Share2 className="w-6 h-6" />
                            <span className="text-xs font-medium">공유</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <a
                            href={primaryJob.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            지원하러 가기 <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentDetailPage;
