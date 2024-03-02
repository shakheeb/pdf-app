"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FileList from "../(components)/FileList";
import PdfViewer from "../(components)/PdfViewer";
const ViewFiles = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const { data: session } = useSession();
  const userId = session?.user.id;

  const fetchSavedFiles = async () => {
    try {
      const response = await fetch(
        `/api/pdf/fetch?userId=${userId}&viewFiles=allfiles`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch uploaded PDFs");
      }
      const files = await response.json();

      setFiles(files);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileClick = (file) => {
    setSelectedFile(file);
  };
  console.log(files);
  return (
    <div>
      <FileList files={files} onFileClick={handleFileClick} />
      {selectedFile && <PdfViewer file={selectedFile} userId={userId} />}
    </div>
  );
};

export default ViewFiles;
