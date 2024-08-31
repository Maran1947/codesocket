import { IFileExplorerNode } from "@/interfaces/IFileExplorerNode";
import React, { Dispatch, SetStateAction, useState } from "react";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ArrowIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import CreaterNewFileOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import { IFile } from "@/interfaces/IFile";
import { getLanguageByFileExtension } from "@/utils/getLanguageByExt";

interface FileExplorereNodeProps {
  fileExplorerNode: IFileExplorerNode;
  handleInsertNode: (id: string, name: string, isFolder: boolean) => void;
  activeFile: IFile;
  setActiveFile: Dispatch<SetStateAction<IFile>>;
  files: IFile[];
  setFiles: Dispatch<SetStateAction<IFile[]>>;
}

const isFileAlreadyExists = (
  filename: string,
  fileExplorerNode: IFileExplorerNode
): boolean => {
  if (filename === fileExplorerNode.name) {
    return true;
  }

  for (const file of fileExplorerNode.nodes) {
    if (isFileAlreadyExists(filename, file)) {
      return true;
    }
  }

  return false;
};

const FileExplorerNode = ({
  fileExplorerNode,
  handleInsertNode,
  activeFile,
  setActiveFile,
  files,
  setFiles,
}: FileExplorereNodeProps) => {
  const [displayNodeControls, setDisplayNodeControls] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false,
  });
  const [expand, setExpand] = useState(true);

  const handleOpenFile = () => {
    const file = {
      name: fileExplorerNode.name,
      content: "",
      language: getLanguageByFileExtension(fileExplorerNode.name.split('.')[1]),
      path: fileExplorerNode.path,
    };
    setActiveFile(file);
    const existingFile = files.filter(
      (file) => file.path === fileExplorerNode.path
    );
    if (existingFile.length === 0) {
      setFiles((prev) => [...prev, file]);
    }
  };

  const handleNewFolder = (e: any, isFolder: boolean) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder,
    });
  };

  const onAddFolder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    if (e.code === "Enter" && value) {
      const filename = value;
      if (isFileAlreadyExists(filename, fileExplorerNode)) {
        alert(`${filename} is already exists.`);
        return;
      }
      handleInsertNode(fileExplorerNode.id, value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
    }
  };

  if (fileExplorerNode.isFolder) {
    return (
      <div>
        <div
          className="flex justify-between items-center cursor-pointer hover:border-l-2 hover:border-l-[#fec76f] hover:text-[#fec76f] py-1 px-2"
          onClick={() => setExpand(!expand)}
          onMouseOver={() => setDisplayNodeControls(true)}
          onMouseLeave={() => setDisplayNodeControls(false)}
        >
          <span className="truncate">
            <ArrowIcon
              sx={{ fontSize: "14px" }}
              className={expand ? "rotate-90" : ""}
            />{" "}
            {fileExplorerNode.name}
          </span>
          {displayNodeControls && (
            <div className="flex items-center gap-1">
              <CreateNewFolderOutlinedIcon
                onClick={(e) => handleNewFolder(e, true)}
              />
              <CreaterNewFileOutlinedIcon
                onClick={(e) => handleNewFolder(e, false)}
              />
            </div>
          )}
        </div>
        <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
          {showInput.visible && (
            <div className="flex gap-2 items-center">
              <span>
                {showInput.isFolder ? (
                  <ArrowIcon className="text-sm" />
                ) : (
                  <FileIcon className="text-sm" />
                )}
              </span>
              <input
                autoFocus
                onKeyDown={onAddFolder}
                onBlur={() => setShowInput({ ...showInput, visible: false })}
                type="text"
                className="text-[#fec76f] outline-none px-2 bg-[#f9f5f526]"
              />
            </div>
          )}
          {fileExplorerNode.nodes.map((node) => {
            return (
              <FileExplorerNode
                key={node.id}
                handleInsertNode={handleInsertNode}
                fileExplorerNode={node}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                files={files}
                setFiles={setFiles}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div
        onClick={handleOpenFile}
        className={
          "flex items-center gap-1 cursor-pointer hover:border-l-2 hover:border-l-[#fec76f] hover:text-[#fec76f] p-[5px] " +
          (activeFile.path === fileExplorerNode.path
            ? "border-l-2 border-l-[#fec76f] text-[#fec76f]"
            : "")
        }
      >
        <FileIcon className="text-xl" />
        <span className="truncate">{fileExplorerNode.name}</span>
      </div>
    );
  }
};

export default FileExplorerNode;
