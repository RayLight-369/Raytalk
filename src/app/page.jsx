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
    <main className="w-screen h-screen">
      {/* <nav className="float-left h-full p-5 border-r flex flex-col justify-between">
        <div>
          <AvatarContainer />
        </div>

        <ThemeToggle />
      </nav> */}
    </main>
  );
}
