import { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';

const DrillDownDonutChart = ({ regionName, categoryData }) => {
  const chartRef = useRef(null);
  const selectedCategoryRef = useRef(null); // 내부 상태 대신 ref로 선택 상태 추적
  const selectedCategory = selectedCategoryRef.current;

  // ✅ labels/values 캐싱 (분야/업무)
  const categoryLabels = useMemo(() => categoryData.map(c => c.category), [categoryData]);
  const categoryValues = useMemo(() => categoryData.map(c => c.count), [categoryData]);

  const selectedTasks = useMemo(() => {
    return (
      categoryData.find((c) => c.category === selectedCategory)?.tasks || []
    );
  }, [categoryData, selectedCategory]);

  const taskLabels = selectedTasks.map((t) => t.task);
  const taskValues = selectedTasks.map((t) => t.count);

  const drawChart = () => {
    const categoryTrace = {
      type: 'pie',
      labels: categoryLabels,
      values: categoryValues,
      hole: 0.55,
      sort: false,
      direction: 'clockwise',
      textinfo: 'label+percent',
      name: '분야',
      textposition: 'inside',
      textfont: { size: 14, color: '#fff' },
      marker: {
        line: { width: 2, color: '#ffffff' },
        colors: [
          '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
          '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280',
        ],
      },
      pull: categoryLabels.map((label) => (label === selectedCategory ? 0.1 : 0)),
      domain: selectedCategory
        ? { x: [0.15, 0.85], y: [0.15, 0.85] }
        : { x: [0.1, 0.9], y: [0.1, 0.9] },
    };

    const taskTrace =
      selectedCategory && selectedTasks.length > 0
        ? {
            type: 'pie',
            labels: taskLabels,
            values: taskValues,
            hole: 0.75,
            sort: false,
            textinfo: 'label+percent',
            textfont: { size: 12, color: '#fff' },
            marker: {
              line: { width: 2, color: '#ffffff' },
              colors: [
                '#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6',
                '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
              ],
            },
            name: '업무',
            domain: { x: [0.1, 0.9], y: [0.1, 0.9] },
          }
        : null;

    const layout = {
      title: {
        text: `${regionName} 감사 현황`,
        x: 0.5,
        font: { size: 20 },
      },
      showlegend: false,
      margin: { t: 80, b: 40, l: 40, r: 40 },
      paper_bgcolor: '#ffffff',
      annotations: [
        {
          text: selectedCategory
            ? `<b>${selectedCategory}</b><br><span style="font-size:12px;color:#6b7280">업무별 현황 보기</span>`
            : `<b style="font-size:18px">분야별 감사 현황</b><br><span style="font-size:12px;color:#6b7280">분야를 클릭하세요</span>`,
          showarrow: false,
          x: 0.5,
          y: 0.5,
          xanchor: 'center',
          yanchor: 'middle',
          align: 'center',
        },
      ],
    };

    const traces = taskTrace ? [taskTrace, categoryTrace] : [categoryTrace];

    Plotly.newPlot(chartRef.current, traces, layout, {
      responsive: true,
      displayModeBar: false,
    });
  };

  // ✅ 첫 렌더링 또는 데이터 변경 시 chart 그리기
  useEffect(() => {
    if (categoryData.length > 0) {
      drawChart();
    }
  }, [categoryData, selectedCategory]);

  // ✅ 클릭 이벤트 한 번만 등록
  useEffect(() => {
    const chartEl = chartRef.current;
    const onClick = (e) => {
      const { curveNumber, label } = e.points[0];
      const isOuter = curveNumber === 1; // 업무 trace가 0, 분야 trace가 1

      if (isOuter || !label) return;

      selectedCategoryRef.current =
        label === selectedCategoryRef.current ? null : label;

      drawChart(); // 갱신
    };

    if (chartEl) chartEl.on('plotly_click', onClick);

    return () => {
      if (chartEl) chartEl.removeListener('plotly_click', onClick);
    };
  }, [categoryData]);

  // ✅ 창 크기 대응
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) Plotly.Plots.resize(chartRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default DrillDownDonutChart;
