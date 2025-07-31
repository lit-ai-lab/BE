import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const BarPieChart = ({ regionName, categoryData }) => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const colorPalette = [
    '#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE',
    '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#D9A6A1'
  ];

  const selectedCategoryObj = categoryData.find(
    (c) => c.category === selectedCategory
  );

  const sortedTasks = selectedCategoryObj
    ? [...selectedCategoryObj.tasks].sort((a, b) => b.count - a.count)
    : [];

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
    chart.on('click', (params) => setSelectedCategory(params.name));
    return () => chart.dispose();
  }, [categoryData, regionName]);

  // 파이차트
  useEffect(() => {
    if (!pieChartRef.current) return;
    const chart = echarts.init(pieChartRef.current);

    const option = selectedCategoryObj
      ? {
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
              data: sortedTasks.map((t, idx) => ({
                name: t.task,
                value: t.count,
                itemStyle: { color: colorPalette[idx % colorPalette.length] },
              })),
            },
          ],
        }
      : {
          title: {
            text: '막대를 클릭하여 업무 분포 확인',
            left: 'center',
            top: 'center',
            textStyle: { fontSize: 16, color: '#999' },
          },
          series: [],
        };

    chart.setOption(option, true);
    return () => chart.dispose();
  }, [selectedCategoryObj]);

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

        {/* 업무 목록 (파이차트 순서, 색상 일치) */}
        {selectedCategoryObj && (
          <div className="mt-0 px-4 py-2 w-full text-sm border rounded bg-white shadow">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {sortedTasks.map((t, idx) => {
                const color = colorPalette[idx % colorPalette.length];

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 border-2 rounded shadow-sm"
                    style={{ borderColor: color }}
                  >
                    <div className="text-xs leading-snug">
                      <div>{t.task}</div>
                      <div className="text-gray-500">{t.count}건</div>
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
