import { Inter } from "next/font/google";
import "./globals.css";
import ChildLayout from "./ChildLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarPanel } from "@/components/SidebarPanel";
import Messages from "@/Contexts/Messages";
import { CallProvider } from "@/Contexts/CallContext";

const inter = Inter( { subsets: [ "latin" ] } );

export const metadata = {
  title: "Raytalk",
  description: "Global Chat App, No need for linking accounts!",
};

export default function RootLayout( { children } ) {
  return (
    <html lang="en">
      <body className={ inter.className + " w-screen h-screen" }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Messages>
            <CallProvider>
              <ChildLayout />
              <SidebarPanel>
                { children }
              </SidebarPanel>
            </CallProvider>
          </Messages>
        </ThemeProvider>
      </body>
    </html>
  );
}
