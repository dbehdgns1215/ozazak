import React from 'react';
import { useNavigate } from 'react-router-dom';

// Re-using the mock data from the previous version
const jobs = [
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzSdnXv-_dO3v3K-CoP_s_L-_smE1A-7kKqw&s",
    company: "토스",
    role: "Frontend Developer",
    dDay: 2,
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4n2eSkoHEs0a2Z4JLSf8qf-y2RGIsXMubpA&s",
    company: "네이버",
    role: "Backend Engineer",
    dDay: 3,
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjgE0kYl-H0V5DBfQ_HqksbkzDOfItB2hK0g&s",
    company: "카카오",
    role: "iOS Developer",
    dDay: 5,
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-q6V2D2aCgK3K-aGjS1H8G3Xy5Xw9Q1Z0w&s",
    company: "배달의민족",
    role: "Data Analyst",
    dDay: 7,
  },
  {
    logo: "https://i.namu.wiki/i/EXmYkqa-W1e5f8Mo5K4T8Y9F3h5S-15A8fB32ftGVTw1j1tGgGqgq2d3N3Axb3k5r3oA_n2nC1bY8FCvwD9lBg.svg",
    company: "당근",
    role: "Product Manager",
    dDay: 10,
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1hso-9Jt2vH2V5YUn8E15tPA8oIu6zX2bPA&s",
    company: "직방",
    role: "AI/ML Engineer",
    dDay: 1,
  }
];

// Duplicate the data for a seamless loop
const marqueeJobs = [...jobs, ...jobs];

const DeadlineJobs = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Define marquee animation keyframes */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      {/* Header Section */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white">마감 직전 공고</h2>
        <button
          onClick={() => navigate('/recruitments')}
          className="text-sm text-slate-300 hover:text-white transition-colors"
        >
          전체보기 &gt;
        </button>
      </div>

      <div className="relative flex w-full overflow-hidden">
        {/* The track that will be animated */}
        <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] py-2">
          {marqueeJobs.map((job, index) => (
            <div
              key={index}
              onClick={() => console.log(`${job.company} Clicked`)}
              className="group flex items-center justify-between gap-4 w-[280px] h-[120px] mx-2 px-4 rounded-2xl 
                         bg-slate-900/30 backdrop-blur-md border border-white/10 shadow-sm cursor-pointer
                         transition-all duration-300 transform
                         hover:scale-105 hover:bg-slate-800/50 hover:border-white/20 hover:shadow-md"
            >
              {/* Left: Logo */}
              <div className="flex-shrink-0">
                <img src={job.logo} alt={`${job.company} logo`} className="w-9 h-9 rounded-full object-contain bg-white p-1" />
              </div>

              {/* Center: Info */}
              <div className="flex-grow overflow-hidden text-left">
                <p className="font-bold text-sm text-slate-200 truncate">{job.company}</p>
                <p className="text-xs text-slate-400 truncate">{job.role}</p>
              </div>

              {/* Right: D-Day Badge */}
              <div className="flex-shrink-0">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${job.dDay <= 3
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                  }`}>
                  D-{job.dDay}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeadlineJobs;