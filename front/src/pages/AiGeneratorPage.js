import React, { useState } from 'react';
import { FileText, Grid, X, RefreshCw, Save, Clock, WandSparkles } from 'lucide-react';

// --- Top Banner Component ---
const TopBanner = () => (
    <div className="bg-white rounded-[30px] shadow-md p-6 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">카카오 - 백엔드 개발자</h2>
            <div className="flex items-center gap-4 mt-2">
                <span className="bg-indigo-100 text-indigo-800 font-medium text-sm px-4 py-1 rounded-full">2026 상반기 신입 공채</span>
                <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="size-4 mr-2" />
                    <span>마감일: 2026-01-31</span>
                </div>
            </div>
        </div>
    </div>
);

// --- Left Sidebar Components ---
const coverLetterData = [
    { company: '네이버', role: '프론트엔드 개발자' },
    { company: '카카오', role: '백엔드 개발자' },
    { company: '토스', role: 'Product Designer' },
    { company: '쿠팡', role: '물류 시스템' },
    { company: '당근마켓', role: 'iOS 개발자' },
];

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('coverLetter');

    return (
        <div className="bg-white rounded-[30px] shadow-md p-4 h-full">
            {/* Tabs */}
            <div className="bg-gray-100 rounded-lg p-1 flex mb-4">
                <button
                    onClick={() => setActiveTab('coverLetter')}
                    className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'coverLetter' ? 'bg-primary-dark text-white shadow' : 'text-gray-600'}`}
                >
                    <FileText className="size-4" />
                    자소서
                </button>
                <button
                    onClick={() => setActiveTab('block')}
                    className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'block' ? 'bg-primary-dark text-white shadow' : 'text-gray-600'}`}
                >
                    <Grid className="size-4" />
                    블록
                </button>
            </div>

            {/* Content */}
            <div>
                <p className="text-xs text-gray-500 px-2 mb-2">드래그하여 추가하기</p>
                <div className="space-y-3">
                    {coverLetterData.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 cursor-grab active:cursor-grabbing">
                            <h4 className="font-bold text-sm text-gray-900">{item.company}</h4>
                            <p className="text-xs text-gray-500">{item.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Right Main Content Components ---

// State A: Input Form
const GeneratorInput = ({ onGenerate }) => {
    const [selectedItems, setSelectedItems] = useState(['네이버', '카카오']);

    const removeItem = (itemToRemove) => {
        setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
    };

    return (
        <div className="bg-white rounded-[30px] shadow-md p-8 h-full flex flex-col">
            <h3 className="text-3xl font-black text-gray-700 mb-6">AI 자소서 생성</h3>

            <div className="border border-gray-200 rounded-xl p-6 flex-grow">
                <h4 className="font-bold text-gray-900">자소서 선택 ({selectedItems.length}/5)</h4>
                <div className="flex flex-wrap gap-2 mt-3 mb-6">
                    {selectedItems.map(item => (
                        <div key={item} className="bg-indigo-100 text-indigo-800 font-semibold text-sm flex items-center gap-2 px-3 py-1 rounded-full">
                            {item}
                            <button onClick={() => removeItem(item)} className="hover:bg-indigo-200 rounded-full p-0.5">
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                </div>

                <textarea
                    placeholder="추가 요청사항을 입력하세요 (선택사항)"
                    className="w-full p-4 border border-gray-200 rounded-xl outline-none
                               h-24 min-h-24 focus:h-48
                               transition-all duration-300 ease-in-out
                               focus:border-primary-dark focus:shadow-lg"
                />
            </div>
            <button
                onClick={onGenerate}
                className="mt-6 bg-primary-dark text-white font-bold py-4 rounded-xl w-full flex items-center justify-center gap-3
                           transition-transform hover:scale-[1.01] active:scale-100"
            >
                <WandSparkles className="size-5" />
                AI 자소서 생성 (0개 블록 선택됨)
            </button>
        </div>
    );
};

// State B: Result List
const generatedData = [
    {
        question: '본인의 성장 경험에 대해 구체적으로 서술해주세요.',
        answer: '[삼성전자는 꿈을 현실로 만듭니다]\nTV는 사용자의 가정과 가장 밀착되어있는 영역입니다. TV는 가족의 라이프 스타일의 큰 부분을 차지할 뿐 아니라 점차 개별 사용자 그 자체가 되고 있습니다. 삼성전자의 TV는 소비자와 가장 가까운 곳에서 혁신적인 기술로 소비자도 알지 못했던 본인의 무한한 가능성을 일깨워줍니다. 스마트 싱스를 통해 확장성을, 매직 스크린을 통해 화려함까지. 삼성전자의 도전적인 영역 개척은 산업 전체의 영역 확장으로 이어지며 산업 트렌드를 선도합니다',
        charCount: '580 / 1000자',
        request: '삼성전자 인재상에 맞춰서 작성해줘'
    },
    {
        question: '지원 직무에 대한 역량을 증명할 수 있는 프로젝트 경험을 서술해주세요.',
        answer: '[협업과 소통으로 일군 120% 성장]\n사용자 참여형 플랫폼 "하루기록" 프로젝트에서 리더 역할을 수행하며, 기획 단계부터 실제 배포까지 책임졌던 경험이 있습니다. 초기 기획과 달리 개발 과정에서 마주한 다양한 기술적, 정책적 문제들을 팀원들과의 적극적인 소통과 토론으로 해결해 나갔습니다...',
        charCount: '720 / 1000자',
        request: '리더십을 강조해서 작성해줘'
    },
];

const GeneratorResult = () => (
    <div className="bg-white rounded-[30px] shadow-md p-8 h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-black text-gray-700">AI 자소서 작성</h3>
            <button className="bg-primary-dark text-white font-bold py-2 px-6 rounded-xl transition-transform hover:scale-105">
                전체 저장
            </button>
        </div>

        <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {generatedData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900">문항 {index + 1}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.question}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{item.charCount}</span>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap my-4">
                        {item.answer}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">추가 요청사항</label>
                        <div className="flex gap-4 mt-2">
                            <input
                                type="text"
                                readOnly
                                value={item.request}
                                className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-800 outline-none"
                            />
                            <button className="flex items-center gap-2 bg-primary-dark text-white font-semibold text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-90">
                                <RefreshCw className="size-4" /> 재생성
                            </button>
                            <button className="flex items-center gap-2 border border-gray-300 text-gray-800 font-semibold text-sm px-4 py-2 rounded-lg transition-colors hover:bg-gray-100">
                                <Save className="size-4" /> 임시저장
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- Main Page Component ---
const AiGeneratorPage = () => {
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => {
        setIsGenerated(true);
    };

    return (
        <div className="space-y-8">
            <TopBanner />
            <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <Sidebar />
                </div>
                <div className="lg:col-span-3">
                    {isGenerated ? <GeneratorResult /> : <GeneratorInput onGenerate={handleGenerate} />}
                </div>
            </main>
        </div>
    );
};

export default AiGeneratorPage;