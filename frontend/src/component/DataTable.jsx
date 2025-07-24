import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';

const DataTable = ({data, isLoading, error, onNavigate}) => {
    // ✅ 엑셀 다운로드 함수
    const handleExportExcel = () => {
        // 1. 원하는 컬럼만 추출 (불필요한 데이터 제거 가능)
        const exportData = data.map(({ id, inspection_agency, disposition_request, related_agency, audit_result, category, task, summary, special_case }) => ({
        감사실시기관: inspection_agency,
        처분요구명: disposition_request,
        관련기관: related_agency,
        감사결과: audit_result,
        분야: category,
        업무: task,
        요약: summary,
        특이사례: special_case ? '있음' : ''
        }));

        // 2. 워크시트 및 워크북 생성
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '감사 데이터');

        // 3. 바이너리로 변환하여 저장
        const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, '감사데이터.xlsx');
    };

    //에러 처리
    if (error){
        return (
            <div className="p-8 text-center">
                <div className="text-red-600 text-lg font-medium mb-2">오류 발생</div>
                <div className="text-slate-600">{error}</div>
            </div>
        );
    }
    //로딩 중일 때
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
        const res = await fetch(`http://10.10.10.12:8000/api/viewer/${id}`);
        if (!res.ok) throw new Error("상세 정보 요청 실패");

        const detailData = await res.json();

        // ✅ 페이지 전환 + 백엔드 데이터 전달
        onNavigate('details', detailData);

        } catch (err) {
        console.error("상세 정보 오류:", err.message);
        alert("상세 정보를 불러오는 데 실패했습니다.");
        }
    };

    //컬럼 정의
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
            sortable: false, // 정렬 제외
            renderCell: (params) => (
            <button onClick={() => handleDetailsClick(params.row.id)}>
                상세보기
            </button>
            ),
            headerClassName: 'bg-slate-50 text-slate-700 font-semibold'
        }
    ];


    // 행(row) 정의: 고유 id 필드 필요
    const rows = data.map((item) => ({
        id: item.id, 
        ...item
    }));

    return(
        <div className="w-full">
            {/* ✅ 엑셀 다운로드 버튼 */}
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
                />
            </div>
    </div>
    );
};

export default DataTable;