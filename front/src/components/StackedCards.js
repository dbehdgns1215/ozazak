import React, { useRef } from 'react';
import { Briefcase, MessageSquare, Book, Code, User, ChevronRight, Heart, Eye, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// (CARDS_DATA는 이전과 동일합니다. 코드를 줄이기 위해 생략했지만, 그대로 사용하시면 됩니다.)
const CARDS_DATA = [
  {
    id: 1,
    company: "Samsung",
    role: "UX Engineer",
    userName: "이토스",
    title: "삼성이 집착하는 퍼널 최적화, 직접 구현해보기",
    desc: "삼성 테크 블로그를 읽고 내 프로젝트의 결제 이탈률을 줄이기 위해 시도했던 UX 개선 코드 기록입니다.",
    tags: ["#UX", "#Funnel", "#A/B테스트"],
    stats: { likes: 215, views: 5100 },
    logoColor: "#1428A0", // 삼성 블루
    icon: MessageSquare

  },
  {
    id: 2,
    company: "Naver",
    role: "Frontend Dev",
    userName: "박개발",
    title: "면접에서 질문받은 리액트 쿼리 캐싱 전략 정리",
    desc: "실무 면접에서 가장 까다로웠던 'staleTime'과 'cacheTime'의 차이, 그리고 실제 프로젝트 적용 사례를 정리했습니다.",
    tags: ["#면접기출", "#ReactQuery", "#신입공채"],
    stats: { likes: 142, views: 3200 },
    logoColor: "#03C75A", // 네이버 그린
    icon: Book
  },
  {
    id: 3,
    company: "Kakao",
    role: "Backend Dev",
    userName: "김카카오",
    title: "대용량 트래픽 처리를 위한 카프카 도입기",
    desc: "채팅 서비스 프로젝트를 하며 겪은 동시성 이슈와 이를 해결하기 위해 MSA 구조로 리팩토링한 과정을 담았습니다.",
    tags: ["#Backend", "#Kafka", "#MSA"],
    stats: { likes: 89, views: 1800 },
    logoColor: "#FEE500", // 카카오 옐로우
    icon: Briefcase
  },
  {
    id: 4,
    company: "Woowa Bros",
    role: "DevOps",
    userName: "최배달",
    title: "배민 다녔던 멘토님께 피드백 받은 CI/CD 파이프라인",
    desc: "Github Actions로 배포 자동화를 구축하면서 멘토님께 지적받았던 보안 이슈와 해결 방법을 정리했습니다.",
    tags: ["#DevOps", "#CI/CD", "#멘토링"],
    stats: { likes: 120, views: 2400 },
    logoColor: "#2AC1BC", // 배민 민트
    icon: Code
  },
];


const StackedCards = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const leftContentInfosRef = useRef([]);
  const rightCardsRef = useRef([]);

  // GSAP 로직 유지
  useGSAP(() => {
    const leftInfos = leftContentInfosRef.current;
    const rightCards = rightCardsRef.current;

    gsap.set(leftInfos, { autoAlpha: 0, y: 30 });
    gsap.set(leftInfos[0], { autoAlpha: 1, y: 0 });

    rightCards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        onEnter: () => animateLeftContent(i),
        onEnterBack: () => animateLeftContent(i),
      });
    });

    function animateLeftContent(index) {
      leftInfos.forEach((info, i) => {
        if (i !== index) {
          gsap.to(info, { autoAlpha: 0, y: 30, duration: 0.4, overwrite: true });
        }
      });
      gsap.to(leftInfos[index], { autoAlpha: 1, y: 0, duration: 0.4, overwrite: true });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-transparent font-sans py-0 mt-0">
      <style>{`
          @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
          .font-pretendard { font-family: "Pretendard", sans-serif; }
      `}</style>

      {/* Header Section */}
      <div className="flex items-end justify-between max-w-7xl mx-auto px-6 mb-8 pt-0">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">선배들의 합격 노트 훔쳐보기</h1>
          <p className="text-slate-400">실제 합격자들이 취준 기간에 작성했던 TIL을 확인해보세요.</p>
        </div>
        <button
          onClick={() => navigate('/til')}
          className="text-white/80 hover:text-white transition-colors text-sm lg:text-base font-medium mb-1 flex items-center gap-1"
        >
          전체 보러가기 <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 font-pretendard">

        {/* ▼▼▼ Left Column (Sticky Text) - 이 부분이 핵심적으로 변경되었습니다 ▼▼▼ */}
        <div className="lg:w-1/2 h-screen sticky top-0 flex flex-col pointer-events-none">
          <div className="relative w-full h-full">
            {CARDS_DATA.map((card, i) => (
              <div
                key={card.id}
                ref={el => leftContentInfosRef.current[i] = el}
                className={`absolute top-0 left-0 w-full flex flex-col h-full px-4 pr-12
                  ${i === 0 ? 'justify-start pt-28' : 'justify-center'}`}
              >

                {/* 🔥 [NEW] 거대하고 임팩트 있는 합격 엠블럼 디자인 */}
                <div
                  className="flex items-center gap-5 mb-8 pl-2 transition-all duration-500 group"
                >
                  {/* 1. 로고 아이콘 영역 (브랜드 컬러 써클 + 아이콘) */}
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] overflow-hidden shrink-0">
                    {/* 배경에 은은하게 깔리는 브랜드 컬러 */}
                    <div className="absolute inset-0 opacity-10 bg-current" style={{ color: card.logoColor }}></div>
                    {/* 실제 아이콘 */}
                    <card.icon className="w-10 h-10 lg:w-12 lg:h-12 relative z-10 font-bold" style={{ color: card.logoColor, strokeWidth: 2.5 }} />
                    {/* 합격 체크 표시 (우측 하단) */}
                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
                      <CheckCircle2 className="w-6 h-6 fill-current" style={{ color: card.logoColor }} />
                    </div>
                  </div>

                  {/* 2. 텍스트 영역 (거대한 합격 문구) */}
                  <div className="flex flex-col justify-center">
                    {/* 브랜드명을 강조하는 작은 라벨 */}
                    <span className="font-bold text-lg lg:text-xl mb-1 tracking-wide uppercase" style={{ color: card.logoColor }}>
                      Official Pass
                    </span>
                    {/* 메인 합격 텍스트 (가장 크게) */}
                    <h2
                      className="text-5xl lg:text-7xl font-extrabold text-white leading-none tracking-tight drop-shadow-lg break-keep"
                    >
                      {card.company} 합격
                    </h2>
                  </div>
                </div>
                {/* 🔥 [NEW] 디자인 끝 */}

                {/* 타이틀 크기를 합격 문구보다 조금 작게 조정하여 위계 질서 정리 */}
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-200 leading-tight mb-6 break-keep">
                  "{card.title}"
                </h3>

                <p className="text-lg lg:text-xl text-slate-400 leading-relaxed break-keep font-medium mb-8">
                  {card.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, idx) => (
                    <span key={idx} className="text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg text-sm border border-slate-700/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ▲▲▲ Left Column 변경 끝 ▲▲▲ */}


        {/* Right Column (Scrollable Cards) - 이전과 동일 */}
        <div className="lg:w-1/2 w-full pt-0 pb-[20vh]">
          {CARDS_DATA.map((card, i) => (
            <div
              key={card.id}
              ref={el => rightCardsRef.current[i] = el}
              className={`w-full min-h-screen flex justify-center p-4 lg:px-4 
                ${i === 0 ? 'items-start pt-32' : 'items-center'}`}
            >
              {/* (오른쪽 카드 내용은 이전 답변의 코드를 그대로 사용합니다. 지면 관계상 생략합니다.) */}
              <div
                onClick={() => navigate(`/til/${card.id}`)}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group"
              >
                {/* ... (이전 답변의 오른쪽 카드 내부 코드와 동일) ... */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{card.userName}</p>
                      <p className="text-xs text-slate-500">{card.role} @ {card.company}</p>
                    </div>
                  </div>
                  {/* <div className="font-bold text-xl opacity-80" style={{ color: card.logoColor }}>
                        {card.company}
                    </div> */}
                </div>

                <div className="p-6 bg-white relative">
                  <div className="bg-slate-900 rounded-xl p-4 mb-4 relative overflow-hidden group-hover:shadow-lg transition-shadow">
                    <div className="flex gap-1.5 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-2 opacity-60">
                      <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                      <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                      <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                      <div className="h-2 w-full bg-slate-700 rounded"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <card.icon className="text-white/20 w-16 h-16 group-hover:text-white/40 transition-colors transform group-hover:scale-110 duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-bold border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        TIL 읽어보기
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {card.desc}
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Heart size={14} className="text-rose-400" /> {card.stats.likes}</span>
                    <span className="flex items-center gap-1"><Eye size={14} /> {card.stats.views}</span>
                  </div>
                  <span>2024.03.15 작성됨</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StackedCards;