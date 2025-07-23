// import React, { useState } from 'react';
// import { Map, Home } from 'lucide-react';
// import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// // 대한민국 GeoJSON 경로 (한글 이름 포함)
// const geoUrl = "https://raw.githubusercontent.com/gistait/geojson-korea/master/korea-provinces.json";

// // 한글 시도명 ↔ GeoJSON 내 행정명 매핑
// const regionMap = {
//   '서울': '서울특별시',
//   '부산': '부산광역시',
//   '대구': '대구광역시',
//   '인천': '인천광역시',
//   '광주': '광주광역시',
//   '대전': '대전광역시',
//   '울산': '울산광역시',
//   '세종': '세종특별자치시',
//   '경기': '경기도',
//   '강원': '강원도',
//   '충북': '충청북도',
//   '충남': '충청남도',
//   '전북': '전라북도',
//   '전남': '전라남도',
//   '경북': '경상북도',
//   '경남': '경상남도',
//   '제주': '제주특별자치도'
// };

// const MapPage = ({ onNavigate }) => {
//   const [selectedCity, setSelectedCity] = useState(null);
//   const regions = Object.keys(regionMap);

//   // 지도 클릭 시 역매핑하여 한글 지역명 저장
//   const handleRegionClick = (regionNameFromGeo) => {
//     const matchedKey = Object.keys(regionMap).find(k => regionMap[k] === regionNameFromGeo);
//     if (matchedKey) {
//       setSelectedCity(matchedKey);
//     }
//   };

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
//       {/* 헤더 */}
//       <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '24px' }}>
//         <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//             <button onClick={() => onNavigate('home')} style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f1f5f9' }}>
//               <Home size={20} color="#475569" />
//             </button>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//               <div style={{ width: '32px', height: '32px', backgroundColor: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <Map size={20} color="white" />
//               </div>
//               <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>지역별 통계</h1>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <span style={{ fontSize: '14px', color: '#64748b' }}>
//               {selectedCity ? `${selectedCity} 광역자치단체` : '전국 통계'}
//             </span>
//             <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
//               데이터 새로고침
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 본문 */}
//       <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
//         <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
//           {/* 지도 */}
//           <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
//             <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>
//               {selectedCity ? `${selectedCity} 광역자치단체` : '전국 지도'}
//             </h2>
//             <div style={{ height: '400px', background: 'linear-gradient(to bottom right, #f1f5f9, #e2e8f0)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <ComposableMap
//                 projection="geoMercator"
//                 projectionConfig={{ scale: 5000, center: [127.7669, 35.9078] }}
//                 style={{ width: '100%', height: '100%' }}
//               >
//                 <Geographies geography={geoUrl}>
//                   {({ geographies }) =>
//                     geographies.map((geo) => {
//                       const regionName = geo.properties.name;
//                       const isSelected = regionMap[selectedCity] === regionName;

//                       return (
//                         <Geography
//                           key={geo.rsmKey}
//                           geography={geo}
//                           onClick={() => handleRegionClick(regionName)}
//                           fill={isSelected ? '#2563eb' : '#cbd5e1'}
//                           stroke="#ffffff"
//                           style={{
//                             default: { outline: 'none' },
//                             hover: { fill: '#94a3b8', outline: 'none' },
//                             pressed: { outline: 'none' },
//                           }}
//                         />
//                       );
//                     })
//                   }
//                 </Geographies>
//               </ComposableMap>
//             </div>

//             {/* 버튼 영역 */}
//             <div style={{ marginTop: '24px' }}>
//               <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '12px' }}>지역 선택</h3>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//                 <button
//                   onClick={() => setSelectedCity(null)}
//                   style={{
//                     padding: '8px 16px',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     backgroundColor: selectedCity === null ? '#1e293b' : '#f1f5f9',
//                     color: selectedCity === null ? 'white' : '#334155',
//                     border: 'none',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   전국
//                 </button>
//                 {regions.map((region) => (
//                   <button
//                     key={region}
//                     onClick={() => setSelectedCity(region)}
//                     style={{
//                       padding: '8px 16px',
//                       borderRadius: '8px',
//                       fontSize: '14px',
//                       fontWeight: '500',
//                       backgroundColor: selectedCity === region ? '#2563eb' : '#f1f5f9',
//                       color: selectedCity === region ? 'white' : '#334155',
//                       border: 'none',
//                       cursor: 'pointer'
//                     }}
//                   >
//                     {region}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 오른쪽 패널 (추후 데이터 카드 등) */}
//           <div></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapPage;

// import React, { useState } from 'react';
// import { SimpleSouthKoreaMapChart } from 'react-simple-south-korea-map-chart';

// export default function MapPage() {
//   const [selected, setSelected] = useState(null);

