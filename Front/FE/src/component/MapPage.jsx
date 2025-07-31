import { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoData from '../data/kr.json';
import regionNameMap from '../data/regionNameMap';
import ComparisonGrid from './ComparisonGrid';
import ChartTabs from './ChartTabs';
import Modal from './Modal';
import { BarChart3, Home, FileText, Eye } from 'lucide-react';

const MapPage = ({ selected, setSelected, onNavigate, setCategoryData, categoryData }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalType, setModalType] = useState(null); // 'chart' | 'comparison' | null

    const handleOpenChartModal = () => setModalType('chart');
    const handleOpenComparisonModal = () => setModalType('comparison');
    const handleCloseModal = () => setModalType(null);

    const cityList = useMemo(() => Object.keys(regionNameMap), []);

    useEffect(() => {
        const korRegion = regionNameMap[selected] || '';
        handleFetch(selected ? korRegion : '');
    }, [selected]);

    const handleFetch = async (korRegion = '') => {
        setIsLoading(true);
        setError(null);
        try {
        const query = korRegion ? `?region=${encodeURIComponent(korRegion)}` : '';
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/maps/overview/${query}`);
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

    const handleCitySelect = (engRegion = '') => {
        setSelected(engRegion);
    };

    return (
        <div className="min-h-screen bg-gray-50">
        {/* ✅ 네비게이션 */}
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <span className="text-xl font-bold text-slate-800">감사연구원</span>
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

        {/* ✅ 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            {/* 분야 및 업무 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                <h2 className="text-xl font-semibold text-slate-800">분야 및 업무</h2>
                <p className="text-sm text-slate-600 mt-1">그래프 및 표로 확인하세요.</p>
                </div>
                <div className="flex gap-3">
                <button onClick={handleOpenChartModal} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
                    <BarChart3 className="w-4 h-4" />
                    상세 데이터 보기
                </button>
                <button onClick={handleOpenComparisonModal} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg">
                    <FileText className="w-4 h-4" />
                    비교표 보기
                </button>
                </div>
            </div>
            </div>

            {/* ✅ 모달 */}
            <Modal isOpen={modalType !== null} onClose={handleCloseModal}>
            {modalType === 'chart' && categoryData.length > 0 && (
                <ChartTabs
                regionName={selected === '' ? '전국' : regionNameMap[selected]}
                categoryData={categoryData}
                />
            )}
            {modalType === 'comparison' && <ComparisonGrid />}
            {modalType === 'chart' && categoryData.length === 0 && (
                <div className="text-center text-slate-500 py-8">데이터가 없습니다.</div>
            )}
            </Modal>

            {/* 지역별 통계 */}
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
                        return (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleCitySelect(engName)}
                            style={{
                            default: {
                                fill: selected === engName ? "#1e293b" : "#cbd5e1",
                                stroke: "#fff",
                                strokeWidth: 1
                            },
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

            {/* 지역 선택 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">지역 선택</h3>
                <div className="space-y-2">
                <button
                    onClick={() => handleCitySelect('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${selected === '' ? 'bg-slate-800 text-white' : 'bg-gray-50 text-slate-700 hover:bg-gray-100'}`}
                >
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
                <p className="text-sm text-slate-600 mt-1">
                {selected ? regionNameMap[selected] : '전국'}의 분야별 감사 현황입니다.
                </p>
            </div>
            <div className="p-6">
                {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mr-3"></div>
                    <span className="text-slate-600">데이터를 불러오는 중...</span>
                </div>
                ) : error ? (
                <div className="text-center text-red-600 py-8">{error}</div>
                ) : categoryData.length === 0 ? (
                <div className="text-center text-slate-500 py-12">해당 지역의 데이터가 없습니다.</div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryData.map((cat) => (
                    <div key={cat.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                        <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-slate-800">{cat.category}</h3>
                        <span className="text-2xl font-bold text-slate-700">{cat.count}</span>
                        </div>
                        <button
                        onClick={() => onNavigate('task', cat.category)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                        >
                        <Eye className="w-4 h-4 mr-2" />
                        업무 상세보기
                        </button>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
};

export default MapPage;
