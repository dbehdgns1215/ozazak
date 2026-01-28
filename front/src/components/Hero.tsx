import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Observer);

const slideData = [
  {
    id: 1,
    title: "AI WRITER",
    subtitle: "당신의 경험이 합격 자소서가 됩니다.",
    link: "/generate",
    image: null,
  },
  {
    id: 2,
    title: "TODAY I LEARNED",
    subtitle: "매일의 배움을 기록하고 성장하세요.",
    link: "/til",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "JOB OPPORTUNITIES",
    subtitle: "마감 직전 공고를 놓치지 마세요.",
    link: "/recruitments",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const currentIndex = useRef(0);

  // [기능 추가] 다음 섹션으로 스크롤 내리는 함수
  const scrollToNextSection = (indicators: HTMLElement[]) => {
    // 4번째 막대 활성화 애니메이션
    gsap.to(indicators, { opacity: 0.2, scaleX: 1, duration: 0.3 });
    gsap.to(indicators[3], { opacity: 1, scaleX: 2.5, duration: 0.3 });

    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.hero-slide');
    const outerWrappers = gsap.utils.toArray<HTMLElement>('.slide-outer');
    const innerWrappers = gsap.utils.toArray<HTMLElement>('.slide-inner');
    const indicators = gsap.utils.toArray<HTMLElement>('.indicator-bar');

    // --------------------------------------------------------
    // 1. 초기 상태 설정
    // --------------------------------------------------------
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    gsap.set(outerWrappers[0], { yPercent: 0 });
    gsap.set(innerWrappers[0], { yPercent: 0 });
    
    gsap.set(sections, { autoAlpha: 1, zIndex: 0 });
    gsap.set(sections[0], { zIndex: 10 });
    
    // 인디케이터 초기화
    gsap.set(indicators, { opacity: 0.2, scaleX: 1 });
    gsap.set(indicators[0], { opacity: 1, scaleX: 2.5 }); 

    // --------------------------------------------------------
    // 2. 섹션 이동 함수 (gotoSection)
    // --------------------------------------------------------
    const gotoSection = (index: number, direction: number) => {
      if (animating.current) return;
      animating.current = true;

      const nextIndex = index;
      const prevIndex = currentIndex.current;

      const tl = gsap.timeline({
        defaults: { duration: 1.0, ease: "power3.inOut" },
        onComplete: () => {
          animating.current = false;
          currentIndex.current = nextIndex;
        }
      });

      gsap.set(sections, { zIndex: 0 });
      gsap.set(sections[prevIndex], { zIndex: 1 });
      gsap.set(sections[nextIndex], { zIndex: 2 });

      gsap.set(outerWrappers[nextIndex], { yPercent: 100 * direction });
      gsap.set(innerWrappers[nextIndex], { yPercent: -100 * direction });

      tl.to(outerWrappers[nextIndex], { yPercent: 0 }, 0)
        .to(innerWrappers[nextIndex], { yPercent: 0 }, 0)
        .to(outerWrappers[prevIndex], { yPercent: -100 * direction }, 0)
        .to(innerWrappers[prevIndex], { yPercent: 100 * direction }, 0);

      // 인디케이터 애니메이션
      tl.to(indicators, { opacity: 0.2, scaleX: 1, duration: 0.5 }, 0);
      if (nextIndex < slideData.length) {
        tl.to(indicators[nextIndex], { opacity: 1, scaleX: 2.5, duration: 0.5 }, 0);
      }
    };

    // --------------------------------------------------------
    // [기능 추가] 클릭 핸들러 - 컨텍스트 내에서 실행되도록 수정
    // --------------------------------------------------------
    const bars = document.querySelectorAll('.indicator-bar-wrapper');
    bars.forEach((bar, i) => {
      bar.addEventListener('click', () => {
        if (animating.current || i === currentIndex.current) return;

        // 4번째(index 3) 막대 클릭 시 -> 스크롤 다운
        if (i === slideData.length) { 
          scrollToNextSection(indicators);
          return;
        }

        // 일반 슬라이드 클릭 시
        if (i < slideData.length) {
          const direction = i > currentIndex.current ? 1 : -1;
          gotoSection(i, direction);
        }
      });
    });

    // --------------------------------------------------------
    // 3. 스크롤 감지
    // --------------------------------------------------------
    Observer.create({
      target: mainRef.current,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => {
        if (animating.current) return;
        if (currentIndex.current > 0) {
          gotoSection(currentIndex.current - 1, -1);
        }
      },
      onUp: () => {
        if (animating.current) return;

        if (currentIndex.current < sections.length - 1) {
          gotoSection(currentIndex.current + 1, 1);
        } else {
          // 마지막 슬라이드에서 스크롤 다운
          scrollToNextSection(indicators);
        }
      },
      tolerance: 10,
      preventDefault: true,
    });

  }, { scope: mainRef });

  return (
    <section ref={mainRef} className="relative h-screen w-full overflow-hidden bg-slate-900">
      
      {/* [인디케이터 UI 수정]
        1. pointer-events-none 삭제 -> pointer-events-auto (클릭 가능하게)
        2. z-50 유지
      */}
      <div className="fixed right-0 top-0 h-screen w-12 z-50 flex flex-col justify-between py-4 mix-blend-difference pointer-events-auto">
        {[0, 1, 2, 3].map((item) => (
          <div 
            key={item}
            className="indicator-bar-wrapper flex-1 flex items-center justify-end cursor-pointer group"
          >
            {/* 실제 보이는 막대 (클릭 영역 확보를 위해 wrapper 사용) */}
            <div 
              className="indicator-bar w-1.5 h-full bg-white origin-right shadow-[0_0_10px_rgba(255,255,255,0.5)] rounded-l-sm transition-transform duration-300 group-hover:scale-x-150"
              style={{ opacity: 0.2 }}
            />
          </div>
        ))}
      </div>

      {/* 슬라이드 영역 */}
      {slideData.map((slide, index) => (
        <div
          key={slide.id}
          className="hero-slide absolute inset-0 w-full h-full"
          style={{ zIndex: index === 0 ? 1 : 0 }}
        >
          <div className="slide-outer w-full h-full overflow-hidden absolute inset-0">
            {/* [디자인 수정] 
              flex items-center -> items-center
              pb-32 추가: 컨텐츠를 하단 패딩으로 밀어올림 (시각적으로 위로 이동)
            */}
            <div className="slide-inner w-full h-full overflow-hidden absolute inset-0 flex items-center justify-center pb-32">

              {/* 이미지 배경 */}
              <div className="absolute inset-0 w-full h-full">
                {slide.image ? (
                  <div
                    className="w-full h-full bg-cover bg-center absolute inset-0"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 absolute inset-0" />
                )}
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* 텍스트 컨텐츠 */}
              <div className="relative z-10 text-center text-white px-6">
                <h2
                  className="text-6xl md:text-9xl font-black mb-6 tracking-tighter uppercase"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl font-light mb-10 opacity-90">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => navigate(slide.link)}
                  className="px-8 py-3 border border-white/30 bg-white/10 hover:bg-white text-white hover:text-black font-bold rounded-full backdrop-blur-md transition-all duration-300"
                >
                  바로가기 &rarr;
                </button>
              </div>

            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Hero;