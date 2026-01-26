import React, { useState, useEffect } from 'react';
import { User, Award, FileText, Activity, MapPin, Calendar, Medal } from 'lucide-react';
import { getUserProfile, getUserStreak, getUserRecords, getUserAwards, getUserCertifications } from '../api/user';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
    const { user: authUser } = useAuth(); // Get minimal user info from context if needed, but we'll fetch full profile
    const [profile, setProfile] = useState(null);
    const [streak, setStreak] = useState(null);
    const [records, setRecords] = useState([]);
    const [awards, setAwards] = useState([]);
    const [certifications, setCertifications] = useState([]);

    const [activeTab, setActiveTab] = useState('records'); // records, awards, certifications
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // In a real app, we'd get the ID from context or params. 
                // Using "user_001" as default for mock.
                // If authUser exists, we might use that ID.
                const userId = authUser?.accountId || "user_001";

                const [profileRes, streakRes, recordsRes, awardsRes, certsRes] = await Promise.all([
                    getUserProfile(userId),
                    getUserStreak(userId),
                    getUserRecords(userId),
                    getUserAwards(userId),
                    getUserCertifications(userId)
                ]);

                setProfile(profileRes.data);
                setStreak(streakRes.data);
                setRecords(recordsRes.data);
                setAwards(awardsRes.data);
                setCertifications(certsRes.data);
            } catch (error) {
                console.error("Failed to load mypage data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [authUser]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7184e6]"></div></div>;
    }

    // Streak visualization helper
    const renderStreak = () => {
        if (!streak) return null;
        // Create a simple 4-week (28 days) visualization for demo
        const days = Array.from({ length: 28 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (27 - i));
            return d.toISOString().split('T')[0];
        });

        return (
            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-700">Activity Streak</h3>
                    <span className="text-xs font-medium text-slate-500">{streak.currentStreak} days streak! 🔥</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map(date => {
                        const isActive = streak.streakHistory.includes(date);
                        return (
                            <div
                                key={date}
                                title={date}
                                className={`w-full pt-[100%] relative rounded-sm ${isActive ? 'bg-[#7184e6]' : 'bg-slate-100'}`}
                            ></div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-12 gap-6 pb-20 fade-in">
            {/* Left Sidebar: Profile */}
            <div className="col-span-12 md:col-span-3">
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-6 sticky top-24">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 overflow-hidden border-2 border-slate-200">
                            <img src={profile?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-xl font-black font-inter text-slate-900">{profile?.nickname}</h2>
                        <p className="text-sm text-slate-500 mb-4">{profile?.email}</p>

                        <div className="w-full bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-slate-600 font-medium">Level {profile?.level}</span>
                                <span className="text-[#7184e6] font-bold">{profile?.exp} XP</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className="bg-[#7184e6] h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 italic">"{profile?.bio}"</p>
                    </div>
                    {renderStreak()}
                </div>
            </div>

            {/* Right Content: Tabs */}
            <div className="col-span-12 md:col-span-9">
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl min-h-[600px] flex flex-col">
                    {/* Tab Header */}
                    <div className="flex border-b border-slate-200">
                        {['records', 'awards', 'certifications'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors relative
                                    ${activeTab === tab ? 'text-[#7184e6]' : 'text-slate-400 hover:text-slate-600'}
                                `}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#7184e6]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 flex-1">
                        {activeTab === 'records' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Activity Records</h3>
                                    <button className="px-4 py-2 bg-[#7184e6] text-white text-sm font-bold rounded-lg hover:bg-[#5f73d8] transition-colors">
                                        + Add Record
                                    </button>
                                </div>
                                {records.map(record => (
                                    <div key={record.id} className="bg-white border border-slate-100 rounded-lg p-4 hover:border-[#7184e6] transition-colors shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-1 bg-blue-50 text-[#7184e6] text-xs font-bold rounded uppercase">{record.category}</span>
                                            <span className="text-xs text-slate-400">{record.date}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 mb-1">{record.title}</h4>
                                        <p className="text-slate-600 text-sm">{record.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'awards' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Awards & Honors</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {awards.map(award => (
                                        <div key={award.id} className="flex items-center gap-4 bg-white border border-slate-100 rounded-lg p-4">
                                            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-2xl">
                                                🏆
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{award.title}</h4>
                                                <p className="text-xs text-slate-500">{award.issuer} • {award.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'certifications' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Certifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {certifications.map(cert => (
                                        <div key={cert.id} className="flex items-center gap-4 bg-white border border-slate-100 rounded-lg p-4">
                                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                                <Medal className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{cert.title}</h4>
                                                <p className="text-xs text-slate-500">{cert.issuer} • {cert.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
