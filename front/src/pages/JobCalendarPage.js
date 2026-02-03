import React, { useState } from 'react';
import { Heart, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Data extracted from V.tsx and Target Image ---
const jobs = [
  { id: 1, name: '한국전력공사', role: '물류 시스템 개발', start: '2026-01-05', end: '2026-01-18', color: 'bg-indigo-100 text-indigo-800', liked: false },
  { id: 2, name: '토스', role: 'Frontend Developer', start: '2026-01-16', end: '2026-01-16', color: 'bg-yellow-200 text-yellow-800', liked: true },
  { id: 3, name: 'LG CNS', role: 'Cloud Engineer', start: '2026-01-16', end: '2026-01-16', color: 'bg-indigo-100 text-indigo-800', liked: false },
  { id: 4, name: '쿠팡', role: 'Backend Developer', start: '2026-01-16', end: '2026-01-16', color: 'bg-indigo-100 text-indigo-800', liked: false },
  { id: 5, name: '네이버', role: 'AI Researcher', start: '2026-01-21', end: '2026-01-29', color: 'bg-orange-200 text-orange-800', liked: true },
  { id: 6, name: '삼성전자', role: 'Software Engineer', start: '2026-01-23', end: '2026-01-23', color: 'bg-indigo-100 text-indigo-800', liked: false },
  { id: 7, name: '라인', role: 'iOS Developer', start: '2026-01-27', end: '2026-01-27', color: 'bg-indigo-100 text-indigo-800', liked: false },
  { id: 8, name: '토스', role: 'Product Manager', start: '2026-01-29', end: '2026-01-29', color: 'bg-yellow-200 text-yellow-800', liked: true },
  { id: 9, name: '우아한형제들', role: 'Data Scientist', start: '2026-01-31', end: '2026-01-31', color: 'bg-green-200 text-green-800', liked: true },
];

const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const filters = ['채용형태', '기업분류', '직무', '날짜기준'];

// --- Helper function to generate calendar days ---
const generateCalendarDays = (year, month) => {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Days from previous month
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i);
    days.push({ date: prevDate, isCurrentMonth: false });
  }

  // Days in current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(year, month, i);
    days.push({ date: currentDate, isCurrentMonth: true });
  }

  // Days from next month
  const endDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - endDayOfWeek; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({ date: nextDate, isCurrentMonth: false });
  }

  return days;
};

// --- Mini Calendar for Tooltip ---
const MiniCalendar = ({ job }) => {
    const year = new Date(job.start).getFullYear();
    const month = new Date(job.start).getMonth();
    const days = generateCalendarDays(year, month);
    const startDate = new Date(job.start).getDate();
    const endDate = new Date(job.end).getDate();

    return (
        <div className="p-4 bg-white rounded-xl shadow-2xl border w-[220px]">
            <h3 className="font-bold text-lg">{job.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{job.role}</p>
            <p className="text-center font-bold text-sm my-2">{`${year}.${String(month + 1).padStart(2, '0')}`}</p>
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-xs">
                {days.map(({ date, isCurrentMonth }, i) => {
                    const dayOfMonth = date.getDate();
                    const isSelected = isCurrentMonth && dayOfMonth >= startDate && dayOfMonth <= endDate;
                    return (
                        <span key={i} className={`py-1 rounded-full ${!isCurrentMonth ? 'text-gray-300' : ''} ${isSelected ? 'bg-blue-500 text-white' : ''}`}>
                            {dayOfMonth}
                        </span>
                    );
                })}
            </div>
            <div className="border-t mt-3 pt-3 text-xs text-gray-600">
                <p>시작: {job.start}</p>
                <p>마감: {job.end}</p>
            </div>
        </div>
    );
}

// --- Main Calendar Page Component ---
const JobCalendarPage = () => {
  const year = 2026;
  const month = 0; // January
  const calendarDays = generateCalendarDays(year, month);

  const getJobsForDay = (date, isCurrentMonth) => {
    if (!isCurrentMonth) return [];
    const dateString = date.toISOString().split('T')[0];
    return jobs.filter(job => job.start <= dateString && job.end >= dateString);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">채용 달력</h1>
        <span className="ml-4 bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1 rounded-lg">
          2026 상반기 신입 공채
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map(filter => (
          <button key={filter} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            {filter} (전체)
            <ChevronDown className="size-4 text-gray-500" />
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-[30px] shadow-md p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="size-5" />
          </button>
          <h2 className="text-xl font-bold text-blue-600">2026.01</h2>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {dayHeaders.map((day, i) => (
            <div key={day} className={`text-center text-xs font-bold py-2 border-b-2
              ${i === 0 ? 'text-red-500' : ''}
              ${i === 6 ? 'text-blue-500' : ''}`}>
              {day}
            </div>
          ))}

          {calendarDays.map(({ date, isCurrentMonth }, i) => {
            const dayJobs = getJobsForDay(date, isCurrentMonth);
            return (
              <div key={i} className="relative min-h-[140px] border-r border-b p-2">
                <span className={`font-semibold ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}`}>
                  {date.getDate()}
                </span>
                <div className="mt-1 space-y-1">
                  {dayJobs.map(job => (
                    <div key={job.id} className="group relative">
                      <div className={`flex items-center justify-between w-full text-xs font-semibold p-1.5 rounded-md cursor-pointer ${job.color}`}>
                        <span>{job.name}</span>
                        {job.liked && <Heart className="size-3 fill-current" />}
                      </div>
                      <div className="absolute top-0 left-full ml-2 z-50 hidden group-hover:block">
                        <MiniCalendar job={job} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobCalendarPage;
