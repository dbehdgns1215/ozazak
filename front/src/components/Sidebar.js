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
        <h3 className="font-bold text-slate-800 text-sm">활동 기록</h3>
        <span className="text-xs font-mono text-slate-400">2024</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((_, i) => {
          const randomValue = Math.random();
          let colorClass = 'bg-slate-100';
          if (randomValue > 0.9) colorClass = colors[3];
          else if (randomValue > 0.75) colorClass = colors[2];
          else if (randomValue > 0.6) colorClass = colors[1];
          else if (randomValue > 0.3) colorClass = colors[0];
          return <div key={i} className={`aspect-square rounded-[3px] ${colorClass}`} />;
        })}
      </div>
    </div>
  );
};

const jobStatusData = [
  { company: '삼성전자', role: 'SW Engineer', dDay: 'D-5' },
  { company: '네이버', role: 'Frontend', dDay: 'D-12' },
  { company: '카카오', role: 'Backend', dDay: 'D-2' },
];

const JobStatus = () => (
  <div className="divide-y divide-slate-100/50">
    <div className="flex justify-between items-center pb-2 px-1">
      <h3 className="font-bold text-slate-800 text-sm">지원 현황</h3>
      <a href="#" className="group relative text-xs font-bold text-[#7184e6] flex items-center gap-1">
        <span>전체보기</span>
        <ChevronRight className="size-3" />
      </a>
    </div>
    <div className="space-y-1.5 pt-1">
      {jobStatusData.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer hover:bg-white/60 group"
        >
          <div>
            <p className="font-bold text-sm text-slate-800 group-hover:text-[#7184e6] transition-colors">{item.company}</p>
            <p className="text-[11px] text-slate-500">{item.role}</p>
          </div>
          <div className="bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
            {item.dDay}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Sidebar = () => {
  return (
    <aside className="w-full h-full bg-white/40 backdrop-blur-md rounded-[32px] border border-white/60 shadow-sm p-5 flex flex-col gap-6 justify-between">
      <ActivityLog />
      <div className="w-full h-[1px] bg-slate-200/50"></div>
      <JobStatus />

      {/* Spacer to fill height naturally if needed, or content */}
      <div className="bg-[#7184e6]/5 rounded-xl p-3 border border-[#7184e6]/10 mt-auto">
        <p className="text-[11px] text-[#7184e6] font-semibold mb-0.5">💡 오늘의 팁</p>
        <p className="text-[11px] text-slate-600 leading-snug">
          마감 임박 공고부터 순서대로<br />지원해보세요!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;