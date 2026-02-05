import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClosingRecruitments, ClosingJobItem } from '../api/recruitment';

// ✨ Background images constant (순환 할당용)
// ✨ 검증된 고화질 이미지 URL (공백 발생 방지를 위해 재선별)
const JOB_BG_IMAGES = [
  // [1-6] 기업, 오피스 전경
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=60",

  // [7-12] 협업 및 사람들
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=60",
];

// ✨ Default logo fallback (companyImage가 없을 경우)
const DEFAULT_LOGO = "https://via.placeholder.com/100x100?text=Logo";

const DeadlineJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<ClosingJobItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✨ Helper: 회사명 길이에 따른 폰트 크기 조절
  const getTitleSize = (name: string) => {
    if (name.length > 12) return "text-sm";   // 12자 초과 시 작게
    if (name.length > 8) return "text-base";  // 8자 초과 시 중간
    return "text-lg";                         // 기본 크기
  };

  // ✨ API 데이터 불러오기 (sessionStorage 캐싱 적용)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 캐시 확인
        const cachedData = sessionStorage.getItem('deadline_jobs');
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            setJobs(parsed);
            setLoading(false); // 캐시가 있으면 로딩 즉시 종료
          } catch (e) {
            console.error('Failed to parse cached jobs:', e);
          }
        }

        // 2. API 호출 하여 최신화
        const response = await getClosingRecruitments();

        // ✨ 데이터 구조 대응 (API 함수에서 리턴하는 { data } 형태)
        const items = response?.data || [];

        if (Array.isArray(items)) {
          setJobs(items);
          // 3. 캐시 저장
          sessionStorage.setItem('deadline_jobs', JSON.stringify(items));
        }
      } catch (error) {
        console.error('❌ Failed to fetch closing recruitments:', error);
        // 에러 시 캐시가 없다면 빈 배열
        if (!sessionStorage.getItem('deadline_jobs')) {
          setJobs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✨ 방어 로직: jobs가 배열이 아니면 렌더링 중단
  if (!Array.isArray(jobs)) {
    console.warn('⚠️ Jobs is not an array:', jobs);
    return null;
  }

  // Duplicate data for a seamless marquee loop
  const marqueeJobs = [...jobs, ...jobs];

  const handleCardClick = (jobId: number) => {
    navigate(`/recruitments/${jobId}`);
  };

  const transitionEase = 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]';

  // 로딩 중이고 캐시도 없을 때만 로딩 표시
  if (loading && jobs.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-slate-400 text-sm">마감 직전 공고를 불러오는 중...</p>
      </div>
    );
  }

  // 데이터가 없을 때
  if (jobs.length === 0) {
    return (
      <div className="w-full flex flex-col gap-4 my-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-white">마감 직전 공고</h2>
        </div>
        <div className="w-full flex items-center justify-center py-12 bg-white/5 rounded-xl">
          <p className="text-slate-400 text-sm">마감 직전 공고가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 my-8 min-h-[340px]">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white">마감 직전 공고</h2>
        <button
          onClick={() => navigate('/recruitments')}
          className="text-sm text-slate-300 hover:text-white transition-colors"
        >
          전체보기 &gt;
        </button>
      </div>

      {/* Marquee Container */}
      <div className="relative flex w-full overflow-hidden">
        <div className="flex w-max animate-[marquee_100s_linear_infinite] hover:[animation-play-state:paused] py-4">
          {marqueeJobs.map((job, index) => {
            const isUrgent = job.dDay <= 3;
            const dDayText = job.dDay === 0 ? 'D-Day' : `D-${job.dDay}`;

            // ✨ 배경 이미지 순환 할당
            const bgImage = JOB_BG_IMAGES[index % JOB_BG_IMAGES.length];

            // ✨ 로고 이미지 fallback 처리
            const logo = job.companyImg || DEFAULT_LOGO;

            // ✨ position 배열을 문자열로 조합 (배열이 아닌 경우 대비)
            const roleText = Array.isArray(job.position)
              ? job.position.join(', ')
              : (job.position || job.title || '');

            return (
              <div
                key={`${job.recruitmentId}-${index}`}
                onClick={() => handleCardClick(job.recruitmentId)}
                className={`group relative flex flex-col w-[280px] h-[260px] mx-3 bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer 
                           transition-all duration-500 ${transitionEase}
                           hover:scale-105 hover:shadow-2xl`}
              >
                {/* 1. Background Image Section (Adjusted height to 160px) */}
                <div
                  className="relative w-full h-[160px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

                  {/* Requirement A: D-Day Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span
                      className={`text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md ${isUrgent ? 'bg-rose-600' : 'bg-slate-700'
                        }`}
                    >
                      {dDayText}
                    </span>
                  </div>
                </div>

                {/* 2. Bottom Info Section (Fixed height 100px) */}
                <div className="relative h-[100px] bg-white px-4 py-3 flex flex-col justify-center">

                  {/* 로고 이미지 부분 (Lower z-index so text can go over) */}
                  <div className="absolute -top-6 right-0 w-[120px] h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden z-0">
                    <img
                      src={logo}
                      alt={`${job.companyName} logo`}
                      className="h-full w-full object-contain p-2"
                      onError={(e) => {
                        // 이미지 로드 실패 시 fallback
                        (e.target as HTMLImageElement).src = DEFAULT_LOGO;
                      }}
                    />
                  </div>

                  {/* ✨ Company Name (Higher z-index to overlap logo if long) */}
                  <h3 className={`${getTitleSize(job.companyName)} font-bold text-gray-800 leading-tight mb-1 pr-10 relative z-10 whitespace-nowrap overflow-hidden text-ellipsis`}>
                    {job.companyName}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 relative z-10">
                    {roleText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeadlineJobs;