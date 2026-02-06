import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Typewriter Component
const Typewriter = ({
  text,
  onTypeComplete,
  onDeleteComplete,
  className
}: {
  text: string,
  onTypeComplete: () => void,
  onDeleteComplete: () => void,
  className?: string
}) => {
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeSpeed = 150; // 타이핑 속도 늦춤 (기존 100 -> 150)
    const deleteSpeed = 50;
    const waitDuration = 3000; // 타이핑 완료 후 대기 시간 (크랙 유지 시간)

    if (phase === 'typing') {
      if (displayText.length < text.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        // 1. 타이핑 완료 후 1.5초 뒤에 크랙 발생 (요청사항 반영)
        setTimeout(() => {
          onTypeComplete();
        }, 1500);

        // 2. 이후 전체 대기 후 삭제 단계로 전환
        timeoutId = setTimeout(() => {
          setPhase('deleting');
        }, waitDuration);
      }
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length - 1));
        }, deleteSpeed);
      } else {
        // 텍스트가 0이 된 시점입니다.

        // 1. 여기서 1.5초(1500ms) 동안 크랙 상태를 유지하며 멈춰있습니다.
        timeoutId = setTimeout(() => {
          onDeleteComplete(); // 이제야 크랙이 모입니다 (setIsCracked(false))

          // 2. 크랙이 완전히 모인 후, 1초 뒤에 다시 타이핑을 시작합니다.
          timeoutId = setTimeout(() => {
            setPhase('typing');
          }, 1000);

        }, 500); // <-- 이 숫자를 키울수록 텍스트가 사라진 뒤 크랙이 유지되는 시간이 길어집니다.
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, phase, text, onTypeComplete, onDeleteComplete]);

  return (
    <div className={`${className} inline-block border-r-2 border-[#7184e6] animate-blink pr-1`}>
      {displayText.split('').map((char, index) => {
        const isHighlight = ['오', '자', '작'].includes(char);
        return (
          <span
            key={index}
            className={isHighlight ? "text-[#7184e6] text-2xl md:text-5xl transition-all duration-200" : "text-white transition-all duration-200"}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

const Hero = ({ onAiGenerateClick, onTilClick }: { onAiGenerateClick?: () => void; onTilClick?: () => void }) => {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isCracked, setIsCracked] = useState(false);

  // AI Writer 버튼 클릭 핸들러
  const handleAiWriterClick = () => {
    if (onAiGenerateClick) {
      onAiGenerateClick();
    } else {
      navigate('/recruitments');
    }
  };

  // TIL 버튼 클릭 핸들러
  const handleTilClick = () => {
    if (onTilClick) {
      onTilClick();
    } else {
      navigate('/til');
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial visibility and pointer events setup
      gsap.set(".section-intro", { autoAlpha: 1, scale: 1, pointerEvents: "auto", zIndex: 40 });
      gsap.set(".section-ai", { autoAlpha: 1, pointerEvents: "none", zIndex: 30 });
      gsap.set(".section-ai .hero-text, .section-ai .hero-bg", { autoAlpha: 0, scale: 0.95 });
      gsap.set(".section-til", { autoAlpha: 1, pointerEvents: "none", zIndex: 20 });
      gsap.set(".section-til .hero-text, .section-til .hero-bg", { autoAlpha: 0, scale: 0.95 });


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".pinned-container",
          pin: true,
          scrub: 1, // 스크럽 감도 조절 (숫자가 낮을수록 반응 빠름)
          start: "top top",
          end: "+=2000", // 전체 스크롤 길이 축소 (기존 4000 -> 2000)
          snap: {
            snapTo: "labels",
            duration: 0.5,
            delay: 0.1,
            ease: "power1.inOut"
          }
        }
      });

      tl.addLabel("intro")
        // 1. Transition Intro -> AI Writer
        // duration 값을 줄여서 전환 속도를 빠르게 조정
        .to(".section-intro", { autoAlpha: 0, scale: 1.1, duration: 0.8, ease: "power2.inOut" })
        .set(".section-intro", { pointerEvents: "none" })
        .set(".section-ai", { pointerEvents: "auto" })
        .to(".section-ai .hero-text", { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "<0.1")
        .to(".section-ai .hero-bg", { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.out" }, ">-=0.3")
        .addLabel("ai")

        // 2. Transition AI Writer -> TIL
        // duration 값을 줄여서 전환 속도를 빠르게 조정
        .to(".section-ai .hero-text, .section-ai .hero-bg", { autoAlpha: 0, scale: 1.1, duration: 0.8, ease: "power2.inOut" })
        .set(".section-ai", { pointerEvents: "none" })
        .set(".section-til", { pointerEvents: "auto" })
        .to(".section-til .hero-text", { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "<0.1")
        .to(".section-til .hero-bg", { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.out" }, ">-=0.3")
        .addLabel("til");
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-wrapper relative z-10 bg-black" ref={wrapperRef}>
      <div className="pinned-container w-full h-screen overflow-hidden relative">

        {/* 1. Intro Section */}
        <div className="hero-section section-intro absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black z-40">
          <div className="flex flex-col items-center justify-center w-full">

            {/* 덩어리 크랙을 위해 h1 하나로 통합 */}
            <h1
              className={`text-8xl md:text-[14rem] font-black text-white tracking-tighter leading-none split-text ${isCracked ? 'active' : ''}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              data-text="오자작"
            >
              오자작
            </h1>

            {/* 타이핑 애니메이션 영역 */}
            <div className="mt-8 md:mt-12 text-center h-[2em]">
              <Typewriter
                text="오늘 자기 전 작성해"
                className="hero-subtitle text-lg md:text-2xl uppercase"
                onTypeComplete={() => setIsCracked(true)}
                onDeleteComplete={() => setIsCracked(false)}
              />
            </div>
          </div>
          <p className="absolute bottom-20 text-white/50 animate-bounce font-sans tracking-widest">Scroll to Explore</p>
        </div>

        {/* 나머지 섹션들 (기존 구조 유지) */}
        <div className="hero-section section-ai absolute inset-0 w-full h-full flex items-center justify-center z-30 pointer-events-none"> {/* 초기 pointer-events-none 추가 */}
          <div className="hero-bg absolute inset-0 bg-slate-900" />
          <div className="hero-text z-10 text-center text-white pointer-events-auto">
            <h1 className="text-8xl font-black mb-4">AI WRITER</h1>
            <p className="text-xl font-light mb-8">당신의 경험이 합격 자소서가 됩니다.</p>
            <button
              onClick={handleAiWriterClick}
              className="px-8 py-3 border border-white hover:bg-white hover:text-black text-white rounded-full transition-all duration-300 text-lg font-bold"
            >
              바로가기 &rarr;
            </button>
          </div>
        </div>

        {/* 2. TIL Section */}
        <div className="hero-section section-til absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none"> {/* 초기 pointer-events-none 추가 */}
          <div className="hero-bg absolute inset-0 bg-slate-800" />
          <div className="hero-text z-10 text-center text-white pointer-events-auto">
            <h1 className="text-8xl font-black mb-4">TODAY I LEARNED</h1>
            <p className="text-xl font-light mb-8">매일의 배움을 기록하고 성장하세요.<br />꾸준한 기록이 당신의 자산이 됩니다.</p>
            <button
              onClick={handleTilClick}
              className="px-8 py-3 border border-white hover:bg-white hover:text-black text-white rounded-full transition-all duration-300 text-lg font-bold"
            >
              기록하러 가기 &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;