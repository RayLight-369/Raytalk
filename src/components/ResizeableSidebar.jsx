import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function ResizableSidebar ( { left, right } ) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-full rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={ 25 } minSize={ 15 } maxSize={ 50 }>
        <div className="flex h-full items-center justify-center">
          { left || <span className="font-semibold">One</span> }
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={ 75 }>
        <div className="flex h-full items-center justify-center">
          { right || <span className="font-semibold">Three</span> }
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
