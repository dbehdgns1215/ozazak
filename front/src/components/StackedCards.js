import React, { useRef, useState, useEffect } from 'react';
import { Palette, Layout, TrendingUp, Compass, User, ChevronRight, Heart, Eye, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import { getCommunityPostDetail } from '../api/community';

gsap.registerPlugin(ScrollTrigger);

const INITIAL_CARDS_DATA = [
  {
    id: 1,
    postId: 304,
    company: "Samsung",
    role: "Brand Designer",
    userName: "윤디자인",
    title: "글로벌 삼성이 정의하는 '초연결 시대'의 디자인 언어",
    desc: "단순한 심미성을 넘어, 전 세계 사용자가 동일한 브랜드 경험을 누릴 수 있도록 설계된 차세대 통합 디자인 시스템(Design System) 구축기를 공유합니다.",
    tags: ["#BrandIdentity", "#CX디자인", "#DesignSystem", "#SamsungUX"],
    stats: { likes: 342, views: 6200 },
    logoColor: "#1428A0", // 삼성 블루
    logoImg: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg",
    icon: Palette
  },
  {
    id: 2,
    postId: 305,
    company: "Naver",
    role: "Service Planner",
    userName: "이기획",
    title: "100만 명의 일상에 녹아드는 하이퍼로컬 서비스 기획법",
    desc: "데이터로 발견한 사용자 이탈 지점을 해결하고, 동네 기반 커뮤니티 활성화를 위해 서비스 동선과 기능을 전면 개편하며 얻은 인사이트를 담았습니다.",
    tags: ["#데이터분석", "#하이퍼로컬", "#PM", "#ServicePlanning"],
    stats: { likes: 215, views: 4800 },
    logoColor: "#03C75A", // 네이버 그린
    logoImg: "https://i.namu.wiki/i/p_1IEyQ8rYenO9YgAFp_LHIAW46kn6DXT0VKmZ_jKNijvYth9DieYZuJX_E_H_4GkCER_sVKhMqSyQYoW94JKA.svg",
    icon: Layout
  },
  {
    id: 3,
    postId: 306,
    company: "Kakao",
    role: "Growth Marketer",
    userName: "정마케터",
    title: "팬덤을 만드는 카카오만의 감성 마케팅과 보이스 톤",
    desc: "브랜드가 유저의 친한 친구처럼 느껴지게 하는 법. 카카오 캐릭터를 활용한 시즌 캠페인 성공 사례와 유저의 반응을 이끌어내는 카피라이팅 노하우입니다.",
    tags: ["#브랜딩", "#콘텐츠전략", "#팬덤마케팅", "#GrowthMarketing"],
    stats: { likes: 189, views: 3500 },
    logoColor: "#FFCD00", // 카카오 옐로우 (조정)
    logoImg: "https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg",
    icon: TrendingUp
  },
  {
    id: 4,
    postId: 307,
    company: "Hyundai",
    role: "Mobility Strategist",
    userName: "박전략",
    title: "제조사를 넘어 모빌리티 플랫폼으로, 현대차의 비즈니스 전환",
    desc: "하드웨어 중심에서 서비스 중심으로 변화하는 산업 트렌드를 읽고, 새로운 모빌리티 고객 접점을 설계하며 고민했던 미래 비즈니스 모델을 정리했습니다.",
    tags: ["#미래전략", "#현대자동차", "#BusinessStrategy", "#Mobility", "#SDV"],
    stats: { likes: 156, views: 2900 },
    logoColor: "#002C5F", // 현대차 네이비
    logoImg: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg",
    icon: Compass
  },
];


const StackedCards = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const leftContentInfosRef = useRef([]);
  const rightCardsRef = useRef([]);
  const [cards, setCards] = useState(INITIAL_CARDS_DATA);

  // 실시간 데이터 연동
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const updatedCards = await Promise.all(INITIAL_CARDS_DATA.map(async (card) => {
          try {
            const response = await getCommunityPostDetail(card.postId);
            const postData = response.data || response;
            const author = postData.author || {};

            // 날짜 포맷팅: YYYY.MM.DD
            const formattedDate = postData.createdAt
              ? new Date(postData.createdAt).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')
              : '2024.03.15';

            return {
              ...card,
              userName: author.name || card.userName,
              userImg: author.img || null,
              company: author.companyName || card.company,
              date: formattedDate,
              stats: {
                likes: postData.reaction ? postData.reaction.length : card.stats.likes,
                views: postData.view !== undefined ? postData.view : card.stats.views
              }
            };
          } catch (error) {
            console.error(`Failed to fetch stats for postId ${card.postId}:`, error);
            return {
              ...card,
              date: '2024.03.15'
            };
          }
        }));
        setCards(updatedCards);
      } catch (error) {
        console.error("Failed to fetch StackedCards stats:", error);
      }
    };

    fetchStats();
  }, []);

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

        {/* ▼▼▼ Left Column (Sticky Text) ▼▼▼ */}
        <div className="lg:w-1/2 h-screen sticky top-0 flex flex-col pointer-events-none">
          <div className="relative w-full h-full">
            {cards.map((card, i) => (
              <div
                key={card.id}
                ref={el => leftContentInfosRef.current[i] = el}
                className={`absolute top-0 left-0 w-full flex flex-col h-full px-4 pr-12
                  ${i === 0 ? 'justify-start pt-28' : 'justify-center'}`}
              >

                <div className="flex items-center gap-5 mb-8 pl-2 transition-all duration-500 group">
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-10 bg-current" style={{ color: card.logoColor }}></div>
                    <img
                      src={card.logoImg}
                      alt={card.company}
                      className="w-12 h-12 lg:w-14 lg:h-14 relative z-10 object-contain"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="font-bold text-lg lg:text-xl mb-1 tracking-wide uppercase" style={{ color: card.logoColor }}>
                      Official Pass
                    </span>
                    <h2 className="text-5xl lg:text-7xl font-extrabold text-white leading-none tracking-tight drop-shadow-lg break-keep">
                      {card.company} 합격
                    </h2>
                  </div>
                </div>

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

        {/* Right Column (Scrollable Cards) */}
        <div className="lg:w-1/2 w-full pt-0 pb-[20vh]">
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={el => rightCardsRef.current[i] = el}
              className={`w-full min-h-screen flex justify-center p-4 lg:px-4 
                ${i === 0 ? 'items-start pt-32' : 'items-center'}`}
            >
              <div
                onClick={() => navigate(`/community/post/${card.postId}`)}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group"
              >
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-500">
                      {card.userImg ? (
                        <img
                          src={card.userImg}
                          alt={card.userName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/default-profile.jpg'; }}
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{card.userName}</p>
                      <p className="text-xs text-slate-500 font-medium">{card.role} @ {card.company}</p>
                    </div>
                  </div>
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
                    {/* <div className="absolute inset-0 flex items-center justify-center">
                      <img src={card.logoImg} alt={card.company} className="w-16 h-16 object-contain opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500" />
                    </div> */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-bold border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        자세히 보기
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
                  <span>{card.date || "2024.03.15"} 작성됨</span>
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