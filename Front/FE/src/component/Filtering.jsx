// import { useState, useMemo } from 'react';
// import { Filter, Search, X } from 'lucide-react';
// import zone from '../data/state_agency.json';

// const Filtering = ({
//     filters, setFilters,
//     onSearch, onReset,
//     catTasks, inspectionTypes
// }) => {

// const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({
//         ...filters,
//         [name]: value,
//         ...(name === 'category' ? { task: '' } : {}),
//     });
// };

// const onStateChange = (e) => {
//     const stateId = e.target.value;
//     setFilters({
//         ...filters,
//         state: stateId,
//         agency: '',
//     });
// };

// const stateList = useMemo(() => {
//     const map = new Map();
//     zone.forEach(({ stateId, stateName }) => {
//         if (!map.has(stateId)) map.set(stateId, stateName);
//     });

//     // 전체 리스트 추출
//     const states = Array.from(map, ([stateId, stateName]) => ({ stateId, stateName }));

//     // ✅ 전국 제외
//     const filtered = states.filter(({ stateName }) => stateName !== "전국");

//     // ✅ 사용자 정의 정렬 순서
//     const regionOrder = [
//         "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시",
//         "세종특별자치시", "경기도", "강원특별자치도", "충청북도", "충청남도", "전북특별자치도", "전라남도",
//         "경상북도", "경상남도", "제주특별자치도"
//     ];

//     // ✅ regionOrder 기준 정렬
//     filtered.sort((a, b) => regionOrder.indexOf(a.stateName) - regionOrder.indexOf(b.stateName));

//     return filtered;
// }, [zone]);

// // const stateList = useMemo(() => {
// //     const map = new Map();
// //     zone.forEach(({ stateId, stateName }) => {
// //         if (!map.has(stateId)) map.set(stateId, stateName);
// //     });
// //     return Array.from(map, ([stateId, stateName]) => ({ stateId, stateName }));
// // }, []);

// const filteredAgencies = filters.state
//     ? zone.filter((z) => String(z.stateName) === String(filters.state))
//     : [];

// // const taskList = filters.category
// //     ? [...(catTasks[filters.category] || [])].sort()
// //     : [];

// const sortedInspectionTypes = [...inspectionTypes].sort((a, b) =>
//     a.name.localeCompare(b.name)
// );

// return (
//     <div className="p-6">
//       {/* 첫 번째 줄: 감사기간 시작/종료 + 감사실시기관 + 감사종류 */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//             {/* 감사실시기관 - 권역 + 기관 */}
//             <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">감사실시기관</label>
//             <div className="grid grid-cols-2 gap-2">
//                 <select
//                 name="state"
//                 value={filters.state}
//                 onChange={onStateChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
//                 >
//                 <option value="">권역</option>
//                 {stateList.map(({ stateId, stateName }) => (
//                     <option key={stateId} value={stateName}>{stateName}</option>
//                 ))}
//                 </select>

//                 <select
//                 name="agency"
//                 value={filters.agency}
//                 onChange={handleChange}
//                 disabled={!filters.state}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100"
//                 >
//                 <option value="">실시기관</option>
//                 {filteredAgencies.map((z) => (
//                     <option key={z.agencyId} value={z.agencyName}>
//                     {z.agencyName}
//                     </option>
//                 ))}
//                 </select>
//             </div>
//         </div>
        
//         <SelectBox label="감사 종류" name="type" value={filters.type} onChange={handleChange} options={sortedInspectionTypes} optionKey="name" optionLabel="name" />

//         <InputDate label="감사기간 (시작)" name="startDate" value={filters.startDate} onChange={handleChange} />
//         <InputDate label="감사기간 (종료)" name="endDate" value={filters.endDate} onChange={handleChange} />
//     </div>

//     {/* 두 번째 줄: 분야, 업무, 특이사례 */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <SelectBox label="분야" name="category" value={filters.category} onChange={handleChange} options={catTasks.map((item) => ({ value: item.category, label: item.category}))} optionKey="value" optionLabel="label" />
//         <SelectBox 
//             label="업무" 
//             name="task" 
//             value={filters.task} 
//             onChange={handleChange} 
//             options={
//                 // 선택된 category_id에 해당하는 task 배열 찾기
//                 (catTasks.find((item) => item.category === filters.category)?.task || [])
//                 .map((t) => ({
//                     value: t.task,  // 실제 value
//                     label: t.task      // 표시될 라벨
//                 }))
//             } 
//             optionKey="value" 
//             optionLabel="label" 
//             disabled={!filters.category} 
//         />
//         <SelectBox label="특이사례" name="specialCase" value={filters.specialCase} onChange={handleChange} options={[
//             { key: 'false', label: '미해당' },
//             { key: 'true', label: '해당' }
//         ]} optionKey="key" optionLabel="label" />
//     </div>

