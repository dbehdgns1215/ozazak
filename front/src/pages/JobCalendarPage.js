import React, { useState, useEffect } from 'react';
import { Heart, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getRecruitments } from '../api/recruitment';

const COLORS = [
  'bg-indigo-100 text-indigo-800',
  'bg-yellow-200 text-yellow-800',
  'bg-orange-200 text-orange-800',
  'bg-green-200 text-green-800',
  'bg-blue-200 text-blue-800',
  'bg-pink-200 text-pink-800',
  'bg-purple-200 text-purple-800',
  'bg-teal-200 text-teal-800',
];

const getColor = (id) => COLORS[id % COLORS.length];

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
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(0); // January
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await getRecruitments({ year, month: month + 1 });
        console.log("Fetched jobs:", data); // Debug log
        // Map API response to component state
        const mappedJobs = data.map(item => {
          // Robust unwrapping: handle both wrapped and unwrapped cases
          const job = (item && item.data) ? item.data : item;

          return {
            id: job.recruitmentId,
            name: job.companyName,
            role: job.title,
            start: (job.startedAt && job.startedAt.length >= 10) ? job.startedAt.substring(0, 10) : '',
            end: (job.endedAt && job.endedAt.length >= 10) ? job.endedAt.substring(0, 10) : '',
            rawEndTime: job.endedAt || '', // Store raw end time for sorting
            color: getColor(job.recruitmentId),
            liked: job.isBookmarked ?? job.bookmarked ?? false,
            // Map company size to category
            // 0: LARGE, 1: MIDDLE, 2: SME, 3: STARTUP, 4: PUBLIC, 5: FOREIGN
            companyType: (function (size) {
              if (size === 0) return '대기업';
              if (size === 1) return '중견기업';
              return '기타기업'; // 2, 3, 4, 5, etc.
            })(job.companySize)
          };
        });
        console.log("Mapped Jobs:", mappedJobs); // Debug log
        setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to fetch recruitments:", error);
      }
    };
    fetchJobs();
  }, [year, month]);

  const calendarDays = generateCalendarDays(year, month);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const COMPANY_CATEGORIES = ['전체', '대기업', '중견기업', '기타기업'];

  const getJobsForDay = (date, isCurrentMonth) => {
    if (!isCurrentMonth) return [];

    // Manual date formatting to avoid locale issues (YYYY-MM-DD)
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;

    // Filter by date range AND company type, then sort
    return jobs
        .filter(job =>
            job.start <= dateString &&
            job.end >= dateString &&
            (selectedCategory === '전체' || job.companyType === selectedCategory)
        )
        .sort((a, b) => {
          // Sort by rawEndTime ascending
          if (a.rawEndTime < b.rawEndTime) return -1;
          if (a.rawEndTime > b.rawEndTime) return 1;
          return 0;
        });
  }

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  return (
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">채용 달력</h1>
          <span className="ml-4 bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1 rounded-lg">
          {year} 상반기 신입 공채
        </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {filters.map(filter => {
            if (filter === '기업분류') {
              return (
                  <button
                      key={filter}
                      onClick={() => {
                        const nextIndex = (COMPANY_CATEGORIES.indexOf(selectedCategory) + 1) % COMPANY_CATEGORIES.length;
                        setSelectedCategory(COMPANY_CATEGORIES[nextIndex]);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm text-sm font-medium transition-colors
                  \${selectedCategory !== '전체' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {filter}: {selectedCategory}
                    <ChevronDown className="size-4 text-gray-500" />
                  </button>
              );
            }
            return (
                <button key={filter} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {filter} (전체)
                  <ChevronDown className="size-4 text-gray-500" />
                </button>
            );
          })}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-[30px] shadow-md p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="size-5" />
            </button>
            <h2 className="text-xl font-bold text-blue-600">{year}.{String(month + 1).padStart(2, '0')}</h2>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {dayHeaders.map((day, i) => (
                <div key={day} className={`text-center text-xs font-bold py-2 border-b-2
              \${i === 0 ? 'text-red-500' : ''}
              \${i === 6 ? 'text-blue-500' : ''}`}>
                  {day}
                </div>
            ))}

            {calendarDays.map(({ date, isCurrentMonth }, i) => {
              const dayJobs = getJobsForDay(date, isCurrentMonth);
              return (
                  <div key={i} className="relative min-h-[140px] border-r border-b p-2">
                <span className={`font-semibold \${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}`}>
                  {date.getDate()}
                </span>
                    <div className="mt-1 space-y-1">
                      {dayJobs.map(job => (
                          <div key={job.id} className="group relative">
                            <div className={`flex items-center justify-between w-full text-xs font-semibold p-1.5 rounded-md cursor-pointer \${job.color}`}>
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