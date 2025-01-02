import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, useStepContext } from "@mui/material";

const App = () => {
  const [socketId, setSocketId] = useState("");
  const [socket, setSocket] = useState(null);

  const [message, setmessage] = useState("");
  const [room, setroom] = useState("");
  const [messages, setmessages] = useState([]);
  const [roomName, setroomName] = useState("");
  const [joined, setjoined] = useState("");

  useEffect(() => {
    // socket instance
    const socketInstance = io("http://localhost:8000");
    // set socket instance to use sTate
    socketInstance.on("connect", () => {
      setSocket(socketInstance);

      socketInstance.on("welcome", (data) => {
        console.log(data);
      });
      // receive message
      socketInstance.on("receive-message", (data) => {
        console.log(data);
        setmessages((prev) => [...prev, data]);
      });
      //someone-disconnected
      socketInstance.on("someone-disconnected", (data) => {
        console.log(data);
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message", { message, room });
      setmessage("");
    }
  };

  const handleJoinroom = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("join-room", roomName);
    }
    setjoined(roomName);
  };
  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit("leave-room", roomName);
    }
    setjoined("not Joined");
  };
  return (
    <>
      <Container>
        <p>You are: {socket?.id}</p>
        <form onSubmit={handleJoinroom}>
          <p>Join room</p>
          <TextField
            variant="filled"
            value={roomName}
            label="Join Room"
            onChange={({ target }) => setroomName(target.value)}
          />
          <Button variant="contained" type="submit">
            Join
          </Button>
        </form>
        <Button variant="contained" onClick={handleLeaveRoom}>
          Leave room
        </Button>
        <p>Room you are in: {joined}</p>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="filled"
            value={room}
            label="room"
            onChange={({ target }) => setroom(target.value)}
          />
          <br />
          <TextField
            variant="filled"
            value={message}
            label="message"
            onChange={({ target }) => setmessage(target.value)}
          />
          <Button variant="contained" type="submit">
            Send
          </Button>
        </form>
        <div className="messages">
          {messages.map((data, i) => {
            return <p key={i}>{data}</p>;
          })}
        </div>
      </Container>
    </>
  );
};

export default App;