//     {/* 세 번째 줄: 키워드 검색창 */}
//     <div className="mb-6">
//         <label className="block text-sm font-semibold text-slate-700 mb-2">키워드</label>
//         <input 
//             name="keyword" 
//             value={filters.keyword} 
//             onChange={handleChange} 
//             placeholder="검색할 키워드를 입력하세요" 
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500" 
//         />
//     </div>

//     {/* 버튼 */}
//     <div className="flex space-x-4">
//         <button onClick={onSearch} className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
//             <Search className="w-4 h-4 mr-2" />
//             조회
//         </button>
//         <button onClick={onReset} className="flex items-center px-6 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors">
//             <X className="w-4 h-4 mr-2" />
//             초기화
//         </button>
//         </div>
//     </div>
//     );
// };

// export default Filtering;

// // 날짜 입력 서브 컴포넌트
// const InputDate = ({ label, name, value, onChange }) => (
//     <div>
//         <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
//         <input type="date" name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
//     </div>
// );

// // 셀렉트 박스 공통
// const SelectBox = ({ label, name, value, onChange, options, optionKey, optionLabel, disabled = false }) => (
//     <div>
//         <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
//         <select name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100">
//         <option value="">전체</option>
//         {options.map((opt, idx) => (
//             <option key={idx} value={opt[optionKey]}>{opt[optionLabel]}</option>
//         ))}
//         </select>
//     </div>
// );

import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import zone from '../data/state_agency.json';
import SelectBox from './SelectBox';

const Filtering = ({
  filters, setFilters,
  onSearch, onReset,
  catTasks, inspectionTypes
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      ...(name === 'category' ? { task: '' } : {}),
    });
  };

  const stateList = useMemo(() => {
    const map = new Map();
    zone.forEach(({ stateId, stateName }) => {
      if (!map.has(stateId)) map.set(stateId, stateName);
    });

    const states = Array.from(map, ([stateId, stateName]) => ({ stateId, stateName }));
    const filtered = states.filter(({ stateName }) => stateName !== '전국');

    const regionOrder = [
      '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
      '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도',
      '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도',
      '경상남도', '제주특별자치도'
    ];

    filtered.sort((a, b) => regionOrder.indexOf(a.stateName) - regionOrder.indexOf(b.stateName));
    return filtered;
  }, []);

  const filteredAgencies = filters.state
    ? zone.filter((z) => z.stateName === filters.state)
    : [];

  const sortedInspectionTypes = [...inspectionTypes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="p-6">
      {/* 1. 감사실시기관 + 감사 종류 + 기간 */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr_1fr] gap-6 mb-6">
        {/* 권역/기관 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">감사실시기관</label>
          <div className="grid grid-cols-2 gap-2">
            <SelectBox
              name="state"
              value={filters.state}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  state: e.target.value,
                  agency: '',
                })
              }
              options={stateList}
              optionKey="stateName"
              optionLabel="stateName"
              placeholder="권역"
            />
            <SelectBox
              name="agency"
              value={filters.agency}
              onChange={handleChange}
              disabled={!filters.state}
              options={filteredAgencies}
              optionKey="agencyName"
              optionLabel="agencyName"
              placeholder="실시기관"
            />
          </div>
        </div>

        {/* 감사 종류 */}
        <SelectBox
          label="감사 종류"
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={sortedInspectionTypes}
          optionKey="name"
          optionLabel="name"
        />

        {/* 날짜 */}
        <InputDate label="감사기간 (시작)" name="startDate" value={filters.startDate} onChange={handleChange} />
        <InputDate label="감사기간 (종료)" name="endDate" value={filters.endDate} onChange={handleChange} />
      </div>

      {/* 2. 분야/업무/특이사례 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SelectBox
          label="분야"
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={catTasks.map((item) => ({ value: item.category, label: item.category }))}
          optionKey="value"
          optionLabel="label"
        />
        <SelectBox
          label="업무"
          name="task"
          value={filters.task}
          onChange={handleChange}
          disabled={!filters.category}
          options={
            (catTasks.find((item) => item.category === filters.category)?.task || [])
              .map((t) => ({ value: t.task, label: t.task }))
          }
          optionKey="value"
          optionLabel="label"
        />
        <SelectBox
          label="특이사례"
          name="specialCase"
          value={filters.specialCase}
          onChange={handleChange}
          options={[
            { key: 'false', label: '미해당' },
            { key: 'true', label: '해당' },
          ]}
          optionKey="key"
          optionLabel="label"
        />
      </div>

      {/* 3. 키워드 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">키워드</label>
        <input
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="검색할 키워드를 입력하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {/* 버튼 */}
      <div className="flex space-x-4">
        <button onClick={onSearch} className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
          <Search className="w-4 h-4 mr-2" />
          조회
        </button>
        <button onClick={onReset} className="flex items-center px-6 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors">
          <X className="w-4 h-4 mr-2" />
          초기화
        </button>
      </div>
    </div>
  );
};

export default Filtering;

const InputDate = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
    />
  </div>
);