//   const data = [
//     { locale: '서울특별시', count: 1000 },
//     { locale: '부산광역시', count: 400 },
//     // 필요한 시도명 및 값 추가
//   ];

//   const setColor = (count) => {
//     if (count > 800) return '#2563eb';
//     if (count > 300) return '#61cdbb';
//     return '#cbd5e1';
//   };

//   return (
//     <div>
//       <h2>{selected ? `${selected} 선택됨` : '차트 기반 지도 사용'}</h2>
//       <SimpleSouthKoreaMapChart
//         data={data}
//         setColorByCount={setColor}
//         onClick={(region) => setSelected(region.name)}
//       />
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import { SVGMap } from 'react-svg-map';
// import 'react-svg-map/lib/index.css';
// import southKorea from '@svg-maps/south-korea';

// // 영어 → 한글 매핑
// const regionNameMap = {
//   'Seoul': '서울특별시',
//   'Incheon': '인천광역시',
//   'Daejeon': '대전광역시',
//   'Daegu': '대구광역시',
//   'Gwangju': '광주광역시',
//   'Ulsan': '울산광역시',
//   'Busan': '부산광역시',
//   'Sejong': '세종특별자치시',
//   'Gyeonggi': '경기도',
//   'Gangwon': '강원도',
//   'North Chungcheong': '충청북도',
//   'South Chungcheong': '충청남도',
//   'North Jeolla': '전라북도',
//   'South Jeolla': '전라남도',
//   'North Gyeongsang': '경상북도',
//   'South Gyeongsang': '경상남도',
//   'Jeju': '제주특별자치도',
// };

// export default function MapPage({onNavigate}) {
//   const [selected, setSelected] = useState(null);
//   const [category, setCategory] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const onLocationClick = (event) => {
//     const name = event.target.getAttribute('name');
//     setSelected(name);
//   };

//   // 버튼용 도시 리스트
//   const cityList = Object.keys(regionNameMap);

//   return (
//     <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
//       {/* 선택된 도시명 */}
//       <h2 style={{ marginBottom: '16px' }}>
//         {selected ? `${regionNameMap[selected] || selected} 선택됨` : 'SVG 기반 지도 사용'}
//       </h2>

//       {/* SVG 지도 */}
//       <SVGMap
//         map={southKorea}
//         onLocationClick={onLocationClick}
//         locationClassName={(location) =>
//           location.name === selected
//             ? 'svg-map__location svg-map__location--selected'
//             : 'svg-map__location'
//         }
//       />

//       {/* 지도 스타일 */}
//       <style>{`
//         .svg-map__location { fill: #cbd5e1; stroke: #fff; }
//         .svg-map__location:hover { fill: #94a3b8; }
//         .svg-map__location--selected { fill: #2563eb; }
//       `}</style>

//       {/* 도시 선택 버튼 */}
//       <div style={{ marginTop: '24px' }}>
//         <h3 style={{ marginBottom: '12px' }}>도시 선택</h3>
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//           {cityList.map((engName) => (
//             <button
//               key={engName}
//               onClick={() => setSelected(engName)}
//               style={{
//                 padding: '8px 12px',
//                 backgroundColor: selected === engName ? '#2563eb' : '#f1f5f9',
//                 color: selected === engName ? 'white' : '#1e293b',
//                 border: '1px solid #cbd5e1',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 fontSize: '14px'
//               }}
//             >
//               {regionNameMap[engName]}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 기타 영역 */}
//       <div style={{ marginTop: '40px' }}>
//         <h2>Top</h2>
//         <div>
//             <h2>분야</h2>
//             {category.map(cat => (
//                 <div key={cat.id}>
//                     <p>{cat.category}</p>
//                     <p>{cat.count}</p>
//                     <button onClick={() => onNavigate('task')}>확인</button>
//                 </div>
//             ))}
//         </div>
//       </div>

//       <div>
//         <h2>그래프</h2>
//       </div>
//     </div>
//   );
// }

// const Task = ({onNavigate}) => {
//     return(
//         <div>
//             <h2>업무</h2>
//             <button onClick={() => onNavigate('category')}>
//                 X
//             </button>
//             {task.map(t => (
//                 <div key={t.id}>
//                     <p>{t.task}</p>
//                     <p>{t.count}</p>
//                 </div>
//             ))}
//         </div>
//     )
// }

//.svg-map__location--selected { fill: #2563eb; }

