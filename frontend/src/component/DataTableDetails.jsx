import { ChevronRight, Download } from 'lucide-react';
//import PdfViewer from './PdfViewer';

const DataTableDetails = ({ data, onNavigate }) => {
  //const sampleUuid = "11eed08e-0951-e76c-9c95-f9a91c4fcb66";
  //const fileUrl = `http://10.10.10.12:8000/static/pdfs/${sampleUuid}.pdf`;

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
            <button className="flex items-center px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Download className="w-4 h-4 mr-1" />
              다운로드
            </button>
          </div>
          <div className="h-[600px]">
            {/*<PdfViewer fileUrl={fileUrl} />*/}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* 분석정보 (상단) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              분석정보
            </h2>
            <div className="space-y-4">
              <InfoItem label="분야 및 업무" value={`${data.category} - ${data.task}`} />
              <InfoItem label="요약" value={data.summary} multiline />
              <InfoItem label="핵심 키워드" value={data.keyword} />
            </div>
          </div>
          
          {/* 기본정보 (하단) */}
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
      ///////이 부분 수정 필요
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


// import { useState } from 'react';
// import PdfViewer from './component/PdfViewer';
// import { ChevronRight} from 'lucide-react';

// const DataTableDetails = ({ data, onNavigate }) => {
//   const [activeTab, setActiveTab] = useState('analysisInfo');
//   const sampleUuid = "11eed08e-0951-e76c-9c95-f9a91c4fcb66";
//   const fileUrl = `http://10.10.10.12:8000/static/pdfs/${sampleUuid}.pdf`;

//   if (!data) {
//     return (
//       <div className="p-6 text-center text-red-600">
//         <p className="mb-4">상세 데이터를 불러올 수 없습니다.</p>
//         <button
//           onClick={() => onNavigate('main')}
//           className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
//         >
//           돌아가기
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* 상단 네비게이션 */}
//       <div className="mb-6">
//         <button
//           onClick={() => onNavigate('main')}
//           className="inline-flex items-center px-4 py-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors"
//         >
//           <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
//           목록으로 돌아가기
//         </button>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-8">
//         {/* PDF 영역 */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-slate-800 mb-4">원문 PDF</h2>
//           <PdfViewer fileUrl={fileUrl} />
//         </div>

//         {/* 분석 정보 */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-slate-800 mb-4">분석 정보</h2>

//           {/* 탭 버튼 */}
//           <div className="flex mb-6 space-x-2">
//             <button
//               onClick={() => setActiveTab('analysisInfo')}
//               className={`px-4 py-2 text-sm font-medium rounded-lg ${
//                 activeTab === 'analysisInfo'
//                   ? 'bg-slate-800 text-white'
//                   : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
//               }`}
//             >
//               분석 & 기본정보
//             </button>
//             <button
//               onClick={() => setActiveTab('dataInfo')}
//               className={`px-4 py-2 text-sm font-medium rounded-lg ${
//                 activeTab === 'dataInfo'
//                   ? 'bg-slate-800 text-white'
//                   : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
//               }`}
//             >
//               데이터 정보
//             </button>
//           </div>

//           {/* 탭 내용 */}
//           {activeTab === 'analysisInfo' ? (
//             <div className="space-y-2 text-sm text-slate-700">
//               <p><span className="font-semibold">기관명:</span> {data.inspection_agency}</p>
//               <p><span className="font-semibold">감사날짜:</span> {data.date}</p>
//               <p><span className="font-semibold">감사사항:</span> {data.audit_note}</p>
//               <p><span className="font-semibold">감사대상:</span> {data.related_agency}</p>
//               <p><span className="font-semibold">감사결과:</span> {data.audit_result}</p>
//             </div>
//           ) : (
//             <div className="space-y-2 text-sm text-slate-700">
//               <p><span className="font-semibold">파일형식:</span> PDF</p>
//               <p><span className="font-semibold">파일크기:</span> {data.file_size} KB</p>
//               <p><span className="font-semibold">등록일:</span> {data.registration_date}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTableDetails;