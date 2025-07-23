import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';  // ✅ Vite 전용 import 방식
import useWindowSize from './useWindowSize';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
//pdfjs.disableWorker = true;

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const windowSize = useWindowSize();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button 
        onClick={handleDownload} 
        style={{ padding: '8px 16px', marginBottom: '16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '4px', border: 'none' }}
      >
        PDF 다운로드
      </button>
      <div style={{
        width: '100%', 
        maxHeight: '80vh',           // ✅ 화면 높이의 80%까지만
        overflow: 'auto',            // 스크롤 가능하게
        margin: '0 auto' 
      }}>
        <Document 
        file={fileUrl} 
        onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page 
          width={windowSize.width * 0.9}
          //height={windowSize.height}
          pageNumber={pageNumber}
        />
        </Document>
      </div>

      Page {pageNumber} of {numPages}
      {pageNumber > 1 && (
        <button onClick={() => setPageNumber(prev => prev + -1)}>
          이전페이지
        </button>
      )}
      {pageNumber < numPages && <button onClick={() => setPageNumber(prev => prev + 1)}>다음페이지</button>}
    </div>
  );
};

export default PdfViewer;
