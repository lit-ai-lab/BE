import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import zone from '../data/state_agency.json';
import SelectBox from './SelectBox';


const Filtering = ({
  filters, setFilters,
  onSearch, onReset,
  catTasks, inspectionTypes
}) => {
  const [extraKeywords, setExtraKeywords] = useState([]);
  const [extraKeywordsType, setExtraKeywordsType] = useState(null); // ✅ AND/OR 타입 추적

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      ...(name === 'category' ? { task: '' } : {}),
    });
  };

  const addKeywordField = (type) => {
    // ✅ AND/OR 혼용 방지
    if (extraKeywordsType && extraKeywordsType !== type) return;
    setExtraKeywords([...extraKeywords, { type, value: '' }]);
    setExtraKeywordsType(type);
  };

  const handleExtraKeywordChange = (index, newValue) => {
    const updated = [...extraKeywords];
    updated[index].value = newValue;
    setExtraKeywords(updated);
  };

  const handleRemoveExtraKeyword = (index) => {
    const updated = [...extraKeywords];
    updated.splice(index, 1);
    setExtraKeywords(updated);

    if (updated.length === 0) setExtraKeywordsType(null); // ✅ 모두 지우면 타입 초기화
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

        <SelectBox
          label="감사 종류"
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={sortedInspectionTypes}
          optionKey="name"
          optionLabel="name"
        />

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
          ].filter((item, index, self) =>
            index === self.findIndex((t) => t.key === item.key)
          )}
          optionKey="key"
          optionLabel="label"
        />
      </div>

      {/* 3. 키워드 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">키워드</label>
        <div className="flex gap-2 mb-2">
          <input
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="검색할 키워드를 입력하세요"
            className="flex-[2] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
          />
          <button
            type="button"
            className={`px-2 py-1 rounded text-sm ${
              extraKeywordsType === 'OR' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-slate-200 hover:bg-slate-300'
            }`}
            onClick={() => addKeywordField('AND')}
            disabled={extraKeywordsType === 'OR'}
          >
            AND 추가
          </button>
          <button
            type="button"
            className={`px-2 py-1 rounded text-sm ${
              extraKeywordsType === 'AND' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-slate-200 hover:bg-slate-300'
            }`}
            onClick={() => addKeywordField('OR')}
            disabled={extraKeywordsType === 'AND'}
          >
            OR 추가
          </button>
        </div>

        {extraKeywords.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center mt-2">
            <span className="text-xs font-medium text-slate-600 w-[40px]">{item.type}</span>
            <input
              type="text"
              value={item.value}
              onChange={(e) => handleExtraKeywordChange(idx, e.target.value)}
              placeholder={`추가 ${item.type} 키워드`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
            />
            <button
              type="button"
              className="px-6 py-2 bg-red-100 text-black-700 border border-red-300 rounded-md hover:bg-red-200 text-sm"
              onClick={() => handleRemoveExtraKeyword(idx)}
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <div className="flex space-x-4">
        <button
          onClick={() => {
            const keywordExtras = extraKeywords
              .map((kw) => kw.value.trim())
              .filter(Boolean); // ✅ 빈 값 제거

            onSearch({
              ...filters,
              keywordMode: extraKeywordsType,
              keywordExtras,
            });
          }}
          className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Search className="w-4 h-4 mr-2" />
          조회
        </button>

        <button
          onClick={() => {
            onReset();
            setExtraKeywords([]);
            setExtraKeywordsType(null); // ✅ 초기화 시 타입도 초기화
          }}
          className="flex items-center px-6 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
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
