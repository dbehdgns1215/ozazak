import React, { useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; // 스크롤 이동을 위해 추가하면 좋음 (없어도 됨)
import { useGSAP } from '@gsap/react';

// ScrollToPlugin은 선택사항이지만 부드러운 스크롤을 위해 등록 추천
gsap.registerPlugin(Observer, ScrollToPlugin);

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

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.hero-slide');
    const outerWrappers = gsap.utils.toArray<HTMLElement>('.slide-outer');
    const innerWrappers = gsap.utils.toArray<HTMLElement>('.slide-inner');

    // [중요 변경 1] wrap 함수 제거 (무한 루프 방지)
    // const wrap = gsap.utils.wrap(0, sections.length); -> 삭제함

    // --------------------------------------------------------
    // 초기화 로직
    // --------------------------------------------------------
    gsap.set(outerWrappers, { xPercent: 100 });
    gsap.set(innerWrappers, { xPercent: -100 });
    gsap.set(outerWrappers[0], { xPercent: 0 });
    gsap.set(innerWrappers[0], { xPercent: 0 });
    gsap.set(sections, { autoAlpha: 1, zIndex: 0 });
    gsap.set(sections[0], { zIndex: 10 });

    const gotoSection = (index: number, direction: number) => {
      if (animating.current) return;
      animating.current = true;

      // [중요 변경 2] wrap 대신 범위 제한 (0 ~ length-1)
      // 하지만 아래 로직에서 이미 범위를 체크하고 호출하므로 그대로 둠
      const nextIndex = index;
      const prevIndex = currentIndex.current;

      const tl = gsap.timeline({
        defaults: { duration: 1.0, ease: "power3.inOut" },
        onComplete: () => {
          animating.current = false;
          currentIndex.current = nextIndex;
          gsap.set(outerWrappers[prevIndex], { xPercent: 100 * direction });
        }
      });

      gsap.set(sections, { zIndex: 0 });
      gsap.set(sections[prevIndex], { zIndex: 1 });
      gsap.set(sections[nextIndex], { zIndex: 2 });

      gsap.set(outerWrappers[nextIndex], { xPercent: 100 * direction });
      gsap.set(innerWrappers[nextIndex], { xPercent: -100 * direction });

      tl.to(outerWrappers[nextIndex], { xPercent: 0 }, 0)
        .to(innerWrappers[nextIndex], { xPercent: 0 }, 0)
        .to(outerWrappers[prevIndex], { xPercent: -100 * direction }, 0)
        .to(innerWrappers[prevIndex], { xPercent: 100 * direction }, 0);
    };

    Observer.create({
      target: mainRef.current,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => {
        // [스크롤 위로 / 이전 슬라이드]
        if (animating.current) return;

        // 0보다 클 때만 이전 슬라이드로 이동
        if (currentIndex.current > 0) {
          gotoSection(currentIndex.current - 1, -1);
        } else {
          // 첫 번째 슬라이드에서 위로 올리면? -> 그냥 놔둠 (상단 바운스 효과 등 원하면 추가)
          console.log("Already at the start");
        }
      },
      onUp: () => {
        // [스크롤 아래로 / 다음 슬라이드]
        if (animating.current) return;

        // [중요 변경 3] 마지막 슬라이드가 아닐 때만 슬라이드 이동
        if (currentIndex.current < sections.length - 1) {
          gotoSection(currentIndex.current + 1, 1);
        } else {
          // [핵심 해결책] 마지막 슬라이드라면? -> 윈도우 스크롤을 강제로 아래로 내림!
          // preventDefault가 켜져 있어도, window.scrollTo는 작동합니다.
          // Hero 섹션의 높이(h-screen)만큼 아래로 이동시킵니다.

          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });

          // 만약 부드러운 스크롤 플러그인이 있다면:
          // gsap.to(window, { scrollTo: window.innerHeight, duration: 1, ease: "power2.out" });
        }
      },
      tolerance: 10,
      preventDefault: true, // 이 설정 때문에 우리가 수동으로 window.scrollTo를 해줘야 함
    });

  }, { scope: mainRef });

  return (
    <section ref={mainRef} className="relative h-screen w-full overflow-hidden bg-slate-900">
      {slideData.map((slide, index) => (
        <div
          key={slide.id}
          className="hero-slide absolute inset-0 w-full h-full"
          style={{ zIndex: index === 0 ? 1 : 0 }}
        >
          <div className="slide-outer w-full h-full overflow-hidden absolute inset-0">
            <div className="slide-inner w-full h-full overflow-hidden absolute inset-0 flex items-center justify-center">

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