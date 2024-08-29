"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { socket } from "@/socketio";
import { useRouter } from "next/navigation";
import { useState } from "react";


export function PopUp ( { setName } ) {

  const [ state, setState ] = useState( true );
  const [ name, SetName ] = useState( "" );
  const router = useRouter();

  return (
    <Dialog open={ state }>
      <DialogTrigger asChild>
        <Button variant="outline">Enter Username</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Enter Your Name.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full py-4">
          <div className="flex items-center justify-between gap-4">
            <input
              id="name"
              required
              onChange={ e => {
                SetName( e.target.value );
                // setName( e.target.value );
              } }
              value={ name }
              className="col-span-3 border bg-background text-foreground rounded-md px-3 py-2 text-sm flex-1"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={ () => {
                  if ( localStorage.getItem( "joined" ) ) {
                    alert( "Please switch to the tab where you are already chatting. :)" );
                    return;
                  }

                  if ( name.trim().length ) {

                    socket.emit( "joined", name );
                    localStorage.setItem( "joined", name || true );
                    setName( name );
                    setState( false );
                    router.push( "/chat/global" );
                  } else {
                    alert( "Annay koi naam daal apna, school mein kabhi khaali jaga pur ni ki kya..." );
                  }
                } }>Submit</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
