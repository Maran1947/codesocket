"use client";
import { FormEvent, KeyboardEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  const notify = () =>
    toast.success("New room Id created successfully.", {
      style: {
        borderRadius: "10px",
        background: "#000",
        color: "#00ff00",
      },
    });

  const handleCreateRoom = () => {
    const id = uuid();
    setRoomId(id);
    notify();
  };

  const handleRoomId = (e: FormEvent<HTMLInputElement>) => {
    setRoomId(e.currentTarget.value);
  };

  const handleUsername = (e: FormEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.replace(`/room/${roomId}?username=${username}`);
  };

  const handleInputEnter = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.code === "Enter") {
      router.replace(`/room/${roomId}?username=${username}`);
    }
  };

  return (
    <main className="bg-[#38424c] flex min-h-screen flex-col items-center justify-between p-24">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-sm p-4 bg-black border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form
          className="space-y-6"
          onSubmit={handleJoinRoom}
          onKeyUp={(e) => handleInputEnter(e)}
        >
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Join room
          </h5>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Room ID
            </label>
            <input
              value={roomId}
              onChange={handleRoomId}
              type="text"
              name="email"
              id="email"
              className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter room ID"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              value={username}
              onChange={handleUsername}
              type="text"
              name="password"
              id="password"
              placeholder="Enter your username"
              className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-[#39277f] bg-[#7af948] hover:bg-[#6cd84199] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Join now
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Don&apos;t have an invitation?{" "}
            <span
              onClick={handleCreateRoom}
              className="cursor-pointer text-[#5eff00] hover:underline"
            >
              Create room
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}
