import { IFile } from "./IFile";
import { IFileExplorerNode } from "./IFileExplorerNode";

interface IDataPayload {
  fileExplorerData: IFileExplorerNode;
  activeFile: IFile;
  openFiles: IFile[];
}

export type { IDataPayload };
