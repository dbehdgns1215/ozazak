import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const jobs = [
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzSdnXv-_dO3v3K-CoP_s_L-_smE1A-7kKqw&s",
    company: "토스",
    role: "Frontend Developer",
    dDay: 2,
    tags: ["React", "TypeScript", "Next.js"]
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4n2eSkoHEs0a2Z4JLSf8qf-y2RGIsXMubpA&s",
    company: "네이버",
    role: "Backend Engineer",
    dDay: 3,
    tags: ["Java", "Spring", "MSA"]
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjgE0kYl-H0V5DBfQ_HqksbkzDOfItB2hK0g&s",
    company: "카카오",
    role: "iOS Developer",
    dDay: 5,
    tags: ["Swift", "SwiftUI", "Combine"]
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-q6V2D2aCgK3K-aGjS1H8G3Xy5Xw9Q1Z0w&s",
    company: "배달의민족",
    role: "Data Analyst",
    dDay: 7,
    tags: ["SQL", "Python", "Tableau"]
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ5O-3-kX8Y-x-3-t-4-r-r-4-k-y-QJ5O-3-kX8Y-x-3-t-4-r-r-4-k-y&s",
    company: "당근",
    role: "Product Manager",
    dDay: 10,
    tags: ["기획", "UX/UI", "그로스해킹"]
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ5O-3-kX8Y-x-3-t-4-r-r-4-k-y-QJ5O-3-kX8Y-x-3-t-4-r-r-4-k-y&s",
    company: "직방",
    role: "AI/ML Engineer",
    dDay: 1,
    tags: ["Python", "TensorFlow", "PyTorch"]
  }
];

export default function DeadlineJobs() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340; // Card width (320) + gap (24)
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">마감 직전 공고</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')} 
            className="bg-white hover:bg-white border border-slate-200/50 rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="bg-white hover:bg-white border border-slate-200/50 rounded-full p-2 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
          <a href="#" className="ml-2 text-sm font-semibold text-slate-600 hover:text-[#7184e6] transition-colors">
            전체보기 &gt;
          </a>
        </div>
      </div>

      {/* Cards Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {jobs.map((job, index) => (
          <div key={index} className="snap-start flex-shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-300 hover:border-[#7184e6] hover:shadow-md hover:-translate-y-1 p-5 min-w-[320px]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 rounded-full border-2 border-white/80 shadow-md" />
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{job.company}</p>
                    <p className="text-slate-600 font-medium">{job.role}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  job.dDay <= 3 
                  ? 'bg-red-100 text-red-600 border border-red-200/50' 
                  : 'bg-slate-100/70 text-slate-500 border border-slate-200/50'
                }`}>
                  D-{job.dDay}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="bg-slate-500/10 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/50">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="flex-shrink-0 w-1 snap-start"></div>
      </div>
    </div>
  );
}