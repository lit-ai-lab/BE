import { ChevronRight, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import PdfViewer from './PdfViewer';  // ✅ 실제 PDF 뷰어 컴포넌트 import

const DataTableDetails = ({ data, onNavigate }) => {
  const [fileUrl, setFileUrl] = useState(null);

  // ✅ file_hash 기반 presigned URL 요청
  useEffect(() => {
    const fetchPresignedUrl = async () => {
      if (!data?.file_hash) return;

      const requestUrl = `${import.meta.env.VITE_API_BASE_URL}/api/pdf-url?file_hash=${data.file_hash}`;
      console.log("📡 file_hash 기반 Presigned URL 요청:", requestUrl);

      try {
        const res = await fetch(requestUrl);
        const json = await res.json();
        console.log("✅ Presigned URL 응답:", json);
        setFileUrl(json.url);  // PdfViewer에 전달
      } catch (err) {
        console.error("❌ PDF URL 불러오기 실패:", err);
      }
    };

    fetchPresignedUrl();
  }, [data?.file_hash]);

  if (!data) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="mb-4">상세 데이터를 불러올 수 없습니다.</p>
        <button
          onClick={() => onNavigate('main')}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 상단 네비게이션 */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate?.('main')}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          목록으로 돌아가기
        </button>
      </div>

      {/* 메인 레이아웃 */}
      <div className="grid lg:grid-cols-2 gap-8 h-full">
        {/* 왼쪽: PDF 뷰어 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">원문 PDF</h2>
            {/* {fileUrl && (
              <a
                href={fileUrl}
                download
                className="flex items-center px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                다운로드ㅁ
              </a>
            )} */}
          </div>
          <div className="h-[600px] overflow-auto relative">
            {fileUrl ? (
              <PdfViewer fileUrl={fileUrl} />
            ) : (
              <p className="text-sm text-slate-500">PDF를 불러오는 중입니다...</p>
            )}
          </div>
        </div>

        {/* 오른쪽: 분석 및 기본 정보 */}
        <div className="flex flex-col gap-6">
          {/* 분석정보 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              분석정보
            </h2>
            <div className="space-y-4">
              <InfoItem label="분야 및 업무" value={`${data.category || '(내용 없음)'} - ${data.task || '(내용 없음)'}`} />
              <InfoItem label="요약" value={` (${data.summary || '(내용 없음)'})`} multiline />
              <InfoItem label="핵심 키워드" value={data.keyword || '(내용 없음)'} />
            </div>
          </div>

          {/* 기본정보 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              기본정보
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <InfoItem label="감사실시기관" value={data.inspection_agency} />
              <InfoItem label="감사사항" value={data.audit_note} />
              <InfoItem label="감사대상기관" value={data.related_agency} />
              <InfoItem label="감사결과" value={data.audit_result} badge />
              <InfoItem label="파일크기" value={`${Math.round(data.file_size / 1024)} KB`} />
              <InfoItem label="등록일" value={data.registration_date} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, multiline = false, badge = false }) => (
  <div className={`${multiline ? 'space-y-2' : 'flex items-start gap-3'}`}>
    <span className="text-sm font-medium text-slate-600 whitespace-nowrap min-w-[80px]">
      {label}:
    </span>
    {badge ? (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        value === '주의' ? 'bg-yellow-100 text-yellow-800' :
        value === '지적' ? 'bg-red-100 text-red-800' :
        'bg-green-100 text-green-800'
      }`}>
        {value}
      </span>
    ) : (
      <span className={`text-sm text-slate-700 ${multiline ? 'leading-relaxed' : ''}`}>
        {value}
      </span>
    )}
  </div>
);

export default DataTableDetails;
