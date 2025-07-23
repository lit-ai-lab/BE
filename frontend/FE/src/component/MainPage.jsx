import {useState, useEffect} from 'react';
import mapToApiParams from '../data/mapToApiParams';
import zone from '../src/data/state_agency.json';

const MainPage = ({ onNavigate }) => {
  const [filters, setFilters] = useState({
      state: '',  //도시는 조회 시 서버에 함께 전달되어야 하므로 포함
      agency: '',
      type: '',
      startDate: '',//2024-01-01
      endDate: '', //2024-12-31
      category: '',
      task: '',
      specialCase: '', //false
      keyword: '',
    });

  //사이드바 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //데이터 상태
  const [data, setData] = useState([]);
  
  //로딩(서버 요청) / 에러(서버 요청 중 에러 메세지 발생) 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //감사실시기관 옵션
  const [agencyOptions, setAgencyOptions] = useState([]);

  const [selectedStateId, setSelectedStateId] = useState('');

  //로직: 1. 지역 선택 > 관련 감사 기관 보여줌
  const handleStateChange = (e) => {
    const selectedId = Number(e.target.value); // 문자열 → 숫자 변환
    setSelectedStateId(selectedId); 

    // 2. 선택된 stateId에 해당하는 stateName 추출
    const stateEntry = zone.find((item) => item.stateId === selectedId);
    const stateName = stateEntry?.stateName || "";

    // 3. filters 상태에 stateName 저장
    setFilters((prev) => ({
      ...prev,
      state: stateName,
      agency: "", // 도시 변경 시 기관 초기화
    }));

    // 4. 해당 stateId에 속한 기관 목록 필터링
    if (!selectedId || !stateName) {
      setAgencyOptions([]); // 아무것도 선택 안 했을 경우 초기화
      return;
    }

    const filteredAgencies = zone
          .filter((item) => item.stateId === selectedId)
          .map((item) => ({
          agencyId: item.agencyId,
          agencyName: item.agencyName,
    }));

    // 5. 기관 옵션 업데이트
    setAgencyOptions(filteredAgencies);
  };

  //기본 데이터 조회 (첫 화면) -> 첫 렌더링 시 한 번만 실행
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("http://10.10.10.12:8000/api/viewer/");
        if (!res.ok) throw new Error("기본 데이터 요청 실패");

        const result = await res.json();
        setData(result);
      } catch (err) {
          setError(err.message || "알 수 없는 오류 발생");
          setData([]);
        } finally {
          setIsLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  //로직: 조회 버튼 클릭 > 필터 조건을 서버에 요청 > 데이터 받기 > DataTable에 전달
  const handleSearch = async () => {  //async/await 사용하는 이유는 비동기 작업(fetch)의 결과(완료되기)를 기다려서 다음 줄을 실행하고 싶을 때. 그냥 비동기 쓰면 순서 꼬임
    try{
      setIsLoading(true);
      setError(null);

      const queryString = Object.entries(filters) //객체를 배열로 바꾸는 함수
        .filter(([_, val]) => val !== "" && val !== null)    //특수사례가 false가 기본값이므로, false는 통과시킴
        .map(([key, val]) => {
          const apiKey = mapToApiParams[key] || key;
          return `${apiKey}=${encodeURIComponent(val)}`;
        })
        .join("&");

      const url = `http://10.10.10.12:8000/api/viewer/${queryString ? "?" + queryString : ""}`;
      //await를 쓰면 Promise가 끝날 때까지 기다림. 순서를 보장함
      const res = await fetch(url);  //서버 요청. queryString이 비어있으면(필터 안 했을 때) 기본 전체 요청(/api/audits)이 되고, 값이 있으면 뒤에 붙음

      if (!res.ok) throw new Error("서버 응답 실패"); //응답코드가 200(성공)이 아니라면 에러 발생시킴. catch 블록으로 자동 이동
            
      //여긴 fetch 끝난 다음에 실행됨
      const result = await res.json();
      setData(result);    //성공한 데이터 저장. JSON 형태로 응답 받으면 data에 저장. DataTable에 props로 전달
    } catch (err){  //서버 요청 실패 시 이쪽으로
        setError(err.message || "알 수 없는 오류 발생");    //에러 메시지 저장
        setData([]);    //이전 데이터 초기화 -> 지금은 아무것도 없다고 보여주기 위함
      } finally {
          setIsLoading(false);    //어떤 결과든 무조건 마지막에 로딩 상태 종료 시킴
      }
  };

  //초기화 버튼 클릭 > 모든 필터 상태 비움 > 서버에 기본 데이터 요청(fetch) 다시 보냄 > DataTable에 전체 데이터 보이게 만듦
  const handleReset = async () => {
    setFilters({
      state: '',
      agency: '',
      type: '',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      category: '',
      task: '',
      specialCase: '',  //false ??
      keyword: '',
    });
    setAgencyOptions([]);   //기관 옵션도 초기화 필요

    //전체 데이터 요청
    try{
      setIsLoading(true);
      setError(null);

      const res = await fetch("http://10.10.10.12:8000/api/viewer/");   //기다린다
      if(!res.ok) throw new Error("전체 데이터 요청 실패");

      const result = await res.json();    //또 기다림
      setData(result);    //다 끝난 다음에 실행됨
    } catch (err) {
        setError(err.message || "알 수 없는 오류 발생");
        setData([]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div style={{display: 'flex'}}>
      {/* 사이드바 */}
      <div className={isSidebarOpen ? 'w-72' : 'w-16'}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          메뉴
        </button>
        <button onClick={() => onNavigate('home')}>
          홈
        </button>
        <button onClick={() => onNavigate('map')}>
          통계
        </button>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div style={{flex: 1}}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Filtering 
          filters={filters} 
          setFilters={setFilters} 
          onSearch={handleSearch} 
          onReset={handleReset}
          onStateChange={handleStateChange}   //도시 선택 핸들러
          agencyOptions={agencyOptions}   //기관 드롭다운 옵션
          selectedStateId={selectedStateId}
        />
        <DataTable data = {data} isLoading = {isLoading} error = {error} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default MainPage;