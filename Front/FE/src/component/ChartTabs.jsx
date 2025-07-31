import React, { useState } from 'react';
import DrillDownDonutChart from './DrillDownDonutChart';
import BarPieChart from './BarPieChart';

const ChartTabs = ({ regionName, categoryData }) => {
  const [activeTab, setActiveTab] = useState('barpie'); // 'donut' 또는 'barpie'

    return (
        <div className="w-full bg-white">
        {/* 탭 네비게이션 */}
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex justify-center">
                <nav className="flex space-x-8">
                    <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === 'donut'
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('donut')}
                    >
                    도넛 차트
                    </button>
                    <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === 'barpie'
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('barpie')}
                    >
                    막대-파이 차트
                    </button>
                </nav>
                </div>
            </div>

            {/* 차트 컨텐츠 */}
            <div className="p-6">
            {activeTab === 'donut' && (
            <div className="space-y-4">
                <div className="flex justify-center px-8">
                <div className="w-full max-w-4xl">
                    <DrillDownDonutChart
                    regionName={regionName}
                    categoryData={categoryData}
                    />
                </div>
                </div>
            </div>
        )}

                {activeTab === 'barpie' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                        <p className="text-sm text-blue-700 font-medium">
                            사용 안내
                        </p>
                        <div className="mt-2 text-sm text-blue-600 space-y-1">
                            <p>• 막대그래프를 클릭하여 상세 분야 그래프를 확인하세요.</p>
                            <p>• 업무명 클릭 시 해당 업무를 제외하고 비교 가능합니다.</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <BarPieChart
                    regionName={regionName}
                    categoryData={categoryData}
                    />
                </div>
                )}
            </div>
        </div>
    );
};

export default ChartTabs;