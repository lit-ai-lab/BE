import { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoData from '../data/kr.json';
import regionNameMap from '../data/regionNameMap';
import DrillDownDonutChart from './DrillDownDonutChart';
import { Shield, Home, FileText, Eye } from 'lucide-react';

const MapPage = ({ selected, setSelected, onNavigate, setCategoryData, categoryData }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const cityList = useMemo(() => Object.keys(regionNameMap), []);

    // ✅ 선택된 지역(selected)에 따라 한 번만 fetch 수행
    useEffect(() => {
        // const korRegion = regionNameMap[selected] || '';
        // handleFetch(korRegion);
        if (selected === null || selected === '') {
            handleFetch(''); // 전국
        } else {
            const korRegion = regionNameMap[selected] || '';
            handleFetch(korRegion);
        }
    }, [selected]);

    const handleFetch = async (korRegion = '') => {
        setIsLoading(true);
        setError(null);
        try {
        const query = korRegion ? `?region=${encodeURIComponent(korRegion)}` : '';
        const res = await fetch(`http://10.10.10.12:8000/api/maps/overview/${query}`);
        if (!res.ok) throw new Error("데이터 요청 실패");
        const result = await res.json();
        setCategoryData(result.categories || []);
        } catch (err) {
        setError(err.message);
        setCategoryData([]);
        } finally {
        setIsLoading(false);
        }
    };

    // 버튼 클릭 핸들러 - 상태만 변경
    const handleCitySelect = (engRegion = '') => {
        setSelected(engRegion); // fetch는 useEffect에서
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 네비게이션 - Fixed */}
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Shield className="w-8 h-8 text-slate-800" />
                            <span className="ml-2 text-xl font-bold text-slate-800">감사원</span>
                        </div>
                        <div className="flex space-x-6">
                            <button onClick={() => onNavigate('home')} className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg">
                                <Home className="w-4 h-4 mr-2" />홈
                            </button>
                            <button onClick={() => onNavigate('main')} className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg">
                                <FileText className="w-4 h-4 mr-2" />감사현황 조회
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 메인 컨텐츠 - 상단 패딩 추가 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">지역별 통계</h1>
                <p className="text-slate-600 mb-8">{selected ? regionNameMap[selected] : '전국'} 감사 현황을 확인하세요.</p>

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* 지도 */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">대한민국 지도</h2>
                        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 5000, center: [127.5, 36.2] }} width={700} height={700}>
                            <Geographies geography={geoData}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const engName = geo.properties.name;
                                        const korName = regionNameMap[engName];
                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onClick={() => setSelected(engName)}
                                                style={{
                                                    default: { fill: selected === engName ? "#1e293b" : "#cbd5e1", stroke: "#fff", strokeWidth: 1 },
                                                    hover: { fill: "#94a3b8", cursor: "pointer" },
                                                    pressed: { fill: "#1e293b" }
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ComposableMap>
                    </div>

                    {/* 버튼 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">지역 선택</h3>
                        <div className="space-y-2">
                            <button onClick={() => handleCitySelect('')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                                selected === '' ? 'bg-slate-800 text-white' : 'bg-gray-50 text-slate-700 hover:bg-gray-100'
                            }`}>
                                전국
                            </button>
                            {cityList.map((engName) => (
                                <button
                                    key={engName}
                                    onClick={() => handleCitySelect(engName)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                                        selected === engName ? 'bg-slate-800 text-white' : 'bg-gray-50 text-slate-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {regionNameMap[engName]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 통계 카드 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-slate-800">분야별 통계</h2>
                        <p className="text-sm text-slate-600 mt-1">{selected ? regionNameMap[selected] : '전국'}의 분야별 감사 현황입니다.</p>
                    </div>
                    <div className="p-6">
                        {isLoading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mr-3"></div>
                                <span className="text-slate-600">데이터를 불러오는 중...</span>
                            </div>
                        )}
                        {error && (
                            <div className="text-center text-red-600 py-8">{error}</div>
                        )}
                        {!isLoading && !error && categoryData.length === 0 && (
                            <div className="text-center text-slate-500 py-12">해당 지역의 데이터가 없습니다.</div>
                        )}
                        {!isLoading && !error && categoryData.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryData.map((cat) => (
                                    <div key={cat.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-semibold text-slate-800">{cat.category}</h3>
                                            <span className="text-2xl font-bold text-slate-700">{cat.count}</span>
                                        </div>
                                        <button onClick={() => onNavigate('task', cat.category)} className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
                                            <Eye className="w-4 h-4 mr-2" /> 업무 상세보기
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 차트 */}
                {categoryData.length > 0 && (
                    <DrillDownDonutChart
                        regionName={selected === '' ? '전국' : regionNameMap[selected]}
                        categoryData={categoryData}
                    />
                )}
            </div>
        </div>
    );
};

export default MapPage;