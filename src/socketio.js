import { io } from "socket.io-client";

export const socket = io( "https://next-chat-socket.onrender.com", {
  autoConnect: false
} );

// https://next-chat-socket.onrender.com