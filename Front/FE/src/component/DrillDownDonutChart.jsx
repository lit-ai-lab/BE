import { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

const DrillDownDonutChart = ({ regionName, categoryData }) => {
  const chartRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const parsedCategoryData = categoryData.map((cat) => ({
      ...cat,
      category: cat.category?.trim() === '' ? '전국' : cat.category
    }));

  const selectedTasks =
    parsedCategoryData.find((c) => c.category === selectedCategory)?.tasks || [];


    // 🟡 Plotly 차트 렌더링
    useEffect(() => {
      if (!chartRef.current || !categoryData || categoryData.length === 0){
        console.warn("렌더링 조건 실패:", categoryData);
        return;
      }
      console.log("✔ 도넛 차트 렌더링 시작:", categoryData);

      const categoryTrace = {
        type: 'pie',
        labels: parsedCategoryData.map((cat) => cat.category),
        values: parsedCategoryData.map((cat) => cat.count),
        hole: 0.55,
        direction: 'clockwise',
        sort: false,
        textinfo: 'label+percent',
        textposition: 'inside',
        textfont:{
          size: 15,
          color: '#fff',
          family: 'Arial, sans-serif'
        },
        name: '분야',
        pull: categoryData.map((cat) =>
          cat.category === selectedCategory ? 0.1 : 0
        ),
        marker: {
          line: { width: 2, color: '#ffffff' },
          colors: [
            '#4c78a8', // muted blue
            '#f58518', // soft orange
            '#e45756', // coral red
            '#72b7b2', // teal green
            '#54a24b', // soft green
            '#eeca3b', // warm yellow
            '#b279a2', // muted purple
            '#ff9da7', // pinkish
            '#9d755d', // earthy brown
            '#bab0ab'  // grayish beige
          ]
        },
        hovertemplate: '<b>%{label}</b><br>건수: %{value}건<br>비율: %{percent}<extra></extra>',
        domain: selectedCategory ? { x: [0.15, 0.85], y: [0.15, 0.85] } : { x: [0.1, 0.9], y: [0.1, 0.9] }
      };

      const taskTrace = selectedCategory && selectedTasks.length > 0
        ? {
            type: 'pie',
            labels: selectedTasks.map(t => t.task),
            values: selectedTasks.map(t => t.count),
            hole: 0.75,
            direction: 'clockwise',
            sort: false,
            textinfo: 'none',
            textposition: 'auto',
            textfont:{
              size: 14,
              color: '#fff',
              family: 'Arial, sans-serif'
            },
            name: '업무',
            marker: {
              line: { width: 2, color: '#ffffff' },
              colors: [
                '#c3b6e5', // 연보라
                '#a79ddf', // 라벤더
                '#8c87d9', // 진한 라벤더
                '#6f9de6', // 연파랑-보라 중간
                '#4faded', // 밝은 하늘색
                '#3898ec', // 선명한 블루
                '#1e6ddb', // 강한 블루
                '#153eaa'  // 진한 남색
              ]

            },
            hovertemplate: '<b>%{label}</b><br>건수: %{value}건<br>비율: %{percent}<extra></extra>',
            domain: { x: [0.1, 0.9], y: [0.1, 0.9] }
          }

        : null;

      const layout = {
        title: {
          text: `${regionName === null || regionName === '' ? '전국' : regionName} 분야별 감사 현황`,
          x: 0.5,
          font: { size: 20, family: 'Arial, sans-serif', color: '#1f2937' }
        },
        showlegend: false,
        margin: { t: 80, b: 80, l: 80, r: 80 },
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff',
        annotations: [
          {
            text: selectedCategory 
              ? `<b style="font-size:16px">${selectedCategory}</b><br><span style="font-size:12px;color:#6b7280">클릭하여 업무별 보기</span>` 
              : `<b style="font-size:18px">${regionName || '전국'}</b><br><b style="font-size:18px">감사 현황</b><br><span style="font-size:12px;color:#6b7280">분야를 클릭하세요</span>`,
            font: { size: 14, color: '#374151' },
            showarrow: false,
            x: 0.5,
            y: 0.5,
            xanchor: 'center',
            yanchor: 'middle',
            align: 'center'
          }
        ]
      };

      const traces = taskTrace ? [taskTrace, categoryTrace] : [categoryTrace];

      Plotly.newPlot(chartRef.current, traces, layout, {
        responsive: true,
        displayModeBar: false
      });

      
      chartRef.current.on('plotly_click', (e) => {
        const label = e.points[0].label;
        const curveNumber = e.points[0].curveNumber;
        const categoryTraceIndex = taskTrace ? 1 : 0;

        if (curveNumber === categoryTraceIndex) {
          setSelectedCategory(label === selectedCategory ? null : label);
        }
      });
    }, [parsedCategoryData, selectedCategory, regionName]);

    useEffect(() => {
      const handleResize = () => {
        if (chartRef.current) {
          Plotly.Plots.resize(chartRef.current);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{regionName === null || regionName === '' ? '전국' : regionName} 감사 현황</h2>
        <div className="w-20 h-1 bg-slate-800 rounded-full"></div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
            <p className="text-slate-600 font-medium">데이터를 불러오는 중...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <div ref={chartRef} className="w-full mx-auto" style={{ height: '500px' }} />
          </div>

          {selectedCategory && (
            <div className="flex justify-center">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                전체 분야로 돌아가기
              </button>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {selectedCategory ? `${selectedCategory} 업무별 현황` : '분야별 현황'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(selectedCategory ? selectedTasks : categoryData).map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded mr-3 flex-shrink-0"
                    style={{
                      backgroundColor: selectedCategory 
                        ? ['#dbeafe', '#bfdbfe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5'][index % 6]
                        : [
                            '#4c78a8', // muted blue
                            '#f58518', // soft orange
                            '#e45756', // coral red
                            '#72b7b2', // teal green
                            '#54a24b', // soft green
                            '#eeca3b', // warm yellow
                            '#b279a2', // muted purple
                            '#ff9da7', // soft pink
                            '#9d755d', // earthy brown
                            '#bab0ab'  // grayish beige
                          ]
                    }}
                  ></div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-700 text-sm truncate">
                      {selectedCategory ? item.task : item.category}
                    </div>
                    <div className="text-slate-500 text-xs">{item.count}건</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrillDownDonutChart;