import { useState, useMemo } from 'react';
import { Filter, Search, X } from 'lucide-react';
import zone from '../data/state_agency.json';

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

const onStateChange = (e) => {
    const stateId = e.target.value;
    setFilters({
        ...filters,
        state: stateId,
        agency: '',
    });
};

const stateList = useMemo(() => {
    const map = new Map();
    zone.forEach(({ stateId, stateName }) => {
        if (!map.has(stateId)) map.set(stateId, stateName);
    });
    return Array.from(map, ([stateId, stateName]) => ({ stateId, stateName }));
}, []);

const filteredAgencies = filters.state
    ? zone.filter((z) => String(z.stateName) === String(filters.state))
    : [];

// const taskList = filters.category
//     ? [...(catTasks[filters.category] || [])].sort()
//     : [];

const sortedInspectionTypes = [...inspectionTypes].sort((a, b) =>
    a.name.localeCompare(b.name)
);

return (
    <div className="p-6">
      {/* 첫 번째 줄: 감사기간 시작/종료 + 감사실시기관 + 감사종류 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* 감사실시기관 - 권역 + 기관 */}
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">감사실시기관</label>
            <div className="grid grid-cols-2 gap-2">
                <select
                name="state"
                value={filters.state}
                onChange={onStateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                >
                <option value="">권역</option>
                {stateList.map(({ stateId, stateName }) => (
                    <option key={stateId} value={stateName}>{stateName}</option>
                ))}
                </select>

                <select
                name="agency"
                value={filters.agency}
                onChange={handleChange}
                disabled={!filters.state}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100"
                >
                <option value="">실시기관</option>
                {filteredAgencies.map((z) => (
                    <option key={z.agencyId} value={z.agencyName}>
                    {z.agencyName}
                    </option>
                ))}
                </select>
            </div>
        </div>
        
        <SelectBox label="감사 종류" name="type" value={filters.type} onChange={handleChange} options={sortedInspectionTypes} optionKey="name" optionLabel="name" />

        <InputDate label="감사기간 (시작)" name="startDate" value={filters.startDate} onChange={handleChange} />
        <InputDate label="감사기간 (종료)" name="endDate" value={filters.endDate} onChange={handleChange} />
    </div>

    {/* 두 번째 줄: 분야, 업무, 특이사례 */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SelectBox label="분야" name="category" value={filters.category} onChange={handleChange} options={catTasks.map((item) => ({ value: item.category, label: item.category}))} optionKey="value" optionLabel="label" />
        <SelectBox 
            label="업무" 
            name="task" 
            value={filters.task} 
            onChange={handleChange} 
            options={
                // 선택된 category_id에 해당하는 task 배열 찾기
                (catTasks.find((item) => item.category === filters.category)?.task || [])
                .map((t) => ({
                    value: t.task,  // 실제 value
                    label: t.task      // 표시될 라벨
                }))
            } 
            optionKey="value" 
            optionLabel="label" 
            disabled={!filters.category} 
        />
        <SelectBox label="특이사례" name="specialCase" value={filters.specialCase} onChange={handleChange} options={[
            { key: 'false', label: '미해당' },
            { key: 'true', label: '해당' }
        ]} optionKey="key" optionLabel="label" />
    </div>

    {/* 세 번째 줄: 키워드 검색창 */}
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

// 날짜 입력 서브 컴포넌트
const InputDate = ({ label, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <input type="date" name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
    </div>
);

// 셀렉트 박스 공통
const SelectBox = ({ label, name, value, onChange, options, optionKey, optionLabel, disabled = false }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <select name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100">
        <option value="">전체</option>
        {options.map((opt, idx) => (
            <option key={idx} value={opt[optionKey]}>{opt[optionLabel]}</option>
        ))}
        </select>
    </div>
);

// import { useState, useMemo } from 'react';
// import { Filter, Search, X } from 'lucide-react';
// import zone from '../data/state_agency.json';

// const Filtering = ({
//     filters, setFilters,
//     onSearch, onReset,
//     onStateChange, agencyOptions,
//     selectedStateId, catTasks, inspectionTypes
//     }) => {
//     const [isFilterOpen, setIsFilterOpen] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({
//         ...filters,
//         [name]: value,
//         ...(name === 'category' ? { task: '' } : {}),
//         });
//     };

//     const stateList = useMemo(() => {
//         return zone.reduce((acc, cur) => {
//         if (!acc.find((s) => s.stateId === cur.stateId)) {
//             acc.push({ stateId: cur.stateId, stateName: cur.stateName });
//         }
//         return acc;
//         }, []);
//     }, []);

//     const taskList = filters.category ? [...(catTasks[filters.category] || [])].sort() : [];

//     return (
//         <div className="p-6">
//         {/* 기본 필터 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             <InputDate label="감사기간 (시작)" name="startDate" value={filters.startDate} onChange={handleChange} />
//             <InputDate label="감사기간 (종료)" name="endDate" value={filters.endDate} onChange={handleChange} />
//             <SelectBox label="광역자치단체" value={selectedStateId} onChange={onStateChange} options={stateList} optionKey="stateId" optionLabel="stateName" />
//             <SelectBox label="감사실시기관" name="agency" value={filters.agency} onChange={handleChange} options={agencyOptions} optionKey="agencyName" optionLabel="agencyName" disabled={!filters.state} />
//         </div>

//         {/* 추가 필터 토글 */}
//         <div className="mb-6">
//             <button onClick={() => setIsFilterOpen((p) => !p)} className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors">
//             <Filter className="w-4 h-4 mr-2" />
//             {isFilterOpen ? '추가 필터 닫기' : '추가 필터 열기'}
//             </button>
//         </div>

//         {/* 추가 필터 */}
//         {isFilterOpen && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
//             <SelectBox label="감사 종류" name="type" value={filters.type} onChange={handleChange} options={inspectionTypes} optionKey="name" optionLabel="name" />
//             <SelectBox label="분야" name="category" value={filters.category} onChange={handleChange} options={Object.keys(catTasks).map((key) => ({ key }))} optionKey="key" optionLabel="key" />
//             <SelectBox label="업무" name="task" value={filters.task} onChange={handleChange} options={taskList.map((t) => ({ task: t }))} optionKey="task" optionLabel="task" disabled={!filters.category} />
//             <SelectBox label="특이사례" name="specialCase" value={filters.specialCase} onChange={handleChange} options={[
//                 { key: '', label: '전체' },
//                 { key: 'false', label: '미해당' },
//                 { key: 'true', label: '해당' }
//             ]} optionKey="key" optionLabel="label" />
//             <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">키워드</label>
//                 <input name="keyword" value={filters.keyword} onChange={handleChange} placeholder="검색할 키워드를 입력하세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
//             </div>
//             </div>
//         )}

//         {/* 버튼 */}
//         <div className="flex space-x-4">
//             <button onClick={onSearch} className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
//             <Search className="w-4 h-4 mr-2" />
//             조회
//             </button>
//             <button onClick={onReset} className="flex items-center px-6 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors">
//             <X className="w-4 h-4 mr-2" />
//             초기화
//             </button>
//         </div>
//     </div>
//     );
// };

// export default Filtering;

// // ✅ 재사용 가능한 서브 컴포넌트
// const InputDate = ({ label, name, value, onChange }) => (
//     <div>
//         <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
//         <input type="date" name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500" />
//     </div>
// );

// const SelectBox = ({ label, name, value, onChange, options, optionKey, optionLabel, disabled = false }) => (
//     <div>
//         <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
//         <select name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:text-gray-500">
//         <option value="">전체</option>
//         {options.map((opt, idx) => (
//             <option key={idx} value={opt[optionKey]}>{opt[optionLabel]}</option>
//         ))}
//         </select>
//     </div>
// );

// const Filtering = ({
//     filters, setFilters,
//     onSearch, onReset,
//     onStateChange, agencyOptions,
//     selectedStateId, catTasks, inspectionTypes
//     }) => {
//     const [isFilterOpen, setIsFilterOpen] = useState(false);

//     const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFilters({
//         ...filters,
//         [name]: value,
//         ...(name === 'category' ? { task: '' } : {}),
//         //specialCase: e.target.value
//     });
//     };

//     const stateList = useMemo(() => {
//         return zone.reduce((acc, cur) => {
//         if (!acc.find((s) => s.stateId === cur.stateId)) {
//             acc.push({ stateId: cur.stateId, stateName: cur.stateName });
//         }
//         return acc;
//         }, []);
//     }, []);

//     const taskList = filters.category ? catTasks[filters.category] || [] : [];

//     return (
//         <div className="p-6">
//         {/* 기본 필터 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">검사일 (시작)</label>
//             <input 
//                 type="date" 
//                 name="startDate" 
//                 value={filters.startDate} 
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//             />
//             </div>
//             <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">검사일 (종료)</label>
//             <input 
//                 type="date" 
//                 name="endDate" 
//                 value={filters.endDate} 
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//             />
//             </div>
//             <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">광역자치단체</label>
//             <select 
//                 value={selectedStateId} 
//                 onChange={onStateChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//             >
//                 <option value="">전체</option>
//                 {stateList.map((state) => (
//                 <option key={state.stateId} value={state.stateId}>{state.stateName}</option>
//                 ))}
//             </select>
//             </div>
//             <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">감사실시기관</label>
//             <select 
//                 name="agency" 
//                 value={filters.agency} 
//                 onChange={handleChange} 
//                 disabled={!filters.state}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 disabled:bg-gray-100 disabled:text-gray-500"
//             >
//                 <option value="">전체</option>
//                 {agencyOptions.map((agency) => (
//                 <option key={agency.agencyId} value={agency.agencyName}>{agency.agencyName}</option>
//                 ))}
//             </select>
//             </div>
//         </div>

//         {/* 추가 필터 토글 */}
//         <div className="mb-6">
//             <button 
//             onClick={() => setIsFilterOpen((p) => !p)}
//             className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
//             >
//             <Filter className="w-4 h-4 mr-2" />
//             {isFilterOpen ? '추가 필터 닫기' : '추가 필터 열기'}
//             </button>
//         </div>

//         {/* 추가 필터 */}
//         {isFilterOpen && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
//             <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">감사 종류</label>
//                 <select 
//                 name="type" 
//                 value={filters.type} 
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//                 >
//                 <option value="">전체</option>
//                 {inspectionTypes.map((t) => (
//                     <option key={t.id} value={t.name}>{t.name}</option>
//                 ))}
//                 </select>
//             </div>

//             <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">분야</label>
//                 <select 
//                 name="category" 
//                 value={filters.category} 
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//                 >
//                 <option value="">전체</option>
//                 {Object.keys(catTasks).map((cat) => (
//                     <option key={cat} value={cat}>{cat}</option>
//                 ))}
//                 </select>
//             </div>

//             <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">업무</label>
//                 <select 
//                 name="task" 
//                 value={filters.task} 
//                 onChange={handleChange} 
//                 disabled={!filters.category}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 disabled:bg-gray-100 disabled:text-gray-500"
//                 >
//                 <option value="">전체</option>
//                 {taskList.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
//                 </select>
//             </div>

//             <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">특이사례</label>
//                 <select
//                 name="specialCase"
//                 value={filters.specialCase}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//                 >
//                 <option value="">전체</option>
//                 <option value="false">미포함</option>
//                 <option value="true">포함</option>
//                 </select>
//             </div>

//             <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">키워드</label>
//                 <input 
//                 name="keyword" 
//                 value={filters.keyword} 
//                 onChange={handleChange}
//                 placeholder="검색할 키워드를 입력하세요"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
//                 />
//             </div>
//             </div>
//         )}

//         {/* 버튼 영역 */}
//         <div className="flex space-x-4">
//             <button 
//             onClick={onSearch}
//             className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
//             >
//                 <Search className="w-4 h-4 mr-2" />
//                 조회
//             </button>
//             <button 
//             onClick={onReset}
//             className="flex items-center px-6 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//                 <X className="w-4 h-4 mr-2" />
//                 초기화
//             </button>
//         </div>
//     </div>
//     );
// };

