"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import files from "@/app/helpers/files";
import "./page.css";
import { initSocket } from "@/socket";
import { ACTIONS } from "@/app/helpers/Actions";
import toast, { Toaster } from "react-hot-toast";
import { Socket } from "socket.io-client";

type FileType = {
  name: string;
  langauge: string;
  value: string;
};

const Page = () => {
  const params = useParams();
  const query = useSearchParams();
  const router = useRouter();

  const { roomId } = params;

  const [clients, setClients] = useState([]);

  const editorRef = useRef(null);
  const socketRef = useRef<Socket | null>(null);

  const [code, setCode] = useState("");

  const [fileName, setFileName] = useState("script.js");

  const file: FileType = files[fileName];

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  function handleEditorChange(value: string | undefined, file: FileType) {
    socketRef.current!.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value,
    });
  }

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const handleSocketErrors = (err: any) => {
    console.log("Socket error: ", err);
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId as string);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copied the Room ID");
      console.log(err);
    }
  };

  const handleLeaveRoom = () => {
    router.replace("/");
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
        console.log(clients);
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
        ({ code }: { code: string }) => {
          setCode(code);
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

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <Toaster />
      <div className="coegle_editor w-full md:w-[70%] lg:w-[80%] h-screen">
        <Editor
          height={"100vh"}
          path={file.name}
          defaultLanguage={"javascript"}
          defaultValue={file.value}
          onChange={(value) => handleEditorChange(value, file)}
          onMount={handleEditorDidMount}
          value={code}
          theme={"vs-dark"}
          options={{
            minimap: {
              enabled: false,
            },
            fontSize: fontSize,
            cursorStyle: "line",
            lineNumbersMinChars: 4,
            quickSuggestions: false,
          }}
        />
      </div>
      <div className="w-full md:w-[30%] lg:w-[20%] md:h-screen bg-[#171717]">
        <div className="flex md:flex-col justify-between md:h-screen p-2 md:p-4 items-center">
          <div className="md:hidden text-black w-[90px] h-8 flex items-center justify-center rounded bg-[#1eff29e7]">
            Joined: {clients.length}
          </div>
          <div className="w-full hidden md:flex gap-4 flex-wrap overflow-y-auto mb-5 px-2">
            <div className="text-black w-[90px] h-8 flex items-center justify-center rounded bg-[#1eff29e7]">
              Joined: {clients.length}
            </div>
            <div className="w-full h-[0.5px] bg-white" ></div>
            {clients.length > 0 &&
              clients.map((client: any) => {
                return (
                  <div
                    key={client.socketId}
                    className="w-full flex flex-row items-center gap-2 px-2"
                  >
                    <p className="rounded min-w-8 h-8 bg-[#cd54f9] flex items-center justify-center">
                      {client.username && client.username[0]}
                    </p>
                    <p className="text-white mt-1">{client.username}</p>
                  </div>
                );
              })}
          </div>
          <div className="flex flex-row md:flex-col md:w-3/4 md:mx-auto">
            <button
              onClick={handleCopyRoomId}
              type="button"
              className="h-8 w-[80px] md:w-full md:h-10 md:py-2.5 me-2 md:mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Copy ID
            </button>
            <button
              onClick={handleLeaveRoom}
              type="button"
              className="h-8 w-[80px] md:w-full md:h-10 text-sm md:py-2.5 me-2 md:mb-2  text-white bg-[#b81313] hover:bg-[#f35151aa] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg focus:outline-none"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
