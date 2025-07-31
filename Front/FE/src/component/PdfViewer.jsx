import React from "react";

const PdfViewer = ({ fileUrl }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop();
    link.click();
  };

  return (
    <div className="text-center">
      {/* <button
        onClick={handleDownload}
        className="px-4 py-2 mb-4 bg-blue-600 text-white rounded"
      >
        PDF 다운로드
      </button> */}
      <div className="border rounded overflow-hidden h-[80vh]">
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default PdfViewer;
