import React, { useEffect, useState } from 'react';
import { User, Award, FileText, Calendar, Activity, Briefcase, Settings, LogOut } from 'lucide-react';
import { userApi, UserProfile, UserStreak } from '../api/mock/user';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [streak, setStreak] = useState<UserStreak[]>([]);
    const [appliers, setAppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, streakData, applierData] = await Promise.all([
                    userApi.getUserProfile(1),
                    userApi.getStreak(1),
                    userApi.getAppliers(1)
                ]);
                setProfile(userData);
                setStreak(streakData);
                setAppliers(applierData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            {/* Profile Header */}
            <section className="relative pt-32 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8 glass-dark p-8 rounded-3xl">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700/50 group-hover:border-blue-500/50 transition-colors">
                                <img src={profile?.profileImage} alt={profile?.nickname} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-4 border-slate-900">
                                <Settings className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl font-bold mb-2">{profile?.nickname}</h1>
                            <p className="text-slate-400 text-lg mb-4">{profile?.bio}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {profile?.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-blue-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[160px]">
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Job Role</p>
                                <p className="text-lg font-semibold text-slate-200">{profile?.jobRole}</p>
                            </div>
                            <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-500/10">
                                <LogOut className="w-4 h-4" /> 로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Stats & Streak */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Streak Section */}
                    <div className="glass-dark p-8 rounded-3xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-green-400" />
                            스트릭 (Streak)
                        </h2>
                        <div className="flex flex-wrap gap-1 justify-center max-h-[200px] overflow-hidden mask-fade-bottom">
                            {/* Simplified Heatmap Visualization */}
                            {streak.slice(0, 126).map((day, idx) => (
                                <div
                                    key={idx}
                                    title={`${day.date}: ${day.count}`}
                                    className={`w-3 h-3 rounded-sm ${day.count > 3 ? 'bg-green-400' :
                                            day.count > 1 ? 'bg-green-600/80' :
                                                day.count > 0 ? 'bg-green-900/60' : 'bg-slate-800'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-right text-sm text-slate-500 mt-4">최근 4개월 활동 내역</p>
                    </div>

                    {/* Activity / Resume Section */}
                    <div className="glass-dark p-8 rounded-3xl min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-400" />
                                나의 이력 관리
                            </h2>
                            <button className="text-sm text-blue-400 hover:text-blue-300">관리하기 &gt;</button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-200">삼성청년SW아카데미 11기 수료</h3>
                                    <p className="text-sm text-slate-500">Web/Mobile Track • 2024.01 - 2024.12</p>
                                </div>
                                <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-200">정보처리기사 취득</h3>
                                    <p className="text-sm text-slate-500">한국산업인력공단 • 2023.08</p>
                                </div>
                                <Award className="w-5 h-5 text-slate-500" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Applications & Status */}
                <div className="space-y-8">
                    <div className="glass-dark p-8 rounded-3xl h-full">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-purple-400" />
                            지원 현황
                        </h2>

                        <div className="space-y-4">
                            {appliers.map((app) => (
                                <div key={app.id} className="group p-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors rounded-xl border border-slate-700/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-lg text-slate-200">{app.company}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full font-bold
                          ${app.status === '서류합격' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}
                        `}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> {app.date}
                                    </p>
                                </div>
                            ))}

                            {appliers.length === 0 && (
                                <div className="text-center py-10 text-slate-500">
                                    지원 내역이 없습니다.
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/recruitments')}
                            className="w-full mt-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 font-semibold transition-colors">
                            채용 공고 보러가기
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyPage;
