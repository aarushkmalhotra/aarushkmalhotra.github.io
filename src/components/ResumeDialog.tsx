"use client";

import { useState } from "react";
import { FileText, ExternalLink, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeDialog({ open, onOpenChange }: ResumeDialogProps) {
  const handleOpenPDF = () => {
    window.open("/resume-10-25.pdf", "_blank");
    onOpenChange(false);
  };

  const handleOpenGoogleDocs = () => {
    window.open("https://docs.google.com/document/d/1J-cDIf-eM6g9zfFniH5guI0-FGRaJMmeBOIjqAfRjaw/", "_blank");
    onOpenChange(false);
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = "/resume-10-25.pdf";
    link.download = "Aarush_Kumar_Resume-10-2025.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>View Resume</DialogTitle>
          <DialogDescription>
            Choose how you'd like to view my resume
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleOpenGoogleDocs}
            variant="outline"
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 210 210" fill="currentColor">
                <path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40 c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105 S0,162.897,0,105z"></path>
              </svg>
              Open in Google Docs (Latest)
            </span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleOpenPDF}
            variant="outline"
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Open Resume as PDF
            </span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Resume as PDF
            </span>
            <Download className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Wrapper component with built-in trigger
interface ResumeDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function ResumeDialogTrigger({ children }: ResumeDialogTriggerProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <div onClick={handleClick} className="inline-block cursor-pointer">
        {children}
      </div>
      <ResumeDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
