import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PdfViewer from './PdfViewer';
import { useNavigate } from 'react-router-dom';

const DataTableDetails = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [fileUrl, setFileUrl] = useState(null);
  const [fileError, setFileError] = useState(null);

  // ✅ 상세 데이터 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/viewer/${id}`);
        if (!res.ok) throw new Error('데이터 요청 실패');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id]);

  // ✅ presigned URL 요청
  useEffect(() => {
    const fetchPresignedUrl = async () => {
      if (!data?.file_hash) return;

      const requestUrl = `${import.meta.env.VITE_API_BASE_URL}/api/pdf-url?file_hash=${data.file_hash}`;
      try {
        const res = await fetch(requestUrl);
        const json = await res.json();

        if (!res.ok || json.error) {
          setFileError(json.error || 'PDF URL을 불러오는 중 오류가 발생했습니다.');
          setFileUrl(null);
        } else {
          setFileUrl(json.url);
          setFileError(null);
        }
      } catch (err) {
        setFileError('PDF URL을 불러오는 중 오류가 발생했습니다.');
        setFileUrl(null);
      }
    };

    fetchPresignedUrl();
  }, [data?.file_hash]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="mb-4">상세 데이터를 불러올 수 없습니다.</p>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          창 닫기
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-slate-600">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <button
          onClick={() => window.close()}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
          목록으로 돌아가기
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 h-full">
        {/* 왼쪽: PDF */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">원문 PDF</h2>
          </div>
          <div className="h-[600px] overflow-auto relative">
            {fileError ? (
              <p className="text-sm text-red-500">{fileError}</p>
            ) : fileUrl ? (
              <PdfViewer fileUrl={fileUrl} />
            ) : (
              <p className="text-sm text-slate-500">PDF를 불러오는 중입니다...</p>
            )}
          </div>
        </div>

        {/* 오른쪽: 분석 + 기본 정보 */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              분석정보
            </h2>
            <div className="space-y-4">
              <InfoItem label="분야 및 업무" value={`${data.category || '(내용 없음)'} - ${data.task || '(내용 없음)'}`} />
              <InfoItem label="요약" value={`(${data.summary || '(내용 없음)'})`} multiline />
              <InfoItem label="핵심 키워드" value={data.keyword || '(내용 없음)'} />
            </div>
          </div>

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
              <InfoItem label="파일크기" value={data.file_size ? `${Math.round(data.file_size / 1024)} KB` : '정보 없음'} />
              <InfoItem label="등록일" value={data.registration_date || '정보 없음'} />
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
