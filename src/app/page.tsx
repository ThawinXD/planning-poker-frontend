"use client";
import Image from "next/image";
import { Button, IconButton, InputBase, Paper, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IResRoom, IUser } from "@/interfaces";
import { AppDispatch, useAppSelector } from "../lib/store";
import { useDispatch } from "react-redux";
import { setUserId, setUserName as setUserNameAction, setURL } from "../lib/features/user";
import socket from "../socket";
import TextfieldName from "../components/TextfieldName";
import { Direction } from "@dnd-kit/core/dist/types";

export default function Home() {
  const router = useRouter();
  const user: IUser = useAppSelector((state) => state.userSlice.user as IUser);
  const dispatch = useDispatch<AppDispatch>();
  const [userName, setUserName] = useState<string>("");
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [showJoinRoomInput, setShowJoinRoomInput] = useState<boolean>(false);
  const [roomInput, setRoomInput] = useState<string>("");

  useEffect(() => {
    function onConnect() {
      setIsSocketConnected(true);
      if (socket.id)
        dispatch(setUserId(socket.id));
      console.log("Socket connected:", socket.id);
    }

    function onDisconnect() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    setUserName(user ? user.name || "" : "");
    dispatch(setURL(null))

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userName)
        dispatch(setUserNameAction(userName));
    }, 500);

    return () => clearTimeout(timer);
  }, [userName, dispatch]);

  function submitName(e: string) {
    dispatch(setUserNameAction(e));
  }

  function handleCreateRoom() {
    console.log("Create room button clicked");
    socket.emit("createRoom", user, (res: IResRoom) => {
      if (res.success) {
        console.log("Room created with ID:", res.roomId);
        dispatch(setURL(res.roomId ? `${window.location.origin}/room#${res.roomId}` : ""));
        router.push(`/room#${res.roomId}`);
      } else {
        console.error("Error creating room:", res.error);
      }
    });
  }

  function handleJoinRoom(input: string) {
    console.log("Join room button clicked");
    let roomId = input.trim();
    
    // If input is a URL, extract the room ID from the URL
    try {
      const url = new URL(roomId);
      roomId = url.hash.substring(1); // Remove the '#' character
    } catch (e) {
      // Not a valid URL, assume it's a room ID
    }
    if (roomId) {
      dispatch(setURL(`${window.location.origin}/room#${roomId}`));
      router.push(`/room#${roomId}`);
    } else {
      alert("Invalid room ID or URL");
    }
  }

  function handleButtonJoinRoom() {
    setShowJoinRoomInput(!showJoinRoomInput);
  }


  // useEffect(() => {
  //   console.log("Current user from global state:", user);
  // }, [user]);

  return (
    <div className="flex flex-col items-center justify-center h-[85vh]">
      <h1>Planning Poker Tool</h1>
      <p>
        Welcome to the Planning Poker Tool! Create a new room to start a planning poker session or join an existing room to participate with URL or room code.
      </p>
      <p>
        Enter your user name below to get started:
      </p>
      <TextfieldName
        name={userName}
        setName={setUserName}
        submitName={submitName}
      />
      {
        showJoinRoomInput &&
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300}}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter room code or URL"
            inputProps={{ 'aria-label': 'enter room code or URL' }}
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
          />
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={() => handleJoinRoom(roomInput)}>
            <Image src="/direction_right.svg" alt="Join Room" width={24} height={24} />
          </IconButton>
        </Paper>
      }
      <div className="my-8 flex flex-row p-4 gap-4">
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            handleCreateRoom();
          }}
          disabled={userName.trim() === ""}
        >
          Create room
        </Button>
        <Button
          variant="outlined"
          onClick={(e) => {
            e.preventDefault();
            handleButtonJoinRoom();
          }}
          disabled={userName.trim() === ""}
        >
          Join room
        </Button>
      </div>
      <h1 className={isSocketConnected ? "text-green-500" : "text-red-500"}>
        {isSocketConnected ? "Socket Connected" : "Socket Disconnected"}
      </h1>
    </div>
  );
}
