import { DataGrid } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';

const DataTable = ({
  data, isLoading, error, onNavigate,
  startDate, endDate,
  regionId, agencyId, auditTypeId,
  categoryId, taskId, keyword,
  includeSpecial,
  currentPage = 1,              // ✅ 상위에서 전달받은 페이지 (1-based)
  onPageChange = () => {}       // ✅ 페이지 변경 콜백
}) => {
    const handleExportExcel = () => {
    const params = new URLSearchParams();

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (regionId) params.append("regionId", regionId);
    if (agencyId) params.append("agencyId", agencyId);
    if (auditTypeId) params.append("auditTypeId", auditTypeId);
    if (categoryId) params.append("categoryId", categoryId);
    if (taskId) params.append("taskId", taskId);
    if (keyword) params.append("keyword", keyword);
    if (includeSpecial !== undefined) {
        params.append("includeSpecial", includeSpecial.toString());
    }

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/viewer/export-file?${params.toString()}`;
    console.log("📥 엑셀 다운로드 URL:", url);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };


    if (error){
        return (
            <div className="p-8 text-center">
                <div className="text-red-600 text-lg font-medium mb-2">오류 발생</div>
                <div className="text-slate-600">{error}</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
                <div className="text-slate-600">데이터를 불러오는 중입니다...</div>
            </div>
        );
    }

    const handleDetailsClick = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/viewer/${id}`);
            if (!res.ok) throw new Error("상세 정보 요청 실패");

            const detailData = await res.json();
            onNavigate('details', detailData);
        } catch (err) {
            console.error("상세 정보 오류:", err.message);
            alert("상세 정보를 불러오는 데 실패했습니다.");
        }
    };

    const columns = [
        { 
            field: 'inspection_agency', 
            headerName: '감사실시기관', 
            width: 130,
            sortComparator: (a, b) => a?.localeCompare(b, 'ko') || 0,
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        },
        { 
            field: 'disposition_request', 
            headerName: '처분요구명', 
            width: 150,
            sortComparator: (a, b) => a?.localeCompare(b, 'ko') || 0,
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        },
        { 
            field: 'related_agency', 
            headerName: '관련기관', 
            width: 180,
            sortComparator: (a, b) => a?.localeCompare(b, 'ko') || 0,
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        },
        { 
            field: 'audit_result', 
            headerName: '감사결과', 
            width: 100,
            sortComparator: (a, b) => a?.localeCompare(b, 'ko') || 0,
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        },
        { 
            field: 'category', 
            headerName: '분야', 
            width: 100,
            sortComparator: (a, b) => a?.localeCompare(b, 'ko') || 0,
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        },
        { 
            field: 'task', 
            headerName: '업무', 
            width: 100,
            sortComparator: (a, b) => a?.localeCompare(b, 'ko') || 0,
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        },
        { 
            field: 'summary', 
            headerName: '요약', 
            width: 280,
            sortComparator: (a, b) => a?.localeCompare(b, 'ko') || 0,
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold',
            renderCell: (params) => (
                <Tooltip title={params.value || ''} arrow placement="top-start">
                    <div
                        style={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            padding: '4px',
                            textAlign: 'left',
                        }}
                    >{params.value}</div>
                </Tooltip>
            ),
        },
        { 
            field: 'special_case', 
            headerName: '특이사례', 
            width: 80,
            sortComparator: (a, b) => (a === true ? 1 : 0) - (b === true ? 1 : 0),
            renderCell: (params) => (
                <span>{params.value === true ? '🟢' : ''}</span>
            ),
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        },
        {
            field: 'details',
            headerName: '내용분석',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <button
                    onClick={() => handleDetailsClick(params.row.id)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium py-1 px-2 rounded border border-slate-300"
                >
                    상세보기
                </button>
            ),
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        }
    ];

    const rows = data.map((item) => ({
        id: item.id,
        ...item
    }));

    return (
        <div className="w-full">
            <div className="flex justify-end m-3">
                <button
                    className="bg-green-700 text-white px-2 py-1.5 rounded hover:bg-green-700"
                    onClick={handleExportExcel}
                >
                    엑셀 다운로드
                </button>
            </div>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={15}
                    rowsPerPageOptions={[15]}
                    getRowHeight={() => 100}
                    pagination
                    loading={isLoading}
                    page={currentPage - 1} // ✅ MUI는 0-based 페이지 인덱스 사용
                    onPageChange={(page) => onPageChange(page + 1)} // ✅ 외부엔 1-based로 전달
                />
            </div>
        </div>
    );
};

export default DataTable;

