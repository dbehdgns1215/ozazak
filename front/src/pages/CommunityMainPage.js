import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Flame, Briefcase, FileText, BookOpen, Star, PenTool } from 'lucide-react';

const categories = [
  { id: 'free', name: '자유게시판', icon: MessageSquare, desc: '자유롭게 소통하는 공간' },
  { id: 'hot', name: 'HOT 게시판', icon: Flame, desc: '지금 가장 인기 있는 글' },
  { id: 'reviews', name: '취업 후기', icon: Briefcase, desc: '합격/불합격 후기 공유' },
  { id: 'correction', name: '자소서 첨삭', icon: FileText, desc: '서로의 자소서를 봐주세요' },
  { id: 'study', name: '스터디 모집', icon: BookOpen, desc: '함께 공부할 동료 찾기' },
  { id: 'qna', name: '질문 & 답변', icon: Star, desc: '궁금한 점을 물어보세요' },
];

export default function CommunityMainPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(categories[0].id);

  return (
    <div className="min-h-screen text-white pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">커뮤니티</h1>
            <p className="text-slate-400">개발자들과 함께 성장하는 소통 공간</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 glass-dark rounded-xl border border-white/5 bg-slate-800/50 w-fit">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                // Optional: navigate to specific route if desired, or just filter content here.
                // Requirements say "Category Tabs", but also independent "CommunityListPage" route exists.
                // We can either render list here or navigate.
                // Navigating enables separate page per board.
                navigate(`/community/${cat.id}`);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === cat.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content Preview based on selection - Currently redirecting via onClick above.
                    But if we want to show a summary here, we can. 
                    Given the requirement "Implement category tabs", redirecting to the list page seems appropriate 
                    since we have `/community/:boardId` route. 
                */}

        <div className="glass-dark p-8 rounded-3xl border border-white/5 text-center py-20">
          <div className="bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">게시판을 선택해주세요</h2>
          <p className="text-slate-400">상단 탭을 눌러 원하는 게시판으로 이동하세요.</p>
        </div>
      </div>
    </div>
  );
}
