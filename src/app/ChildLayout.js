"use client";

import Messages from "@/Contexts/Messages";
import { socket } from "@/socketio";
import { useEffect } from "react";



export default function ChildLayout ( { children } ) {

  return (
    <Messages>
      { children }
    </Messages>
  );
}
