import React, { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Title Parallax (AI WRITER)
      gsap.fromTo(
        ".heading-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.2
        }
      );

      // ScrollTrigger for main hero text parallax exit
      gsap.to(".hero-main", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-main",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 2. Parallax Sections (TIL & Jobs)
      const sections = document.querySelectorAll(".parallax-section");
      sections.forEach((section) => {
        const img = section.querySelector("img");
        const text = section.querySelector(".content-wrapper");

        if (img) {
          gsap.fromTo(img,
            { yPercent: -20 },
            {
              yPercent: 20,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }

        if (text) {
          gsap.fromTo(text,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              scrollTrigger: {
                trigger: section,
                start: "top 70%", // Animate when section is near center
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-wrapper" ref={wrapperRef}>
      <div id="wrapper">
        <section id="content">

          {/* -------------------------------------------------------------
              1. AI WRITER (Hero)
          ------------------------------------------------------------- */}
          <section className="hero-main min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center p-6 bg-slate-900">
            <div className="z-10 max-w-5xl mx-auto">
              {/* Changed tracking-tighter to tracking-normal or tracking-wide due to condensed font */}
              <h1 className="heading-text text-6xl md:text-9xl font-black mb-6 tracking-normal text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                AI WRITER
              </h1>
              <p className="heading-text text-xl md:text-2xl font-light text-white/90 mb-12 tracking-widest font-sans">
                당신의 경험이 합격 자소서가 됩니다.
              </p>
              <div className="heading-text">
                <button
                  onClick={() => navigate('/generate')}
                  className="px-10 py-4 border border-white/30 bg-white/5 hover:bg-white hover:text-black text-white rounded-full transition-all duration-300 backdrop-blur-sm text-lg font-bold"
                >
                  바로가기 &rarr;
                </button>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-black/80 pointer-events-none" />
          </section>

          {/* -------------------------------------------------------------
              2. TODAY I LEARNED
          ------------------------------------------------------------- */}
          <section className="parallax-section min-h-screen relative flex items-center justify-center overflow-hidden py-24 bg-slate-900">
            {/* Background Image Parallax */}
            <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2670&auto=format&fit=crop"
                alt="Today I Learned"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="content-wrapper relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full text-white">
              <div className="text-left">
                <h2 className="text-6xl md:text-9xl font-black mb-6 tracking-normal uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  TODAY<br />I LEARNED
                </h2>
                <div className="h-1 w-24 bg-white mb-8" />
                <p className="text-xl md:text-2xl font-light text-white/90 mb-10 leading-relaxed font-sans">
                  매일의 배움을 기록하고 성장하세요.<br />
                  꾸준한 기록이 당신의 자산이 됩니다.
                </p>
                <button
                  onClick={() => navigate('/til')}
                  className="px-8 py-3 border border-white hover:bg-white hover:text-black text-white rounded-full transition-all duration-300 text-lg font-bold"
                >
                  기록하러 가기 &rarr;
                </button>
              </div>
              {/* Optional decorative element on right */}
              <div className="hidden md:block border-l border-white/20 pl-12">
                <span className="text-9xl text-white/10 font-black title-font">01</span>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              3. JOB OPPORTUNITIES
          ------------------------------------------------------------- */}
          <section className="parallax-section min-h-screen relative flex items-center justify-center overflow-hidden py-24 bg-black">
            {/* Background Image Parallax */}
            <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                alt="Job Opportunities"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
            </div>

            <div className="content-wrapper relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center w-full text-white">
              <span className="text-xs font-bold tracking-[0.5em] text-white/60 mb-4 border border-white/20 px-4 py-2 rounded-full uppercase">Recruitment</span>
              <h2 className="text-6xl md:text-9xl font-black mb-8 tracking-normal uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                JOB OPPORTUNITIES
              </h2>
              <p className="text-xl md:text-2xl font-light text-white/80 mb-12 font-sans max-w-3xl leading-relaxed">
                마감 직전 공고를 놓치지 마세요. <br />
                <span className="text-base text-white/50 mt-2 block">여러분의 커리어 도약을 위한 기회들을 지금 바로 확인해보세요.</span>
              </p>
              <button
                onClick={() => navigate('/recruitments')}
                className="group relative px-10 py-4 overflow-hidden rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                <span className="relative z-10 group-hover:text-black transition-colors">공고 확인하기</span>
              </button>
            </div>
          </section>

        </section>
      </div>
    </div>
  );
};

export default Hero;