const HomePage = ({ onNavigate }) => {
  return (
    <div>
      <div>
        <div>감사원</div>
        <p>국가 감사 현황 및 지역별 통계 관리 시스템</p>
      </div>
      <div>
        <div onClick={() => onNavigate('main')}>
          <h2>감사현황</h2>
          <p>자체 감사 현황, 분석 및 상세 내용 확인</p>
        </div>
        <div onClick={() => onNavigate('map')}>
          <h2>지역별 통계</h2>
          <p>지역별 감사 현황 및 통계 분석</p>
        </div>
      </div>
      <div>
        <p>© 대한민국 감사원. 모든 권리 보유.</p>
      </div>
    </div>
  );
};

export default HomePage;