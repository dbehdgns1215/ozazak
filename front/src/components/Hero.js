import React, { useRef, useState, useEffect, memo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

const GRID_SIZE = 40; // 50px * 0.8

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
    const containerHeight = 600; // Based on min-h-[600px]
    const numCols = Math.ceil(containerWidth / GRID_SIZE);
    const numRows = Math.ceil(containerHeight / GRID_SIZE);
    const totalCells = numCols * numRows;
    
    setCells(Array.from({ length: totalCells }));
  }, []);

  return (
    <div 
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${GRID_SIZE}px)`,
        gridTemplateRows: `repeat(auto-fill, ${GRID_SIZE}px)`,
      }}
    >
      {cells.map((_, i) => <MemoizedCell key={i} />)}
    </div>
  );
};


export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.15,
        delay: 0.2
      });
      gsap.from(".blueprint-element", {
        opacity: 0,
        scale: 0.9,
        duration: 1,
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
          border-right: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 1s ease-out; 
        }
        .cell.active {
          background-color: rgba(113, 132, 230, 0.2);
          transition: none;
        }
      `}</style>
      <div
        ref={containerRef}
        className="relative flex items-center justify-center min-h-[600px] bg-slate-50 overflow-hidden pt-12" // Add padding top
      >
        <Grid />
        
        {/* Decorative SVG Elements */}
        <svg
          className="absolute inset-0 w-full h-full text-slate-300/60 opacity-50 blueprint-element pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="15%" y="20%" width="150" height="150" strokeWidth="1" stroke="currentColor" fill="none" />
          <line x1="15%" y1="35%" x2="calc(15% + 150px)" y2="35%" stroke="#7184e6" strokeWidth="1" />
          <circle cx="80%" cy="50%" r="100" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
        
        {/* Main Content */}
        <div className="relative z-10 text-center">
          <h1 className="hero-text text-5xl font-bold text-slate-800">
            안녕하세요 지원 님,
            <br />
            AI 자소서 생성 서비스 Scripter 입니다.
          </h1>
          <p className="hero-text mt-4 text-lg text-slate-600">
            Scripter는 당신의 경험을 바탕으로 최고의 자소서를 만들어 드립니다.
          </p>
          <div className="hero-text mt-8 flex justify-center gap-4">
            <a
              href="/generator"
              className="group relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7184e6] hover:bg-[#5a6cc2] transition-colors"
            >
              AI 자소서 생성
              <ArrowRight className="ml-2 -mr-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/analysis"
              className="group relative inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
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
