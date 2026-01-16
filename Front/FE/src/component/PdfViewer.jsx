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
