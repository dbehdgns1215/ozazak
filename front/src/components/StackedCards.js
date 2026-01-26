import React, { useEffect, useRef } from 'react';
import { Briefcase, MessageSquare, Book } from 'lucide-react';

const CARDS_DATA = [
  { id: 1, company: "Naver", title: "리액트 쿼리 최적화 경험", desc: "캐시 전략과 prefetching을 활용하여 초기 로딩 속도를 70% 개선하고, 사용자 경험을 크게 향상시켰습니다.", icon: Book, logo: 'N' },
  { id: 2, company: "Toss", title: "UX 개선을 통한 결제 플로우 전환율 20% 증가", desc: "A/B 테스트와 사용자 피드백을 기반으로 결제 UI를 간소화하여, 사용자의 이탈률을 줄이고 전환율을 높였습니다.", icon: MessageSquare, logo: 'T' },
  { id: 3, company: "Kakao", title: "MSA 기반 백엔드 시스템 설계", desc: "이벤트 기반 아키텍처를 도입하여 서비스 간 결합도를 낮추고, 시스템 확장성과 안정성을 확보했습니다.", icon: Briefcase, logo: 'K' },
  { id: 4, company: "Woowa Bros", title: "CI/CD 파이프라인 자동화", desc: "Jenkins와 Docker를 사용하여 배포 프로세스를 자동화하고, 테스트 커버리지를 90%까지 끌어올렸습니다.", icon: Briefcase, logo: 'W' },
];

const StackedCards = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    // GSAP/Animation logic is untouched
    const container = containerRef.current;
    if (!container) return;
    
    const cards = cardsRef.current;
    const numCards = cards.length;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let activeIndex = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDown = scrollTop > lastScrollTop;
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      
      const { top: containerTop, height: containerHeight } = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (containerTop < windowHeight && containerTop > -containerHeight) {
        const scrollPosition = windowHeight - containerTop;
        const scrollPercentage = (scrollPosition / (containerHeight + windowHeight)) * 100;
        
        const newIndex = Math.floor(scrollPercentage / (100 / numCards));

        if (newIndex !== activeIndex) {
          if (scrollDown && newIndex > activeIndex) {
            if (cards[activeIndex]) {
              cards[activeIndex].classList.add('slide-up');
            }
          } else if (!scrollDown && newIndex < activeIndex) {
            if (cards[activeIndex - 1]) {
              cards[activeIndex - 1].classList.remove('slide-up');
            }
          }
          activeIndex = newIndex < numCards ? newIndex : numCards -1;
        }

        cards.forEach((card, i) => {
          if (card) {
            if (i > activeIndex) {
              const scale = 1 - (i - activeIndex) * 0.05;
              const translateY = (i - activeIndex) * 40;
              card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            } else {
              card.style.transform = 'scale(1) translateY(0px)';
            }
          }
        });
      }
    };
    
    cards.forEach((card, i) => {
        if(card) {
            card.style.zIndex = numCards - i;
        }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
          .stack-card.slide-up {
              transform: translateY(-150%) scale(1.1) !important;
              opacity: 0 !important;
          }
      `}</style>
      <div ref={containerRef} className="relative h-[400vh] w-full">
        <div className="sticky top-24 h-[calc(100vh-12rem)] flex flex-col items-center justify-start py-8">
          {/* Applying the Glass Container Style to the content wrapper */}
          <div className="bg-transparent p-8 w-full max-w-5xl flex-1 flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6 text-center">
              🏆 합격자들은 이렇게 학습했습니다
            </h2>
            <div className="relative w-full h-full flex-1">
              {CARDS_DATA.map((card, i) => (
                <div 
                  key={card.id}
                  ref={el => cardsRef.current[i] = el}
                  // Applying the Glass Card Style here
                  className="stack-card absolute top-0 left-0 w-full h-full p-8 flex flex-col justify-between 
                             bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm 
                             transition-all duration-300 hover:border-[#7184e6] hover:shadow-md"
                  style={{
                    // Kept existing transition properties, hover:-translate-y-1 is handled by GSAP
                    transition: 'transform 1.3s cubic-bezier(0.9, -0.2, 0.1, 1.2), opacity 1.3s cubic-bezier(1, 0, 0, 1)',
                    willChange: 'transform, opacity'
                  }}
                >
                  <div>
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-lg">{card.logo}</div>
                          <div>
                              <h3 className="text-xl font-bold text-slate-900">{card.company}</h3>
                              <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                          </div>
                      </div>
                      <p className="text-base text-slate-600 leading-relaxed">"{card.desc}"</p>
                  </div>
                  <div className="text-right font-mono text-slate-400 text-sm">
                      {i + 1} / {CARDS_DATA.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StackedCards;