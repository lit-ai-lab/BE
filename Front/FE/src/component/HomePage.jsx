// src/pages/HomePage.jsx
import { UserCheck, Landmark, ClipboardList, ShieldCheck, Map, ChevronRight, Eye, SearchCheck, MapPinned } from 'lucide-react';
import { useState, useEffect } from 'react';

const HomePage = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const requestUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
        console.log("📡 통계 데이터 요청:", requestUrl);

        const res = await fetch(requestUrl);
        if (!res.ok) throw new Error('데이터 불러오기 실패');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('📛 통계 데이터 요청 오류:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* 상단 헤더 - Fixed */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold text-slate-800">감사연구원</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 - 상단 패딩 추가 */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-20">
        <div className="max-w-6xl w-full">
          {/* 타이틀 */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-800 mb-6 tracking-tight">
              자체감사 결과분석 시스템
            </h1>
            <p className="text-xl text-slate-600 font-medium mb-2">
              2024 지방자치단체 자체감사사례에 관한 분류·요약·통계정보를 제공합니다
            </p>
            <div className="w-32 h-1 bg-slate-800 mx-auto mt-8 rounded-full"></div>
          </div>

          {/* 통계 카드 */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <StatCard icon={<ShieldCheck className="w-10 h-10 text-slate-700" />} value={stats.inspection_agency_count.toLocaleString()} title="감사실시기관" />
            <StatCard icon={<Landmark className="w-10 h-10 text-slate-700" />} value={stats.related_agency_count.toLocaleString()} title="감사대상기관" />
            <StatCard icon={<ClipboardList className="w-10 h-10 text-slate-700" />} value={stats.audit_note_count.toLocaleString()} title="감사사항" />
            <StatCard icon={<UserCheck className="w-10 h-10 text-slate-700" />} value={stats.case_uuid_count.toLocaleString()} title="자체감사결과" desc="공개문 기준" />
          </div>

          {/* 네비게이션 카드 */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <NavCard
              icon={<SearchCheck className="w-8 h-8 text-white" />}
              title="감사결과 조회"
              desc="감사결과의 분류, 요약, 상세분석"
              onClick={() => onNavigate('main')}
            />
            <NavCard
              icon={<MapPinned className="w-8 h-8 text-white" />}
              title="지역별 통계"
              desc="지역별, 분야/업무별 감사결과 분석"
              onClick={() => onNavigate('map')}
            />
          </div>

          {/* 하단 정보 */}
          <div className="text-center text-slate-500 border-t border-gray-200 pt-8">
            <p className="text-sm mb-2">© 2024 대한민국 감사원. All Rights Reserved.</p>
            <p className="text-xs">서울특별시 종로구 북촌로 112 (삼청동) | 대표전화: 02-2011-9114</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// ✅ 하위 UI 컴포넌트
const StatCard = ({ icon, value, title, desc }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-3xl font-bold text-slate-800">{value}</span>
    </div>
    <p className="text-sm text-slate-600 font-semibold">{title}</p>
    <p className="text-xs text-slate-500 mt-1">{desc}</p>
  </div>
);

const NavCard = ({ icon, title, desc, badge, onClick }) => (
  <div
    className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-12 transition-all duration-300 cursor-pointer group border border-gray-200"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-8">
      <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
        {icon}
      </div>
      <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
    </div>
    <h2 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-slate-700 transition-colors">
      {title}
    </h2>
    <p className="text-slate-600 text-lg leading-relaxed mb-6">{desc}</p>
  </div>
);

// import { Shield, FileText, Building, TrendingUp, Clock, Map, ChevronRight } from 'lucide-react';

// const HomePage = ({ onNavigate }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
//       {/* 헤더 네비게이션 */}
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Shield className="w-8 h-8 text-slate-800" />
//               <span className="ml-2 text-xl font-bold text-slate-800">감사원</span>
//             </div>
//             <div className="flex space-x-4 text-sm text-gray-600">
//               <span>대한민국 감사원</span>
//               <span>|</span>
//               <span>Board of Audit and Inspection</span>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
//         <div className="max-w-6xl w-full">
//           {/* 헤더 섹션 */}
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800 rounded-xl mb-8">
//               <Shield className="w-12 h-12 text-white" />
//             </div>
//             <h1 className="text-5xl font-bold text-slate-800 mb-6 tracking-tight">
//               국가감사 통합관리시스템
//             </h1>
//             <p className="text-xl text-slate-600 font-medium mb-2">
//               Republic of Korea Board of Audit and Inspection
//             </p>
//             <p className="text-lg text-slate-500">
//               감사 현황 및 통계 분석 시스템
//             </p>
//             <div className="w-32 h-1 bg-slate-800 mx-auto mt-8 rounded-full"></div>
//           </div>
          
//           {/* 통계 카드 */}
//           <div className="grid md:grid-cols-4 gap-6 mb-16">
//             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between mb-4">
//                 <FileText className="w-10 h-10 text-slate-700" />
//                 <span className="text-3xl font-bold text-slate-800">1,247</span>
//               </div>
//               <p className="text-sm text-slate-600 font-semibold">총 감사 건수</p>
//               <p className="text-xs text-slate-500 mt-1">전년 대비 12% 증가</p>
//             </div>
//             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between mb-4">
//                 <Building className="w-10 h-10 text-slate-700" />
//                 <span className="text-3xl font-bold text-slate-800">156</span>
//               </div>
//               <p className="text-sm text-slate-600 font-semibold">감사 기관</p>
//               <p className="text-xs text-slate-500 mt-1">중앙부처 및 지자체</p>
//             </div>
//             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between mb-4">
//                 <TrendingUp className="w-10 h-10 text-slate-700" />
//                 <span className="text-3xl font-bold text-slate-800">89%</span>
//               </div>
//               <p className="text-sm text-slate-600 font-semibold">완료율</p>
//               <p className="text-xs text-slate-500 mt-1">목표 대비 달성률</p>
//             </div>
//             <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between mb-4">
//                 <Clock className="w-10 h-10 text-slate-700" />
//                 <span className="text-3xl font-bold text-slate-800">24</span>
//               </div>
//               <p className="text-sm text-slate-600 font-semibold">진행 중</p>
//               <p className="text-xs text-slate-500 mt-1">현재 진행 중인 감사</p>
//             </div>
//           </div>
          
//           {/* 메인 네비게이션 카드 */}
//           <div className="grid md:grid-cols-2 gap-8 mb-16">
//             <div 
//               className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-12 transition-all duration-300 cursor-pointer group border border-gray-200"
//               onClick={() => onNavigate('main')}
//             >
//               <div className="flex items-center justify-between mb-8">
//                 <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
//                   <FileText className="w-8 h-8 text-white" />
//                 </div>
//                 <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
//               </div>
//               <h2 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-slate-700 transition-colors">
//                 감사현황 조회
//               </h2>
//               <p className="text-slate-600 text-lg leading-relaxed mb-6">
//                 감사 데이터 검색, 조회 및 상세 분석
//               </p>
//               <div className="flex items-center text-sm text-slate-500">
//                 <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                 최근 업데이트: 2시간 전
//               </div>
//             </div>

//             <div 
//               className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-12 transition-all duration-300 cursor-pointer group border border-gray-200"
//               onClick={() => onNavigate('map')}
//             >
//               <div className="flex items-center justify-between mb-8">
//                 <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-700 transition-colors">
//                   <Map className="w-8 h-8 text-white" />
//                 </div>
//                 <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
//               </div>
//               <h2 className="text-3xl font-bold text-slate-800 mb-4 group-hover:text-slate-700 transition-colors">
//                 지역별 통계
//               </h2>
//               <p className="text-slate-600 text-lg leading-relaxed mb-6">
//                 지역별 감사 현황 및 통계 분석
//               </p>
//               <div className="flex items-center text-sm text-slate-500">
//                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                 17개 시도 데이터 연동
//               </div>
//             </div>
//           </div>

//           {/* 하단 정보 */}
//           <div className="text-center text-slate-500 border-t border-gray-200 pt-8">
//             <p className="text-sm mb-2">© 2024 대한민국 감사원. All Rights Reserved.</p>
//             <p className="text-xs">서울특별시 종로구 북촌로 112 (삼청동) | 대표전화: 02-2011-9114</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;