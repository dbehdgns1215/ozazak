import React from 'react';
import { ChevronRight } from 'lucide-react';

const ActivityLog = () => {
  const days = Array.from({ length: 7 * 4 }); 

  const colors = [
    'bg-[#7184e6]/20',
    'bg-[#7184e6]/50',
    'bg-[#7184e6]/75',
    'bg-[#7184e6]/100',
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-semibold text-md text-slate-700">활동 기록</h3>
        <span className="text-xs font-mono text-slate-500">2024</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((_, i) => {
          const randomValue = Math.random();
          let colorClass = 'bg-slate-200/60';
          if (randomValue > 0.9) colorClass = colors[3];
          else if (randomValue > 0.75) colorClass = colors[2];
          else if (randomValue > 0.6) colorClass = colors[1];
          else if (randomValue > 0.3) colorClass = colors[0];
          return <div key={i} className={`aspect-square rounded-[1px] ${colorClass}`} />;
        })}
      </div>
    </div>
  );
};

const jobStatusData = [
  { company: '삼성전자', role: 'Software Engineer', dDay: 'D-5' },
  { company: '네이버', role: 'Frontend Developer', dDay: 'D-12' },
  { company: '카카오', role: 'Backend Developer', dDay: 'D-2' },
];

const JobStatus = () => (
    <div className="divide-y divide-slate-100">
      <div className="flex justify-between items-center pb-3 px-1">
        <h3 className="font-semibold text-md text-slate-700">지원 현황</h3>
        <a href="#" className="group relative text-xs font-bold text-[#7184e6] flex items-center gap-1">
          <span>전체보기</span>
          <ChevronRight className="size-3" />
          <span className="absolute bottom-[-2px] left-0 w-full h-[1.5px] bg-[#7184e6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
        </a>
      </div>
      <div className="space-y-1 pt-2">
        {jobStatusData.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer hover:bg-slate-50"
          >
            <div>
              <p className="font-semibold text-sm text-slate-700">{item.company}</p>
              <p className="text-xs text-slate-500">{item.role}</p>
            </div>
            <div className="text-red-500 text-xs font-mono font-bold">
              {item.dDay}
            </div>
          </div>
        ))}
      </div>
    </div>
);

const Sidebar = () => {
  return (
    <aside className="w-full bg-white/50 backdrop-blur-md border-l border-slate-200 p-6 flex flex-col gap-8">
      <ActivityLog />
      <JobStatus />
    </aside>
  );
};

export default Sidebar;