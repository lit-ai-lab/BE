import { useState, useMemo } from 'react';
import zone from '../data/state_agency.json'; 
//import mapToApiParams from '../data/mapToApiParams';
import catTasks from '../data/category_tasks.json';
import inspection from '../data/inspection_type.json';
import { Map,Home, Shield} from 'lucide-react';

import Filtering from './Filtering';
import DataTable from './DataTable';

const mapToApiParams = {
  state: 'regionId',
  agency: 'agencyId',
  type: 'auditTypeId',
  category: 'categoryId',
  task: 'taskId',
  keyword: 'keyword',
  specialCase: 'includeSpecial',
  startDate: 'startDate',
  endDate: 'endDate'
};

const MainPage = ({ state, setState, onNavigate }) => {
  const { filters, data, selectedStateId } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryString = Object.entries(filters)
      .filter(([_, val]) => val !== '' && val !== null)
      .map(([key, val]) => `${mapToApiParams[key] || key}=${encodeURIComponent(val)}`)
      .join("&");
      console.log('[DEBUG] 생성된 queryString: ', queryString);


      const url = `${import.meta.env.VITE_API_BASE_URL}/api/viewer/${queryString ? '?' + queryString : ''}`;
      console.log('[DEBUG] 생성된 filters: ', filters);
      
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
        state: '', agency: '', type: '', startDate: '2024-01-01',
        endDate: '2024-12-31', category: '', task: '',
        specialCase: 'false', keyword: '',
      },
      selectedStateId: '',
      data: [],
    });
  };

  return (
  <div className="min-h-screen bg-gray-50">
    {/* 헤더 네비게이션 - Fixed */}
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-bold text-slate-800">감사연구원</span>
          </div>
          <div className="flex space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              홈
            </button>
            <button
              onClick={() => onNavigate('map')}
              className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Map className="w-4 h-4 mr-2" />
              지역별 통계
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    {/* 메인 컨텐츠 - 상단 패딩 추가 */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">감사결과 조회</h1>
        <p className="text-slate-600">감사결과의 분류, 요약, 상세분석을 확인하세요.</p>
      </div>
      
      {/* 필터링 섹션 */}
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
      
      {/* 데이터 테이블 섹션 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-slate-800">검색 결과</h2>
          <p className="text-sm text-slate-600 mt-1">
            총 {data.length}건의 감사 데이터가 조회되었습니다.
          </p>
        </div>
        <DataTable
          data={data}
          isLoading={isLoading}
          error={error}
          onNavigate={onNavigate}
          startDate={filters.startDate}
          endDate={filters.endDate}
          regionId={filters.state}
          agencyId={filters.agency}
          auditTypeId={filters.type}
          categoryId={filters.category}
          taskId={filters.task}
          keyword={filters.keyword}
          includeSpecial={filters.specialCase}
        />
      </div>
    </div>
  </div>
);
};

export default MainPage;

