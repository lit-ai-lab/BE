import { useState, useMemo } from 'react';
import zone from '../data/state_agency.json'; 
import catTasks from '../data/category_tasks.json';
import inspection from '../data/inspection_type.json';
import { Map, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Filtering from './Filtering';
import DataTable from './DataTable';
import { useSearchParams } from 'react-router-dom';

const mapToApiParams = {
  state: 'regionId',
  agency: 'agencyId',
  type: 'auditTypeId',
  category: 'categoryId',
  task: 'taskId',
  keyword: 'keyword',
  keywordMode: 'keywordMode',
  keywordExtras: 'keywordExtras',
  specialCase: 'includeSpecial',
  startDate: 'startDate',
  endDate: 'endDate'
};

const MainPage = ({ state, setState }) => {
  const { filters, data, selectedStateId } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const agencyOptions = useMemo(() => {
    if (!selectedStateId) return [];
    return zone
      .filter((item) => item.stateId === selectedStateId)
      .map((item) => ({ agencyId: item.agencyId, agencyName: item.agencyName }));
  }, [selectedStateId]);

  const handleStateChange = (e) => {
    const id = Number(e.target.value);
    const stateName = zone.find((z) => z.stateId === id)?.stateName || '';
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, state: stateName, agency: '' },
      selectedStateId: id,
    }));
  };

  const handleSearch = async (newFilters = filters) => {
    setIsLoading(true);
    setError(null);

    try {
      setState((prev) => ({ ...prev, filters: newFilters }));

      const queryString = Object.entries(newFilters)
        .filter(([_, val]) => val !== '' && val !== null)
        .flatMap(([key, val]) => {
          const paramKey = mapToApiParams[key] || key;
          if (Array.isArray(val)) {
            return val.map((v) => `${paramKey}=${encodeURIComponent(v)}`);
          } else {
            return `${paramKey}=${encodeURIComponent(val)}`;
          }
        })
        .join("&");

      const url = `${import.meta.env.VITE_API_BASE_URL}/api/viewer/${queryString ? '?' + queryString : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("조회 실패");

      const result = await res.json();
      setState((prev) => ({ ...prev, data: result }));
    } catch (err) {
      setError(err.message || "에러 발생");
      setState((prev) => ({ ...prev, data: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setState({
      filters: {
        state: '',
        agency: '',
        type: '',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        category: '',
        task: '',
        specialCase: '',
        keyword: '',
        keywordMode: null,
        keywordExtras: [],
      },
      selectedStateId: '',
      data: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold text-slate-800">감사연구원</span>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => navigate('/')} className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors">
                <Home className="w-4 h-4 mr-2" /> 홈
              </button>
              <button onClick={() => navigate('/map')} className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors">
                <Map className="w-4 h-4 mr-2" /> 지역별 통계
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">감사결과 조회</h1>
          <p className="text-slate-600">감사결과의 분류, 요약, 상세분석을 확인하세요.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <Filtering
            filters={filters}
            setFilters={(f) => setState((prev) => ({ ...prev, filters: f }))}
            onSearch={handleSearch}
            onReset={handleReset}
            onStateChange={handleStateChange}
            agencyOptions={agencyOptions}
            selectedStateId={selectedStateId}
            catTasks={catTasks}
            inspectionTypes={inspection.inspection_types}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-slate-800">검색 결과</h2>
            <div className="text-sm text-slate-600 mt-1 flex items-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
                  </svg>
                  <span>데이터를 불러오는 중입니다...</span>
                </>
              ) : error ? (
                <>
                  <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
                  </svg>
                  <span className="text-red-500">⚠️ 데이터 조회 중 오류가 발생했습니다: {error}</span>
                </>
              ) : (
                <span>총 {data.length}건의 감사 데이터가 조회되었습니다.</span>
              )}
            </div>
          </div>
          <DataTable
            data={data}
            isLoading={isLoading}
            error={error}
            startDate={filters.startDate}
            endDate={filters.endDate}
            regionId={filters.state}
            agencyId={filters.agency}
            auditTypeId={filters.type}
            categoryId={filters.category}
            taskId={filters.task}
            keyword={filters.keyword}
            includeSpecial={filters.specialCase}
            keywordMode={filters.keywordMode}
            keywordExtras={filters.keywordExtras}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
