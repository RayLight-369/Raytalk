import { io } from "socket.io-client";

export const socket = io( "http://localhost:5261", {
  autoConnect: false
} );

// https://next-chat-socket.onrender.com