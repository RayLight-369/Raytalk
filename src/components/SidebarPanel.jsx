"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export function SidebarPanel ( { children } ) {
  const links = [
    {
      label: "Chat",
      href: "/chat",
      icon: (
        <MessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    }
  ];
  const [ open, setOpen ] = useState( false );
  return (
    <div
      className={ cn(
        "flex flex-col md:flex-row  w-full flex-1 max-w-full mx-auto overflow-hidden",
        "h-full" // for your use case, use `h-screen` instead of `h-[60vh]`
      ) }
    >
      <Sidebar open={ open } setOpen={ setOpen }>
        <SidebarBody className="justify-between gap-10  border-r">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            { open ? <Logo /> : <LogoIcon /> }
            <div className="mt-8 flex flex-col gap-2">
              { links.map( ( link, idx ) => (
                <SidebarLink key={ idx } link={ link } activeLink={ "before:absolute before:w-[5px] before:h-[15px] before:bg-white before:-left-[2.5px] before:rounded-full before:z-[1000] before:top-1/2 before:-translate-y-1/2 " } />
              ) ) }
            </div>
          </div>
          <div>
            <ThemeToggle />
            <SidebarLink
              link={ {
                label: "Am brothers",
                href: "#",
                icon: (
                  <Image
                    src="https://github.com/shadcn.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={ 50 }
                    height={ 50 }
                    alt="Avatar"
                  />
                ),
              } }
            />
          </div>
        </SidebarBody>
      </Sidebar>
      { children }
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/chat"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 px-4"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={ { opacity: 0 } }
        animate={ { opacity: 1 } }
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Raytalk
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 px-4"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
