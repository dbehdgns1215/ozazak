import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. 데이터 구조 변경: bgImage(배경용)와 logo(로고용)를 분리했습니다.
const jobs = [
  {
    // 배경: 개발 화면이나 사무실 느낌
    bgImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60", 
    // 로고: 회사 로고 (여기서는 예시 이미지)
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtPV-rOLEu4eFhHPkWWQbgfG-FSgTyXketfQ&s",
    company: "토스",
    role: "Frontend Developer",
    dDay: 2,
    id: 1,
  },
  {
    bgImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Naver_Logotype.svg/1280px-Naver_Logotype.svg.png",
    company: "네이버",
    role: "Backend Engineer",
    dDay: 3,
    id: 2,
  },
  {
    bgImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    logo: "https://blog.kakaocdn.net/dna/bPWm4U/btqw8CtgkMu/AAAAAAAAAAAAAAAAAAAAACxmkKQyacuzKkh5TroNfRYo3fO35dMKUUwdK_OX7U-s/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1769871599&allow_ip=&allow_referer=&signature=6PYoili%2BC2za%2Bh9u5RVEok1HLgw%3D",
    company: "카카오",
    role: "iOS Developer",
    dDay: 8,
    id: 3,
  },
  {
    bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    logo: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    company: "배달의민족",
    role: "Data Analyst",
    dDay: 7,
    id: 4,
  },
  {
    bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    company: "당근",
    role: "Product Manager",
    dDay: 10,
    id: 5,
  },
  {
    bgImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    logo: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    company: "직방",
    role: "AI/ML Engineer",
    dDay: 1,
    id: 6,
  }
];

// Duplicate data for a seamless marquee loop
const marqueeJobs = [...jobs, ...jobs];

const DeadlineJobs = () => {
  const navigate = useNavigate();

  const handleCardClick = (jobId: number) => {
    navigate(`/recruitment/${jobId}`);
  };

  const transitionEase = 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]';

  return (
    <div className="w-full flex flex-col gap-4 my-8">
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
        <div className="flex w-max animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] py-4">
          {marqueeJobs.map((job, index) => {
            const isUrgent = job.dDay <= 3;
            const dDayText = job.dDay === 0 ? 'D-Day' : `D-${job.dDay}`;

            return (
              <div
                key={`${job.id}-${index}`}
                onClick={() => handleCardClick(job.id)}
                className={`group relative flex flex-col w-[280px] h-[230px] mx-3 bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer 
                           transition-all duration-500 ${transitionEase}
                           hover:scale-105 hover:shadow-2xl`}
              >
                {/* 1. Background Image Section */}
                <div
                  className="relative w-full h-[190px] bg-cover bg-center"
                  // ▼ 수정됨: job.logo가 아니라 job.bgImage를 사용
                  style={{ backgroundImage: `url(${job.bgImage})` }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

                  {/* Requirement A: D-Day Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span
                      className={`text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md ${
                        isUrgent ? 'bg-rose-600' : 'bg-slate-700'
                      }`}
                    >
                      {dDayText}
                    </span>
                  </div>
                </div>

                {/* 2. Bottom Info Section */}
                <div className="relative flex-1 bg-white px-4 py-3 flex flex-col justify-center">
                  
                  {/* 로고 이미지 부분 */}
                  <div className="absolute -top-6 right-0 w-[120px] h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden z-10">
                      <img 
                       
                        src={job.logo} 
                        alt={`${job.company} logo`} 
                        className="h-full w-full object-contain p-2"
                      />
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1 pr-10">
                    {job.company}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {job.role}
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