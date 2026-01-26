import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Hero from '../components/Hero';
import DeadlineJobs from '../components/DeadlineJobs';
import StackedCards from '../components/StackedCards';
import Sidebar from '../components/Sidebar';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function HomePage() {
  const container = useRef(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray('.animated-section');
    sections.forEach((section) => {
      gsap.from(section, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
        },
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="grid grid-cols-12 gap-8">
      {/* --- Main Content (Left - 9 columns) --- */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-12">
        <section className="animated-section"><Hero /></section>
        <section className="animated-section"><DeadlineJobs /></section>
        <section className="animated-section"><StackedCards /></section>
      </div>

      {/* --- Sidebar (Right - 3 columns) --- */}
      <aside className="col-span-12 lg:col-span-3">
        <div className="sticky top-24 h-fit animated-section">
          <Sidebar />
        </div>
      </aside>
    </div>
  );
}

export default HomePage;
