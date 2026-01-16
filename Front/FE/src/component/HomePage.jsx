// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import {
  UserCheck, Landmark, ClipboardList, ShieldCheck,
  SearchCheck, MapPinned, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const requestUrl = `${import.meta.env.VITE_API_BASE_URL}/api/metadata`;
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

  if (!stats) return <div></div>;

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
            <StatCard
              icon={<ShieldCheck className="w-10 h-10 text-slate-700" />}
              value={typeof stats.inspection_agency_count === 'number'
                ? stats.inspection_agency_count.toLocaleString()
                : '0'}
              title="감사실시기관"
            />
            <StatCard
              icon={<Landmark className="w-10 h-10 text-slate-700" />}
              value={typeof stats.related_agency_count === 'number'
                ? stats.related_agency_count.toLocaleString()
                : '0'}
              title="감사대상기관"
            />
            <StatCard
              icon={<ClipboardList className="w-10 h-10 text-slate-700" />}
              value={typeof stats.audit_note_count === 'number'
                ? stats.audit_note_count.toLocaleString()
                : '0'}
              title="감사사항"
            />
            <StatCard
              icon={<UserCheck className="w-10 h-10 text-slate-700" />}
              value={typeof stats.case_uuid_count === 'number'
                ? stats.case_uuid_count.toLocaleString()
                : '0'}
              title="자체감사결과"
              desc="공개문 기준"
            />
          </div>

          {/* 네비게이션 카드 */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <NavCard
              icon={<SearchCheck className="w-8 h-8 text-white" />}
              title="감사결과 조회"
              desc="감사결과의 분류, 요약, 상세분석"
              onClick={() => navigate('/main')}
            />
            <NavCard
              icon={<MapPinned className="w-8 h-8 text-white" />}
              title="지역별 통계"
              desc="지역별, 분야/업무별 감사결과 분석"
              onClick={() => navigate('/map')}
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

//
// ✅ 내부 정의된 컴포넌트
//

const StatCard = ({ icon, value, title, desc }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-3xl font-bold text-slate-800">{value}</span>
    </div>
    <p className="text-sm text-slate-600 font-semibold">{title}</p>
    {desc && <p className="text-xs text-slate-500 mt-1">{desc}</p>}
  </div>
);

const NavCard = ({ icon, title, desc, onClick }) => (
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