import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './app.css';
import HomePage from './component/HomePage';
import MainPage from './component/MainPage';
import MapPage from './component/MapPage';
import DataTableDetails from './component/DataTableDetails';
import TaskPage from './component/TaskPage';

export default function App(){
  //const [currentPage, setCurrentPage] = useState('home');
  const [prevPage, setPrevPage] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [categoryData, setCategoryData] = useState([]); // 전체 카테고리 + 업무 포함
  const [selectedCategory, setSelectedCategory] = useState(null);
  //const [selectedData, setSelectedData] = useState(null); // 상세보기용 데이터

  const [mainPageState, setMainPageState] = useState({
    filters: {
      state: '',
      agency: '',
      type: '',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      category: '',
      task: '',
      specialCase: false,
      keyword: '',
    },
    data: [],
    selectedStateId: '',
  });

  //라우팅
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path="/main" element={<MainPage
              state={mainPageState}
              setState={setMainPageState}
            />}
          />
          <Route path='/map' element={<MapPage
              selected={selectedRegion}
              setSelected={setSelectedRegion}
              setCategoryData={setCategoryData}
              categoryData={categoryData}
            />}
          />
          <Route path='/task' element={<TaskPage
              selectedRegion={selectedRegion}
              category={selectedCategory}
              data={categoryData}
            />}
          />
          <Route path='/details' element={<DataTableDetails />} />
        </Routes>
      </div>
    </Router>
  );
};