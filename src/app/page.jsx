"use client";

import { AvatarContainer } from "@/components/AvatarContainer";
import { SidebarPanel } from "@/components/SidebarPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { socket } from "@/socketio";
import Image from "next/image";
import { useEffect } from "react";

export default function Home () {

  useEffect( () => {

    socket.on( "connection", console.log );

    return () => socket.off( "connection" );

  }, [] );

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <p className="w-full text-center">Go to Chat from left Sidebar!</p>
    </main>
  );
}