import { useState, useEffect } from "react";
import { SVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";
import southKorea from "@svg-maps/south-korea";

// 영어 → 한글 매핑
const regionNameMap = {
  Seoul: "서울",
  Incheon: "인천광역시",
  Daejeon: "대전광역시",
  Daegu: "대구광역시",
  Gwangju: "광주광역시",
  Ulsan: "울산광역시",
  Busan: "부산광역시",
  Sejong: "세종특별자치시",
  Gyeonggi: "경기도",
  Gangwon: "강원도",
  "North Chungcheong": "충청북도",
  "South Chungcheong": "충청남도",
  "North Jeolla": "전라북도",
  "South Jeolla": "전라남도",
  "North Gyeongsang": "경상북도",
  "South Gyeongsang": "경상남도",
  Jeju: "제주특별자치도",
};

export default function MapPage({ onNavigate }) {
  const [selected, setSelected] = useState(""); // ''이면 전국
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 도시 리스트 버튼용
  const cityList = Object.keys(regionNameMap);

  // ✅ 서버 요청 함수
  const fetchCategory = async (regionName = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const query = regionName
        ? `?region=${encodeURIComponent(regionName)}`
        : "";
      const res = await fetch(
        `http://10.10.10.12:8000/api/map/overview/${query}`,
      );

      if (!res.ok) throw new Error("데이터 요청 실패");

      const result = await res.json();

      setCategory(result.top10_categories || []);
    } catch (err) {
      setError(err.message || "알 수 없는 오류 발생");
      setCategory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 첫 진입 시: 전국 데이터 요청
  useEffect(() => {
    fetchCategory(); // region 없이 호출
  }, []);

  // ✅ 도시 클릭 시
  const onLocationClick = (event) => {
    const region = event.target.getAttribute("name");
    setSelected(region);
    fetchCategory(regionNameMap[region]); // 한글명으로 요청
  };

  // ✅ 도시 버튼 클릭 시
  const handleCitySelect = (engName) => {
    setSelected(engName);
    fetchCategory(regionNameMap[engName]);
  };

  // ✅ 전국 버튼 클릭 시
  const handleNationwide = () => {
    setSelected("");
    fetchCategory(); // 전체 요청
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "16px" }}>
        {selected
          ? `${regionNameMap[selected] || selected} 선택됨`
          : "전국 통계"}
      </h2>

      {/* SVG 지도 */}
      <SVGMap
        map={southKorea}
        onLocationClick={onLocationClick}
        locationClassName={(location) =>
          location.name === selected
            ? "svg-map__location svg-map__location--selected"
            : "svg-map__location"
        }
      />
      <style>{`
        .svg-map__location { fill: #cbd5e1; stroke: #fff; }
        .svg-map__location:hover { fill: #94a3b8; }
        .svg-map__location--selected { fill: #2563eb; }
      `}</style>

      {/* 도시 선택 버튼 */}
      <div style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "12px" }}>도시 선택</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            onClick={handleNationwide}
            style={{
              padding: "8px 12px",
              backgroundColor: selected === "" ? "#2563eb" : "#f1f5f9",
              color: selected === "" ? "white" : "#1e293b",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            전국
          </button>
          {cityList.map((engName) => (
            <button
              key={engName}
              onClick={() => handleCitySelect(engName)}
              style={{
                padding: "8px 12px",
                backgroundColor: selected === engName ? "#2563eb" : "#f1f5f9",
                color: selected === engName ? "white" : "#1e293b",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {regionNameMap[engName]}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 영역 */}
      <div style={{ marginTop: "40px" }}>
        <h2>분야 통계</h2>
        {isLoading && <p>불러오는 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!isLoading && !error && category.length === 0 && <p>데이터 없음</p>}
        {!isLoading &&
          !error &&
          category.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "8px" }}>
              <p>
                {cat.category} ({cat.count})
              </p>
              <button onClick={() => onNavigate("task", cat)}>확인</button>{" "}
              //확인버튼눌렀을때 fetchCategory
            </div>
          ))}
      </div>

      {/* 향후 그래프 영역 */}
      <div>
        <h2>그래프</h2>
        {/* 그래프 컴포넌트 추가 가능 */}
      </div>
    </div>
  );
}

const TaskPage = ({ category, onNavigate }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!category) return;

      setIsLoading(true);
      setError(null);

      try {
        const encodedCategory = encodeURIComponent(category);
        const res = await fetch(
          `http://10.10.10.12:8000/api/map/overview/category_detail/${encodedCategory}`,
        );
        if (!res.ok) throw new Error("업무 상세 요청 실패");
        const result = await res.json(); // 백엔드에서 id 포함된 배열을 반환
        setTasks(result);
      } catch (err) {
        setError(err.message || "알 수 없는 오류 발생");
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [category]);

  return (
    <div style={{ padding: "24px" }}>
      <h2>카테고리: {category}</h2>
      <button onClick={() => onNavigate("map")}>← 돌아가기</button>

      {isLoading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!isLoading && !error && tasks.length === 0 && <p>업무 데이터 없음</p>}

      {!isLoading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ margin: "8px 0" }}>
              <strong>{task.task}</strong>: {task.count}건
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
