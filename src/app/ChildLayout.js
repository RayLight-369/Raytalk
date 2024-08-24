"use client";

import { socket } from "@/socketio";
import { useEffect } from "react";



export default function ChildLayout ( { children } ) {

  useEffect( () => {

    socket.connect();

    return () => socket.disconnect();

  }, [] );

  return (
    <>
      { children }
    </>
  );
}
