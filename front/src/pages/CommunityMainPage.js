import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Flame, Briefcase, FileText, BookOpen, Star, ArrowRight } from 'lucide-react';

const communityCards = [
  {
    icon: MessageSquare,
    title: '자유게시판',
    description: '자유롭게 소통하는 공간',
    stats: { total: '3,421', new: '+67' },
    link: '/community/free',
    color: 'blue'
  },
  {
    icon: Flame,
    title: '핫게시판',
    description: '인기 게시글 모음',
    stats: { total: '234', new: '+12' },
    link: '/community/hot',
    color: 'red'
  },
  {
    icon: Briefcase,
    title: '취업후기',
    description: '합격/불합격 후기, 면접 경험 공유',
    stats: { total: '1,247', new: '+23' },
    link: '/community/reviews',
    color: 'green'
  },
  {
    icon: FileText,
    title: '자소서 첨삭',
    description: '자기소개서 피드백 요청 및 제공',
    stats: { total: '892', new: '+15' },
    link: '/community/cover-letter',
    color: 'purple'
  },
  {
    icon: BookOpen,
    title: 'TIL',
    description: '오늘 배운 것을 공유하고 회고합니다',
    stats: { total: '5,678', new: '+123' },
    link: '/til',
    color: 'indigo'
  },
  {
    icon: Star,
    title: '프로젝트 자랑',
    description: '진행중인 프로젝트를 공유하고 피드백을 받으세요',
    stats: { total: '456', new: '+8' },
    link: '/projects',
    color: 'yellow'
  }
];

const Card = ({ icon: Icon, title, description, stats, link, color }) => {
    return (
        <Link to={link} className="group block p-6 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl hover:border-primary hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100`}>
                        <Icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-slate-900 font-bold text-lg tracking-tight">{title}</h3>
                        <p className="text-slate-500 text-sm">{description}</p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
            <div className="mt-4 flex justify-end items-baseline gap-2 text-sm">
                <span className="text-slate-500">전체 {stats.total}개</span>
                <span className="text-primary font-medium">오늘 {stats.new}</span>
            </div>
        </Link>
    );
};


export default function CommunityMainPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-slate-900 font-bold text-2xl tracking-tight">커뮤니티</h1>
        <p className="text-slate-600 mt-1">취업생들과 정보를 공유하고 소통해보세요</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communityCards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
