import React, { useRef } from 'react';
import { Briefcase, MessageSquare, Book } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CARDS_DATA = [
  { id: 1, company: "Naver", title: "리액트 쿼리 최적화 경험", desc: "캐시 전략과 prefetching을 활용하여 초기 로딩 속도를 70% 개선하고, 사용자 경험을 크게 향상시켰습니다.", icon: Book, logo: 'N' },
  { id: 2, company: "Toss", title: "UX 개선을 통한 결제 플로우 전환율 20% 증가", desc: "A/B 테스트와 사용자 피드백을 기반으로 결제 UI를 간소화하여, 사용자의 이탈률을 줄이고 전환율을 높였습니다.", icon: MessageSquare, logo: 'T' },
  { id: 3, company: "Kakao", title: "MSA 기반 백엔드 시스템 설계", desc: "이벤트 기반 아키텍처를 도입하여 서비스 간 결합도를 낮추고, 시스템 확장성과 안정성을 확보했습니다.", icon: Briefcase, logo: 'K' },
  { id: 4, company: "Woowa Bros", title: "CI/CD 파이프라인 자동화", desc: "Jenkins와 Docker를 사용하여 배포 프로세스를 자동화하고, 테스트 커버리지를 90%까지 끌어올렸습니다.", icon: Briefcase, logo: 'W' },
];

const StackedCards = () => {
  const containerRef = useRef(null);
  const leftContentInfosRef = useRef([]);
  const rightCardsRef = useRef([]);

  useGSAP(() => {
    const leftInfos = leftContentInfosRef.current;
    const rightCards = rightCardsRef.current;

    // 초기 상태
    gsap.set(leftInfos, { autoAlpha: 0, y: 30 });
    gsap.set(leftInfos[0], { autoAlpha: 1, y: 0 });

    rightCards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        // 첫 번째 카드는 이미 보이니까 트리거를 약간 다르게 설정하거나 그대로 둡니다.
        // 나머지는 중앙 쯤 왔을 때 바뀝니다.
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

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 font-pretendard">

        {/* Left Column (Sticky) */}
        {/* 전체 컨테이너는 화면 꽉 차게 둠 */}
        <div className="lg:w-1/2 h-screen sticky top-0 flex flex-col">
          <div className="relative w-full h-full"> {/* h-full로 변경하여 내부에서 정렬 제어 */}
            {CARDS_DATA.map((card, i) => (
              <div
                key={card.id}
                ref={el => leftContentInfosRef.current[i] = el}
                // i === 0 (첫번째) ? justify-start pt-32 (위로 붙임)
                // i !== 0 (나머지) ? justify-center (중앙 정렬)
                className={`absolute top-0 left-0 w-full flex flex-col h-full px-4 
                  ${i === 0 ? 'justify-start pt-32' : 'justify-center'}`}
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight mb-8">
                  <span className="text-[#7184e6] inline-block mb-2">{card.company}</span>
                  <br />
                  <span className="text-slate-800">{card.title}</span>
                </h2>
                <div className="w-16 h-1.5 bg-slate-200 mb-8 rounded-full"></div>
                <p className="text-lg lg:text-xl text-slate-500 leading-relaxed break-keep font-medium">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Scrollable Cards) */}
        <div className="lg:w-1/2 w-full pt-0 pb-[20vh]">
          
          {CARDS_DATA.map((card, i) => (
            <div
              key={card.id}
              ref={el => rightCardsRef.current[i] = el}
              // [핵심 로직 2] 오른쪽 카드 정렬
              // i === 0 (첫번째) ? items-start pt-32 (위로 붙임)
              // i !== 0 (나머지) ? items-center (중앙 정렬)
              className={`w-full min-h-screen flex justify-center p-4 lg:px-10 
                ${i === 0 ? 'items-start pt-32' : 'items-center'}`}
            >
              <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 p-10 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(113,132,230,0.3)] hover:border-[#7184e6]/40 group">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-white to-slate-50 shadow-lg flex items-center justify-center mb-8 text-5xl font-bold text-[#7184e6] border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                  {card.logo}
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-3">{card.company}</h3>
                <p className="text-slate-500 mb-10 text-lg font-medium">{card.title}</p>

                <div className="w-full bg-slate-50/80 rounded-2xl border border-slate-100 p-6 flex items-center justify-center gap-4">
                  <card.icon className="w-8 h-8 text-[#7184e6]" />
                  <span className="text-slate-600 font-semibold">Key Achievement</span>
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