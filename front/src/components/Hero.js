import React, { useRef, useState, useEffect, memo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

const GRID_SIZE = 40;

const Cell = () => {
  const cellRef = useRef(null);

  const handleMouseOver = () => {
    const cell = cellRef.current;
    if (cell) {
      cell.classList.add('active');
      setTimeout(() => {
        cell.classList.remove('active');
      }, 100);
    }
  };

  return <div ref={cellRef} className="cell" onMouseOver={handleMouseOver} />;
};

const MemoizedCell = memo(Cell);

const Grid = () => {
  const [cells, setCells] = useState([]);

  useEffect(() => {
    const containerWidth = window.innerWidth;
    const containerHeight = 800;
    const numCols = Math.ceil(containerWidth / GRID_SIZE);
    const numRows = Math.ceil(containerHeight / GRID_SIZE);
    const totalCells = numCols * numRows;

    setCells(Array.from({ length: totalCells }));
  }, []);

  return (
    <div
      className="absolute inset-0 grid overflow-hidden rounded-[32px]"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${GRID_SIZE}px)`,
        gridTemplateRows: `repeat(auto-fill, ${GRID_SIZE}px)`,
      }}
    >
      {cells.map((_, i) => <MemoizedCell key={i} />)}
    </div>
  );
};

const AnimatedText = ({ text, className, baseDelay = 0 }) => {
  const words = text.split(' ');

  return (
    <span className={`cool-text ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          data-text={word}
          style={{ '--delay': `${baseDelay + (i * 0.1)}s` }}
          className="mr-2 last:mr-0"
        >
          {word}
        </span>
      ))}
    </span>
  );
};

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".hero-fade-in", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 1.2
      });
      gsap.from(".blueprint-element", {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
      })
    },
    { scope: containerRef }
  );

  return (
    <>
      <style>{`
        .cell {
          width: ${GRID_SIZE}px;
          height: ${GRID_SIZE}px;
          background-color: transparent;
          border-right: 1px solid rgba(240, 240, 240, 0.5);
          border-bottom: 1px solid rgba(240, 240, 240, 0.5);
          transition: background-color 1s ease-out;
        }
        .cell.active {
          background-color: rgba(113, 132, 230, 0.1);
          transition: none;
        }

        .cool-text span {
          display: inline-block;
          position: relative;
          color: #94a3b8; 
        }
        
        .cool-text span::before, 
        .cool-text span::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          overflow: hidden;
          white-space: nowrap;
          speak: none;
          max-width: 0;
          max-height: 0;
        }

        .cool-text span::before {
          color: #7184e6;
          max-width: 100%;
          width: 100%;
          animation: max-height 0.4s cubic-bezier(0.61, 1, 0.88, 1) 1 normal both;
          animation-delay: var(--delay);
        }

        .cool-text span::after {
          color: #0f172a;
          max-height: 100%;
          width: 100%;
          animation: max-width 0.7s cubic-bezier(0.61, 1, 0.88, 1) 1 normal both;
          animation-delay: calc(var(--delay) + 0.3s);
        }

        @keyframes max-width { from { max-width: 0; } to { max-width: 100%; } }
        @keyframes max-height { from { max-height: 0; } to { max-height: 100%; } }
      `}</style>

      {/* Compact Layout: reduced radius, removed min-h-[500px], centered content */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-full min-h-[380px] overflow-hidden rounded-[32px] border border-white/60 bg-white/40 backdrop-blur-md shadow-sm"
      >
        <Grid />

        <svg
          className="absolute inset-0 w-full h-full text-slate-300/60 opacity-50 blueprint-element pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="15%" y="20%" width="120" height="120" strokeWidth="1" stroke="currentColor" fill="none" />
          <line x1="15%" y1="30%" x2="calc(15% + 120px)" y2="30%" stroke="#7184e6" strokeWidth="1" />
          <circle cx="85%" cy="60%" r="80" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>

        <div className="relative z-10 text-center px-6 py-8">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 flex flex-col items-center gap-1">
            <AnimatedText text="안녕하세요 지원 님," className="block" baseDelay={0} />
            <AnimatedText text="AI 자소서 생성 서비스" className="block" baseDelay={0.5} />
            <div className="inline-flex items-center gap-3">
              <AnimatedText text="오자작 입니다" className="block" baseDelay={1.0} />
            </div>
          </h1>

          <p className="hero-fade-in mt-4 text-lg text-slate-600 font-medium">
            오자작은 당신의 경험을 바탕으로 최고의 자소서를 만들어 드립니다.
          </p>
          <div className="hero-fade-in mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/generator"
              className="group relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-[#7184e6] hover:bg-[#5a6cc2] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              AI 자소서 생성
              <ArrowRight className="ml-2 -mr-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/analysis"
              className="group relative inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-base font-bold rounded-xl text-slate-700 bg-white/80 hover:bg-white transition-colors hover:border-slate-300 shadow-sm"
            >
              내 자소서 분석
              <ArrowRight className="ml-2 -mr-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
