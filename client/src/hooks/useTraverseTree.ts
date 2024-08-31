import { IFileExplorerNode } from "@/interfaces/IFileExplorerNode";
import { v4 as uuid } from "uuid";

export const useTraverseTree = () => {
  const insertNode = (
    fileExplorerNode: IFileExplorerNode,
    nodeId: string,
    name: string,
    isFolder: boolean
  ): IFileExplorerNode => {
    if (fileExplorerNode.id === nodeId) {
      fileExplorerNode.nodes.unshift({
        id: uuid(),
        name,
        isFolder,
        path: `${fileExplorerNode.path}/${name}`,
        nodes: [],
      });
    }

    const latestNodes = fileExplorerNode.nodes.map(
      (node): IFileExplorerNode => insertNode(node, nodeId, name, isFolder)
    );

    return { ...fileExplorerNode, nodes: latestNodes };
  };

  return { insertNode };
};
