import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function TotalUsersSideSheet ( { totalUsers } ) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">See joined users</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Joined Users</SheetTitle>
          <SheetDescription>
            <ol className="list-[auto] flex flex-col gap-2 pl-3 pt-2">
              { totalUsers?.map( ( user, i ) => (
                <li className="name text-sm">{ user.name }</li>
              ) ) }
            </ol>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
