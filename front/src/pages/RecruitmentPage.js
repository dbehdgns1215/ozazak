import React, { useState, useEffect } from 'react';
import { Heart, ChevronDown, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { getRecruitments, toggleBookmark } from '../api/recruitment';

// --- Helpers & Visuals from JobCalendarPage ---
const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const filters = ['채용형태', '기업분류', '직무', '날짜기준'];
const colors = [
    'bg-indigo-100 text-indigo-800',
    'bg-yellow-200 text-yellow-800',
    'bg-orange-200 text-orange-800',
    'bg-green-200 text-green-800',
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800'
];

const generateCalendarDays = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek; i > 0; i--) {
        const prevDate = new Date(year, month, 1 - i);
        days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i);
        days.push({ date: currentDate, isCurrentMonth: true });
    }

    const endDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - endDayOfWeek; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
};

// --- Mini Calendar Tooltip ---
const MiniCalendar = ({ job }) => {
    // Determine visuals from job dates
    // If we only have deadline, we simulate a start date
    const endDate = new Date(job.end);
    const startDate = new Date(job.start);

    // We display the month of the start date usually
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const days = generateCalendarDays(year, month);

    const startDayNum = startDate.getDate();
    const endDayNum = endDate.getDate(); // Assuming same month for visual simplicity in tooltip

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
                    const d = date.getDate();
                    // Simple logic for highlighting range in same month
                    const isSelected = isCurrentMonth && d >= startDayNum && d <= endDayNum;
                    // If spread across months, this logic is naive but efficient for mock
                    return (
                        <span key={i} className={`py-1 rounded-full ${!isCurrentMonth ? 'text-gray-300' : ''} ${isSelected ? 'bg-blue-500 text-white' : ''}`}>
                            {d}
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
};

const RecruitmentPage = () => {
    // Initial State
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Jan 2026
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const res = await getRecruitments();
                // Map API data to Calendar Job Format
                const formatted = res.data.map((item, idx) => {
                    // Mock start/end based on deadline
                    // If deadline is 2026-02-15, let's say it started 10 days ago?
                    // Or for visual demo in Jan 2026:
                    // Only for demo, if date is far, force it into Jan 2026 for visualization?
                    // User requested "Mock Data" so let's trust the mock data has dates.
                    // Mock data has `deadline: "2026-02-15..."`
                    // Let's create a range ending at deadline.
                    const dDate = new Date(item.deadline);
                    const sDate = new Date(dDate);
                    sDate.setDate(dDate.getDate() - 7); // 1 week duration

                    return {
                        id: item.id,
                        name: item.company,
                        role: item.title,
                        start: sDate.toISOString().split('T')[0],
                        end: dDate.toISOString().split('T')[0],
                        color: colors[idx % colors.length],
                        liked: item.isBookmarked
                    };
                });
                // Also add some hardcoded ones if mock is small, or use `JobCalendarPage` data combined?
                // Let's just use the API data mapping.
                // But wait, the mock data has Feb deadlines. The calendar defaults to Jan 2026.
                // We should probably init calendar to a date that has events, or mock events in Jan.
                // Mock endpoint returns Feb deadlines. 
                // Creating some fake Jan events for the "2026-01" view to look populated.
                const fakeJanEvents = [
                    { id: 'fake_1', name: 'Samsung', role: 'Frontend', start: '2026-01-05', end: '2026-01-18', color: colors[0], liked: false },
                    { id: 'fake_2', name: 'Naver', role: 'Backend', start: '2026-01-20', end: '2026-01-28', color: colors[1], liked: true }
                ];

                setJobs([...fakeJanEvents, ...formatted]);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const calendarDays = generateCalendarDays(year, month);

    const getJobsForDay = (date, isCurrentMonth) => {
        if (!isCurrentMonth) return [];
        const dateString = date.toISOString().split('T')[0];
        // Display only on Start Date or End Date
        return jobs.filter(job => job.start === dateString || job.end === dateString);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Recruitment Calendar</h1>
                <span className="ml-4 bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1 rounded-lg">
                    2026 Open Season
                </span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
                {filters.map(filter => (
                    <button key={filter} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        {filter} (All)
                        <ChevronDown className="size-4 text-gray-500" />
                    </button>
                ))}
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-[30px] shadow-md p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="size-5" />
                    </button>
                    <h2 className="text-xl font-bold text-blue-600">
                        {year}.{String(month + 1).padStart(2, '0')}
                    </h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
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
                                            <div className={`flex items-center justify-between w-full text-xs font-semibold p-1.5 rounded-md cursor-pointer transition-transform hover:scale-[1.02] ${job.color}`}>
                                                <span className="truncate">{job.name}</span>
                                                {job.liked ? (
                                                    <Heart className="size-3 fill-red-500 text-red-500" />
                                                ) : (
                                                    <Heart className="size-3 text-current opacity-50" />
                                                )}
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute top-0 left-full ml-2 z-50 hidden group-hover:block transition-opacity">
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

export default RecruitmentPage;
