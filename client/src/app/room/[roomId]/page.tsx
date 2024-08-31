"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import "./page.css";
import { initSocket } from "@/socket";
import { ACTIONS } from "@/app/helpers/Actions";
import toast, { Toaster } from "react-hot-toast";
import { Socket } from "socket.io-client";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SourceIcon from "@mui/icons-material/Source";
import Peoples from "@/app/components/Peoples";
import FileExplorer from "@/app/components/fileExplorer/FileExplorer";
import CloseIcon from "@mui/icons-material/Close";
import { IFileExplorerNode } from "@/interfaces/IFileExplorerNode";
import { IFile } from "@/interfaces/IFile";
import { IDataPayload } from "@/interfaces/IDataPayload";
import { v4 as uuid } from "uuid";

const filesContentMap = new Map<string, IFile>();

const initialActiveFile = {
  name: "index.js",
  language: "javascript",
  content: `console.log(\`You are awesome 🤟\`)`,
  path: "/root/index.js",
};

filesContentMap.set(initialActiveFile.path, initialActiveFile);

const Page = () => {
  const params = useParams();
  const query = useSearchParams();
  const router = useRouter();

  const { roomId } = params;

  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [activeFile, setActiveFile] = useState(initialActiveFile);
  const [files, setFiles] = useState([initialActiveFile]);
  const [fileExplorerData, setFileExplorerData] = useState<IFileExplorerNode>({
    id: uuid(),
    name: "root",
    isFolder: true,
    path: "/root",
    nodes: [
      {
        id: uuid(),
        name: "index.js",
        isFolder: false,
        nodes: [],
        path: "/root/index.js",
      },
    ],
  });
  const [isFileExplorerUpdated, setIsFileExplorerUpdated] = useState(false);

  const editorRef = useRef(null);
  const socketRef = useRef<Socket | null>(null);

  function handleEditorChange(content: string | undefined) {
    const dataPayload: IDataPayload = {
      fileExplorerData,
      openFiles: files,
      activeFile: {
        ...activeFile,
        content: content ?? "",
      },
    };

    filesContentMap.set(activeFile.path, {
      ...activeFile,
      content: content ?? "",
    });
    socketRef.current!.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      payload: dataPayload,
    });
  }

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const handleSocketErrors = (err: any) => {
    console.log("Socket error: ", err);
  };

  const handleLeaveRoom = () => {
    router.replace("/");
  };

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
  };

  const handleCloseFile = (e: React.MouseEvent, file: IFile) => {
    e.stopPropagation();
    const updatedOpenFile = files.filter(
      (currentFile) => currentFile.path !== file.path
    );
    const updatedActiveFile =
      updatedOpenFile.length > 0
        ? updatedOpenFile[0]
        : {
            name: "",
            content: "",
            language: "",
            path: "",
          };
    setActiveFile(updatedActiveFile);
    setFiles(updatedOpenFile);
    const dataPayload: IDataPayload = {
      fileExplorerData,
      openFiles: updatedOpenFile,
      activeFile: updatedActiveFile,
    };
    socketRef.current!.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      payload: dataPayload,
    });
  };

  const handleChangeActiveFile = (file: IFile) => {
    setActiveFile(file);
  };

  useEffect(() => {
    const usernameFromUrl = query.get("username");
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err: any) =>
        handleSocketErrors(err)
      );
      socketRef.current.on("connect_failed", (err: any) =>
        handleSocketErrors(err)
      );

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: usernameFromUrl,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
        if (username !== usernameFromUrl) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
      });

      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ username, socketId }: { username: string; socketId: string }) => {
          toast.success(`${username} left the room.`);
          setClients((prev: any) => {
            return prev.filter((client: any) => client.socketId !== socketId);
          });
        }
      );

      socketRef.current.on(
        ACTIONS.CODE_CHANGE,
        ({ payload }: { payload: IDataPayload }) => {
          console.log("msg: ", payload);
          setActiveFile(payload.activeFile);
          setFileExplorerData(payload.fileExplorerData);
          setFiles(payload.openFiles);
          filesContentMap.set(payload.activeFile.path, payload.activeFile);
        }
      );
    };

    usernameFromUrl ? init() : handleLeaveRoom();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off(ACTIONS.CODE_CHANGE);
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isFileExplorerUpdated && socketRef.current) {
      const dataPayload: IDataPayload = {
        fileExplorerData,
        openFiles: files,
        activeFile,
      };
      socketRef.current!.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        payload: dataPayload,
      });
      setIsFileExplorerUpdated(false);
    }
  }, [isFileExplorerUpdated]);

  return (
    <div className="flex flex-col md:flex-row">
      <Toaster />
      <div className="hidden md:w-[4.5%] md:h-screen bg-[#2d2a2a] border-r border-r-[#4e4b4b] py-5 md:flex flex-col items-center gap-3">
        <SourceIcon
          onClick={() => handleTabChange(0)}
          sx={{
            cursor: "pointer",
            fontSize: "2rem",
            color: activeTab === 0 ? "#ffe200" : "#8c7f91",
            "&:hover": { color: "#ffe200" },
          }}
        />
        <PeopleAltIcon
          onClick={() => handleTabChange(1)}
          sx={{
            cursor: "pointer",
            fontSize: "2rem",
            color: activeTab === 1 ? "#ffe200" : "#8c7f91",
            "&:hover": { color: "#ffe200" },
          }}
        />
      </div>
      <div className="w-full md:w-[30%] lg:w-[30%] md:h-screen bg-[#right] border-r border-r-[#605c5c]">
        {activeTab === 0 && (
          <FileExplorer
            fileExplorerData={fileExplorerData}
            setFileExplorerData={setFileExplorerData}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            files={files}
            setFiles={setFiles}
            isFileExplorerUpdated={isFileExplorerUpdated}
            setIsFileExplorerUpdated={setIsFileExplorerUpdated}
          />
        )}
        {activeTab === 1 && (
          <Peoples clients={clients} roomId={roomId as string} />
        )}
      </div>
      <div className="coegle_editor w-full md:w-[70%] h-screen">
        <div className="h-[5vh] w-full flex overflow-y-auto mb-2">
          {files.map((file, index) => {
            return (
              <div
                onClick={() => handleChangeActiveFile(file)}
                key={file.path + index}
                className={
                  "cursor-pointer flex gap-2 items-center px-3 py-1 text-sm " +
                  (activeFile.path === file.path
                    ? "text-[#fec76f] bg-[#473e3e]"
                    : "text-[#aaaaaa] bg-[#473e3e]")
                }
              >
                <span>{file.name}</span>
                <CloseIcon
                  onClick={(e) => handleCloseFile(e, file)}
                  className="cursor-pointer"
                  sx={{ fontSize: "14px" }}
                />
              </div>
            );
          })}
        </div>
        {activeFile.name && files.length > 0 ? (
          <Editor
            height={"93vh"}
            path={activeFile.name}
            defaultLanguage={activeFile.language}
            defaultValue={activeFile.content}
            onChange={(value) => handleEditorChange(value)}
            onMount={handleEditorDidMount}
            value={filesContentMap.get(activeFile.path)?.content}
            theme={"vs-dark"}
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: fontSize,
              cursorStyle: "line",
              lineNumbersMinChars: 4,
              quickSuggestions: true,
            }}
          />
        ) : (
          <div className="text-xl text-[#aaaaaa] flex items-center justify-center h-[93vh]">
            No file is open.
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
