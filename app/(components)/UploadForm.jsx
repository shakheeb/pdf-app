"use client";
import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useSession } from "next-auth/react";

const UploadForm = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [fullPage, setFullPage] = useState(null);
  const [uploadedPDFs, setUploadedPDFs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const { data: session } = useSession();
  // handles file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileValidation(file);
  };
  // handles file dragover
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  // handles file drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileValidation(file);
  };
  // makes sure file is pdf
  const handleFileValidation = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
    } else {
      setSelectedFile(null);
      setError("Please select a PDF file");
    }
  };
  // sets pagenumber when pdf loads
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  // toggles to full page in large devices
  const toggleFullPage = (pageNumber) => {
    if (window.innerWidth > 768) {
      setFullPage(fullPage === pageNumber ? null : pageNumber);
    }
  };
  const userId = session?.user.id; // acess user id

  // handele form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      try {
        const data = new FormData();
        // append pdf as binary
        data.append("file", selectedFile);
        // appens user id
        data.append("userId", userId);

        // backend api, uploads file
        const res = await fetch("api/pdf/upload", {
          method: "POST",
          body: data,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setError("Please select a PDF file");
    }
    await fetchUploadedPDFs();
    setSelectedFile(null);
  };
  // fetches uploaded file
  const fetchUploadedPDFs = async () => {
    try {
      // backend api for retrieving uploaded file
      const response = await fetch(`/api/pdf/fetch?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch uploaded PDFs");
      }
      const pdfs = await response.json();
      setUploadedPDFs(pdfs);
    } catch (error) {
      console.error(error);
    }
  };
  // views uploaded file when clicked
  const handleClick = async () => {
    setSelectedPDF(uploadedPDFs);
    setSelectedPages([]);
  };
  // page selection for exraction
  const handlePageSelection = (pageNumber) => {
    const index = selectedPages.indexOf(pageNumber);
    if (index === -1) {
      setSelectedPages([...selectedPages, pageNumber]);
    } else {
      setSelectedPages(selectedPages.filter((page) => page !== pageNumber));
    }
  };
  // handles page extraction
  const handleExtraction = async () => {
    try {
      // backend api for extraction
      const response = await fetch("/api/pdf/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPages: selectedPages,
          originalPDF: selectedPDF,
          userId: userId,
        }),
      });
      if (response.ok) {
        const newPDF = await response.blob();

        // Ask user for confirmation to download the file
        const confirmDownload = window.confirm(
          "Do you want to download the new PDF file?"
        );

        if (confirmDownload) {
          // Download new PDF
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(newPDF);
          downloadLink.download = `new_${selectedPDF}.pdf`;
          downloadLink.click();

          // Reset selected pages
          setSelectedPages([]);
        }
      } else {
        throw new Error("Failed to create new PDF");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="w-full justify-center">
      <h1 className="flex justify-center mb-4 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl">
        {" "}
        PDF={">"}PDF
      </h1>
      <div className="max-w-lg mx-auto mt-8">
        <form
          onSubmit={handleSubmit}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-dashed border-2 border-gray-700 rounded-lg p-6"
        >
          <label
            htmlFor="file-input"
            className="cursor-pointer block mb-4 text-lg"
          >
            {selectedFile
              ? selectedFile.name
              : "Drop PDF file here or click to select"}
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={() => document.getElementById("file-input").click()}
            >
              Browse
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 ml-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Upload
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {selectedFile && (
          <div className="mt-4">
            <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess}>
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
        )}
      </div>
      <div className="flex justify-center m-10 max-w-lg mx-auto mt-8">
        <h4>Uploaded PDF:</h4>
        <ul>
          {uploadedPDFs.map((pdf, index) => (
            <li
              key={index}
              onClick={handleClick}
              className="text-blue-500 cursor-pointer"
            >
              {pdf}
            </li>
          ))}
        </ul>
      </div>
      {selectedPDF && (
        <div className="mt-4 flex justify-center ">
          <Document
            file={`/api/pdf/load/${selectedPDF}?userId=${userId}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                onClick={() => toggleFullPage(index + 1)}
                className="cursor-pointer px-2 pb-4 relative"
              >
                <Page
                  pageNumber={index + 1}
                  width={fullPage === index + 1 ? 600 : 300}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
                <div className="absolute top-0 right-0">
                  {" "}
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(index + 1)}
                    onChange={() => handlePageSelection(index + 1)}
                    className="h-6 w-6 accent-green-300"
                  />
                </div>
                <label>{`Page ${index + 1}`}</label>
              </div>
            ))}
          </Document>
        </div>
      )}
      {selectedPDF && selectedPages.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleExtraction}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Extract Selected Pages
          </button>
        </div>
      )}
    </section>
  );
};

export default UploadForm;
