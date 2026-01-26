import React from 'react';

const bentoItems = [
  {
    id: 1,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    title: '김스크립터',
    description: 'React 상태관리 마스터하기',
    company: 'N',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    colSpan: 'col-span-2',
    rowSpan: 'row-span-1',
    title: '이개발자',
    description: '백엔드 아키텍처 설계 과정 (우수 사례)',
    company: 'K',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 3,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-2',
    title: '박코딩',
    description: '알고리즘 코딩테스트 노트',
    company: 'L',
    image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    title: '최디자인',
    description: 'UI/UX 케이스 스터디',
    company: 'C',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
    {
    id: 5,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    title: '정풀스택',
    description: 'CI/CD 파이프라인 구축기',
    company: 'T',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
  },
];

const BentoCard = ({ item }) => (
  <div
    className={`group relative ${item.colSpan} ${item.rowSpan} rounded-2xl overflow-hidden cursor-pointer border border-slate-200/50 hover:border-slate-300 transition-all duration-300`}
  >
    <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <div className="flex justify-between items-end">
            <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-slate-300 mt-1">{item.description}</p>
            </div>
            <div className="flex-shrink-0 bg-white/90 text-slate-800 text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                {item.company}
            </div>
        </div>
    </div>
  </div>
);


const ActivityLog = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">🏆 합격자 학습 기록</h2>
      <div className="grid grid-cols-3 grid-rows-2 gap-6 min-h-[600px]">
        {bentoItems.map((item) => (
          <BentoCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default ActivityLog;
