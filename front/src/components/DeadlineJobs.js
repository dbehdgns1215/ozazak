import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const deadlineJobsData = [
  { company: "토스", role: "Product Designer", dDay: "D-2", tags: ["디자인", "프로덕트"] },
  { company: "우아한형제들", role: "Frontend Developer", dDay: "D-3", tags: ["개발", "프론트엔드"] },
  { company: "당근", role: "Backend Developer", dDay: "D-4", tags: ["개발", "백엔드"] },
  { company: "직방", role: "Data Scientist", dDay: "D-5", tags: ["데이터", "AI"] },
];

const JobCard = ({ job }) => (
  <div 
    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-5 flex flex-col gap-4 min-w-[280px] 
               transition-colors duration-300 cursor-pointer hover:border-[#7184e6]"
  >
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-md text-slate-800">{job.company}</h4>
        <p className="text-sm text-slate-500">{job.role}</p>
      </div>
      <span className="font-bold font-mono text-sm text-red-500">{job.dDay}</span>
    </div>
    <div className="flex gap-2">
      {job.tags.map(tag => (
        <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const DeadlineJobs = () => {
  const container = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.job-card');
    gsap.from(cards, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      }
    });
  }, { scope: container });

  return (
    <section ref={container}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-slate-700">마감 직전 공고</h3>
        <a href="#" className="group relative text-sm font-bold text-[#7184e6] flex items-center gap-1">
          <span>전체보기</span>
          <ChevronRight className="size-4" />
          <span className="absolute bottom-[-2px] left-0 w-full h-[1.5px] bg-[#7184e6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
        </a>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 -mx-1 px-1">
        {deadlineJobsData.map((job, index) => (
          <div className="job-card" key={index}>
            <JobCard job={job} />
          </div>
        ))}
        <div className="flex-shrink-0 w-2"></div>
      </div>
    </section>
  );
};

export default DeadlineJobs;