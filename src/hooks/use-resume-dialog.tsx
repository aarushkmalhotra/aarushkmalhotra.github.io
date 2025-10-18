"use client";

import { useState } from "react";
import { ResumeDialog } from "@/components/ResumeDialog";

/**
 * Custom hook to manage the resume dialog state
 * Use this anywhere you want to show the resume dialog instead of directly linking to the PDF
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ResumeDialogComponent, openResumeDialog } = useResumeDialog();
 *   
 *   return (
 *     <>
 *       <button onClick={openResumeDialog}>View Resume</button>
 *       {ResumeDialogComponent}
 *     </>
 *   );
 * }
 * ```
 */
export function useResumeDialog() {
  const [open, setOpen] = useState(false);

  const openResumeDialog = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setOpen(true);
  };

  const ResumeDialogComponent = (
    <ResumeDialog open={open} onOpenChange={setOpen} />
  );

  return {
    ResumeDialogComponent,
    openResumeDialog,
    isOpen: open,
  };
}
