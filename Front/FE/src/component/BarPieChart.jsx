import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const BarPieChart = ({ regionName, categoryData }) => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [excludedTasks, setExcludedTasks] = useState(new Set());

  const colorPalette = [
    '#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE',
    '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#D9A6A1'
  ];

  const selectedCategoryObj = categoryData.find(
    (c) => c.category === selectedCategory
  );

  const allTasks = selectedCategoryObj
    ? [...selectedCategoryObj.tasks].sort((a, b) => b.count - a.count)
    : [];

  const visibleTasks = allTasks.filter((t) => !excludedTasks.has(t.task));

  // ✅ 고정 색상 매핑 (task → color)
  const colorMap = allTasks.reduce((map, task, index) => {
    map[task.task] = colorPalette[index % colorPalette.length];
    return map;
  }, {});

  // ✅ 업무 토글 함수 (공통)
  const handleTaskToggle = (taskName) => {
    const newSet = new Set(excludedTasks);
    if (newSet.has(taskName)) {
      newSet.delete(taskName);
    } else {
      newSet.add(taskName);
    }
    setExcludedTasks(newSet);
  };

  // 막대그래프
  useEffect(() => {
    if (!barChartRef.current || categoryData.length === 0) return;
    const chart = echarts.init(barChartRef.current);

    const option = {
      title: { text: `${regionName} 분야별 감사 건수`, left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'category',
        data: categoryData.map((c) => c.category),
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '건수',
          type: 'bar',
          data: categoryData.map((c) => c.count),
        },
      ],
    };

    chart.setOption(option);
    chart.on('click', (params) => {
      setSelectedCategory(params.name);
      setExcludedTasks(new Set());
    });

    return () => chart.dispose();
  }, [categoryData, regionName]);

  // 파이차트
  useEffect(() => {
    if (!pieChartRef.current || !selectedCategoryObj) return;
    const chart = echarts.init(pieChartRef.current);

    const option = {
      title: {
        text: `${selectedCategoryObj.category} 업무 분포`,
        left: 'center',
        top: '5%',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}건 ({d}%)',
      },
      legend: { show: false },
      series: [
        {
          name: '업무',
          type: 'pie',
          radius: ['20%', '50%'],
          center: ['50%', '45%'],
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: { show: false },
          data: visibleTasks.map((t) => ({
            name: t.task,
            value: t.count,
            itemStyle: { color: colorMap[t.task] },
          })),
        },
      ],
    };

    chart.setOption(option, true);

    // ✅ 파이차트 클릭도 동일한 토글 처리
    chart.on('click', (params) => {
      handleTaskToggle(params.name);
    });

    return () => chart.dispose();
  }, [selectedCategoryObj, visibleTasks, excludedTasks]);

  useEffect(() => {
    const resize = () => {
      echarts.getInstanceByDom(barChartRef.current)?.resize();
      echarts.getInstanceByDom(pieChartRef.current)?.resize();
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
      {/* 왼쪽: 막대차트 */}
      <div className="w-full lg:w-1/2">
        <div ref={barChartRef} className="w-full h-[400px]" />
      </div>

      {/* 오른쪽: 파이차트 + 업무 목록 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start">
        <div ref={pieChartRef} className="w-full h-[400px]" />

        {/* 업무 목록 */}
        {selectedCategoryObj && (
          <div className="mt-0 px-4 py-2 w-full text-sm border rounded bg-white shadow">
            {/* 📌 안내 문구 추가 */}
            <p className="text-slate-500 text-sm mb-3">
              ※ 업무 항목 클릭시 필터 가능
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {allTasks.map((t) => {
                const color = colorMap[t.task];
                const isExcluded = excludedTasks.has(t.task);
                return (
                  <div
                    key={t.task}
                    onClick={() => handleTaskToggle(t.task)} // ✅ 클릭 이벤트 연결
                    className={`cursor-pointer flex items-center gap-2 p-2 border-2 rounded shadow-sm ${isExcluded ? 'opacity-30' : ''}`}
                    style={{ borderColor: color }}
                  >
                    <div className="text-xs leading-snug">
                      <div>{t.task}</div>
                      <div className="text-gray-500">{typeof t.count === 'number' ? t.count.toLocaleString() : '0'}건</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarPieChart;
