import React, { Dispatch, SetStateAction, useState } from "react";
import { useTraverseTree } from "@/hooks/useTraverseTree";
import FileExplorerNode from "./FileExplorerNode";
import { Typography } from "@mui/material";
import { IFileExplorerNode } from "@/interfaces/IFileExplorerNode";
import { IFile } from "@/interfaces/IFile";
import { Socket } from "socket.io-client";

interface FileExplorerProps {
  fileExplorerData: IFileExplorerNode;
  setFileExplorerData: Dispatch<SetStateAction<IFileExplorerNode>>;
  activeFile: IFile;
  setActiveFile: Dispatch<SetStateAction<IFile>>;
  files: IFile[];
  setFiles: Dispatch<SetStateAction<IFile[]>>;
  isFileExplorerUpdated: boolean
  setIsFileExplorerUpdated: Dispatch<SetStateAction<boolean>>
}

function FileExplorer({
  fileExplorerData,
  setFileExplorerData,
  activeFile,
  setActiveFile,
  files,
  setFiles,
  isFileExplorerUpdated,
  setIsFileExplorerUpdated
}: FileExplorerProps) {
  const { insertNode } = useTraverseTree();

  const handleInsertNode = (
    folderId: string,
    item: string,
    isFolder: boolean
  ) => {
    const finalTree = insertNode(fileExplorerData, folderId, item, isFolder);
    setFileExplorerData(finalTree);
  };

  return (
    <div className="text-[#aaaaaa] p-4">
      <Typography
        variant="h6"
        component="h6"
        className="border-b border-[#aaaaa] pb-1 mb-2"
      >
        EDITOR
      </Typography>
      <FileExplorerNode
        handleInsertNode={handleInsertNode}
        fileExplorerNode={fileExplorerData}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        files={files}
        setFiles={setFiles}
        isFileExplorerUpdated={isFileExplorerUpdated}
        setIsFileExplorerUpdated={setIsFileExplorerUpdated}
      />
    </div>
  );
}

export default FileExplorer;
