"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const PdfViewer = (file) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const [numPages, setNumPages] = useState(null);
  const [fullPage, setFullPage] = useState(null);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const toggleFullPage = (pageNumber) => {
    if (window.innerWidth > 768) {
      setFullPage(fullPage === pageNumber ? null : pageNumber);
    }
  };
  return (
    <div className="flex justify-start">
      <div className="mt-4">
        <Document
          file={`/api/pdf/load/${file.file}?userId=${file.userId}`}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={`page_${index + 1}`}
              onClick={() => toggleFullPage(index + 1)}
              className="cursor-pointer px-2 pb-4 "
            >
              <Page
                pageNumber={index + 1}
                width={fullPage === index + 1 ? 600 : 300}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
