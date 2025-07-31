// src/pages/TaskPage.jsx
import { ChevronRight, Shield, Home, Map, BarChart3 } from 'lucide-react';
import regionNameMap from '../data/regionNameMap';

const TaskPage = ({ selectedRegion, category, data, onNavigate }) => {
    const categoryObj = data.find((cat) => cat.category === category);
    const tasks = categoryObj?.tasks || [];

    const totalCount = tasks.reduce((sum, task) => sum + task.count, 0);
    const maxCount = Math.max(...tasks.map(t => t.count), 0);
    const avgCount = tasks.length > 0 ? Math.round(totalCount / tasks.length) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
        {/* 네비게이션 */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                <span className="ml-2 text-xl font-bold text-slate-800">감사연구원</span>
                </div>
                <div className="flex space-x-6">
                <button onClick={() => onNavigate('home')} className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 mr-2" />
                    홈
                </button>
                </div>
            </div>
            </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 브레드크럼 */}
            <div className="flex items-center mb-6">
            <button
                onClick={() => onNavigate('map')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg mr-4"
            >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                돌아가기
            </button>
            <nav className="flex text-sm text-slate-500">
                <span>지역별 통계</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-slate-800 font-medium">
                {regionNameMap[selectedRegion]} - {category}
                </span>
            </nav>
            </div>

            {/* 타이틀 */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {regionNameMap[selectedRegion]} - {category}
            </h1>
            <p className="text-slate-600">해당 분야의 업무별 상세 현황입니다.</p>
            </div>

            {/* 업무 리스트 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-slate-800">업무별 현황</h2>
                <p className="text-sm text-slate-600 mt-1">
                총 {tasks.length}개의 업무가 있습니다.
                </p>
            </div>

            <div className="p-6">
                {tasks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-slate-500 text-lg mb-2">업무 데이터가 없습니다.</div>
                    <p className="text-slate-400">해당 분야에 등록된 업무가 없습니다.</p>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                                {task.task}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-slate-700">{task.count}</div>
                                <div className="text-sm text-slate-500">건</div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>

            {/* 통계 요약 */}
            {tasks.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">통계 요약</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="총 업무 수" value={tasks.length} />
                <StatCard label="총 건수" value={totalCount} />
                <StatCard label="최대 건수" value={maxCount} />
                <StatCard label="평균 건수" value={avgCount} />
                </div>
            </div>
            )}
        </div>
        </div>
    );
};

export default TaskPage;

const StatCard = ({ label, value }) => (
  <div className="text-center p-4 bg-slate-50 rounded-lg">
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);

// import regionNameMap from '../data/regionNameMap';
// import { ChevronRight, Shield, Home, Map, BarChart3 } from 'lucide-react';

// const TaskPage = ({ selectedRegion, category, data, onNavigate }) => {
//     const categoryObj = data.find((cat) => cat.category === category);
//     const tasks = categoryObj?.tasks || [];

//     return (
//         <div className="min-h-screen bg-gray-50">
//         {/* 헤더 네비게이션 */}
//         <nav className="bg-white shadow-sm border-b border-gray-200">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center h-16">
//                 <div className="flex items-center">
//                 <Shield className="w-8 h-8 text-slate-800" />
//                 <span className="ml-2 text-xl font-bold text-slate-800">감사원</span>
//                 </div>
//                 <div className="flex space-x-6">
//                 <button 
//                     onClick={() => onNavigate('home')}
//                     className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
//                 >
//                     <Home className="w-4 h-4 mr-2" />
//                     홈
//                 </button>
//                 <button 
//                     onClick={() => onNavigate('map')}
//                     className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-lg transition-colors"
//                 >
//                     <Map className="w-4 h-4 mr-2" />
//                     지역별 통계
//                 </button>
//                 </div>
//             </div>
//             </div>
//         </nav>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             {/* 브레드크럼 및 뒤로가기 */}
//             <div className="flex items-center mb-6">
//             <button 
//                 onClick={() => onNavigate('map')}
//                 className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-colors mr-4"
//             >
//                 <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
//                 돌아가기
//             </button>
//             <nav className="flex text-sm text-slate-500">
//                 <span>지역별 통계</span>
//                 <ChevronRight className="w-4 h-4 mx-2" />
//                 <span className="text-slate-800 font-medium">
//                 {regionNameMap[selectedRegion]} - {category}
//                 </span>
//             </nav>
//             </div>

//             {/* 페이지 헤더 */}
//             <div className="mb-8">
//             <h1 className="text-3xl font-bold text-slate-800 mb-2">
//                 {regionNameMap[selectedRegion]} - {category}
//             </h1>
//             <p className="text-slate-600">해당 분야의 업무별 상세 현황입니다.</p>
//             </div>

//             {/* 업무 목록 */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//             <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-semibold text-slate-800">업무별 현황</h2>
//                 <p className="text-sm text-slate-600 mt-1">
//                 총 {tasks.length}개의 업무가 있습니다.
//                 </p>
//             </div>
            
//             <div className="p-6">
//                 {tasks.length === 0 ? (
//                 <div className="text-center py-12">
//                     <div className="text-slate-500 text-lg mb-2">업무 데이터가 없습니다.</div>
//                     <p className="text-slate-400">해당 분야에 등록된 업무가 없습니다.</p>
//                 </div>
//                 ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {tasks.map((task) => (
//                     <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//                         <div className="flex items-start justify-between mb-4">
//                         <h3 className="font-semibold text-slate-800 text-lg leading-tight">
//                             {task.task}
//                         </h3>
//                         </div>
//                         <div className="flex items-center justify-between">
//                         <div className="text-right">
//                             <div className="text-2xl font-bold text-slate-700">{task.count}</div>
//                             <div className="text-sm text-slate-500">건</div>
//                         </div>
//                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
//                             <BarChart3 className="w-6 h-6 text-slate-600" />
//                         </div>
//                         </div>
//                     </div>
//                     ))}
//                 </div>
//                 )}
//             </div>
//             </div>

//             {/* 통계 요약 */}
//             {tasks.length > 0 && (
//             <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-slate-800 mb-4">통계 요약</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="text-center p-4 bg-slate-50 rounded-lg">
//                     <div className="text-2xl font-bold text-slate-800">{tasks.length}</div>
//                     <div className="text-sm text-slate-600">총 업무 수</div>
//                 </div>
//                 <div className="text-center p-4 bg-slate-50 rounded-lg">
//                     <div className="text-2xl font-bold text-slate-800">
//                     {tasks.reduce((sum, task) => sum + task.count, 0)}
//                     </div>
//                     <div className="text-sm text-slate-600">총 건수</div>
//                 </div>
//                 <div className="text-center p-4 bg-slate-50 rounded-lg">
//                     <div className="text-2xl font-bold text-slate-800">
//                     {Math.max(...tasks.map(t => t.count))}
//                     </div>
//                     <div className="text-sm text-slate-600">최대 건수</div>
//                 </div>
//                 <div className="text-center p-4 bg-slate-50 rounded-lg">
//                     <div className="text-2xl font-bold text-slate-800">
//                     {Math.round(tasks.reduce((sum, task) => sum + task.count, 0) / tasks.length)}
//                     </div>
//                     <div className="text-sm text-slate-600">평균 건수</div>
//                 </div>
//                 </div>
//             </div>
//             )}
//         </div>
//         </div>
//     );
// };

// export default TaskPage;