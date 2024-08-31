import React from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface PeopleProps {
  clients: any[];
  roomId: string;
}

function Peoples({ clients, roomId }: PeopleProps) {
  const router = useRouter();

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

  return (
    <>
      <Toaster />
      <div className="flex md:flex-col justify-between md:h-screen p-2 md:p-4 items-center">
        <div className="md:hidden text-black w-[90px] h-8 flex items-center justify-center rounded bg-[#1eff29e7]">
          Joined: {clients.length}
        </div>
        <div className="w-full hidden md:flex gap-4 flex-wrap overflow-y-auto mb-5 px-2">
          <div className="text-black w-[90px] h-8 flex items-center justify-center rounded bg-[#1eff29e7]">
            Joined: {clients.length}
          </div>
          <div className="w-full h-[0.5px] bg-white"></div>
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
    </>
  );
}

export default Peoples;
