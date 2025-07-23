// 📄 src/context/FilterContext.jsx
import { createContext, useState, useContext } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    state: '',
    agency: '',
    type: '',
    startDate: '',
    endDate: '',
    category: '',
    task: '',
    specialCase: '',
    keyword: '',
  });

  const value = { filters, setFilters };
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

// ✅ 커스텀 훅
export const useFilter = () => useContext(FilterContext);
