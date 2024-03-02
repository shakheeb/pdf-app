const FileList = ({ files, onFileClick }) => {
  return (
    <div>
      <h2 className="text-blue-900">Recent Files</h2>
      <ul className="p-4 list-disc list-insid rounded shadow-md">
        {files.map((file, index) => (
          <li
            key={index}
            className="mb-2 text-blue-700 cursor-pointer hover:text-black"
            onClick={() => onFileClick(file)}
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
