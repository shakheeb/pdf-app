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
  useEffect(() => {
    const cleanup = async () => {
      try {
        const response = await fetch("/api/cleanup", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete files");
        }

        console.log("Files cleanup API call successful.");
      } catch (error) {
        console.error("Error occurred while calling cleanup API:", error);
      }
    };
    fetchSavedFiles();

    // Call the cleanup function when the component unmounts or before re-running the effect
    return () => {
      cleanup();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
