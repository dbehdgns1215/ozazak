import React, { useState } from 'react';
import { Search, ThumbsUp, MessageSquare, Eye, CalendarDays, MoreVertical } from 'lucide-react';

const techTags = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'Python', 'Java', 'Spring', 'Next.js'];

const tilData = [
  {
    id: 1,
    author: '김민준',
    handle: 'minjun_kim',
    avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026704d',
    title: 'React 19 Server Components 핵심 정리',
    content: '오늘은 React 19의 Server Components에 대해 공부했습니다. Server Components는 서버에서 실행되는 컴포넌트로, 클라이언트 JavaScript 번들을 보내지 않아 성능이 크게 향상됩니다. 특히 대용량 라이브러리를 서버에서만 사용할 수 있어 번들 크기가 줄어듭니다...',
    tags: ['#React', '#JavaScript', '#프론트엔드'],
    stats: { likes: 24, comments: 12, views: 342 },
    date: '2024-07-21'
  },
  {
    id: 2,
    author: '이준호',
    handle: 'junho_lee',
    avatar: 'https://i.pravatar.cc/40?u=a042581f4e29026705d',
    title: 'TypeScript 제네릭 완벽 정복',
    content: 'TypeScript 제네릭은 재사용 가능한 컴포넌트를 만드는데 필수적입니다. any를 사용하는 대신 제네릭을 사용하면 타입 안정성을 유지하면서 다양한 타입을 처리할 수 있습니다. 오늘 제네릭을 사용하여 유틸리티 함수를 몇 개 만들어보았습니다.',
    tags: ['#TypeScript', '#JavaScript'],
    stats: { likes: 45, comments: 15, views: 580 },
    date: '2024-07-20'
  },
];

const TILCard = ({ til }) => {
    return (
        <div className="p-6 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl hover:border-primary hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <img src={til.avatar} alt={til.author} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-bold text-slate-800">{til.author} <span className="text-sm font-normal text-slate-500">@{til.handle}</span></p>
                        <p className="text-sm text-slate-500">합격자 · 네이버</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{til.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed clamp-3">{til.content}</p>
            </div>

            <div className="mt-4 flex gap-2">
                {til.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">{tag}</span>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><ThumbsUp size={14} /> {til.stats.likes}</span>
                    <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {til.stats.comments}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Eye size={14} /> {til.stats.views}
                </div>
            </div>
        </div>
    )
}

const FilterSidebar = () => {
    return (
        <aside className="w-full lg:w-1/4 lg:pr-8">
            <div className="p-6 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl sticky top-24">
                <h3 className="text-slate-900 font-bold text-lg tracking-tight mb-4">필터</h3>
                <div className="relative mb-4">
                    <input type="text" placeholder="검색" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                
                <div className="mb-6">
                    <h4 className="font-semibold text-slate-800 mb-3">정렬</h4>
                    <select className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>최신순</option>
                        <option>조회순</option>
                        <option>반응순</option>
                    </select>
                </div>
                
                <div>
                    <h4 className="font-semibold text-slate-800 mb-3">기술 스택</h4>
                    <div className="flex flex-wrap gap-2">
                        {techTags.map(tag => (
                            <button key={tag} className="px-3 py-1.5 text-sm border border-slate-300 rounded-full hover:bg-slate-100 hover:border-slate-400 transition-colors">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default function TILPage() {
  return (
    <div className="w-full">
        <div className="mb-8">
            <h1 className="text-slate-900 font-bold text-2xl tracking-tight">TIL</h1>
            <p className="text-slate-600 mt-1">오늘 배운 것을 공유하고 회고해보세요</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar />
            <main className="w-full lg:w-3/4">
                <div className="space-y-6">
                    {tilData.map(til => (
                        <TILCard key={til.id} til={til} />
                    ))}
                </div>
            </main>
        </div>
    </div>
  );
}
