import React, {useMemo} from 'react';
const colorPalette = [
  'bg-red-100 text-black',        // 연한 빨강 (따뜻한 느낌)
  'bg-orange-100 text-black',     // 부드러운 주황
  'bg-amber-100 text-black',      // 은은한 금색 느낌
  'bg-yellow-100 text-black',     // 따뜻한 연노랑
  'bg-lime-100 text-black',       // 연둣빛
  'bg-green-100 text-black',      // 안정적인 연초록
  'bg-emerald-100 text-black',    // 맑은 초록
  'bg-teal-100 text-black',       // 차분한 청록
  'bg-cyan-100 text-black',       // 부드러운 하늘색
  'bg-sky-100 text-black',        // 매우 연한 푸른색
  'bg-blue-100 text-black',       // 파스텔 파랑
  'bg-indigo-100 text-black',     // 연보라 기운 있는 파랑
  'bg-violet-100 text-black',     // 연한 보라
  'bg-purple-100 text-black',     // 은은한 연보라
  'bg-rose-100 text-black',       // 따뜻한 장밋빛
];




const RegionTaskTable = ({ region, tasks }) => {
    const categoryColorMap = useMemo(() => {
        const map = {};
        let colorIndex = 0;
        for (const task of tasks) {
            const category = task.category;
            if (!map[category]){
                map[category] = colorPalette[colorIndex % colorPalette.length];
                colorIndex++;
            }
        }
        return map;
    }, [tasks]);
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800">{region}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-25">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                            Top
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            분야 및 업무
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tasks.map((task) => (
                        <tr key={task.rank} className="hover:bg-gray-25 transition-colors duration-150">
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-center">
                            {task.rank}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                            <div className="flex flex-col">
                                <span className={`inline-block ${categoryColorMap[task.category]} px-2 py-1 rounded-full text-xs font-medium mb-1 whitespace-nowrap w-fit`}>
                                {task.category}
                                </span>
                                <span>{task.name}</span>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(RegionTaskTable);