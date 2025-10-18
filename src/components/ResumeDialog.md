# ResumeDialog Component

A reusable dialog component for viewing, downloading, or opening the resume in different formats.

## Usage

### Option 1: Using the Hook (Recommended)

The easiest way to use the resume dialog anywhere in your application:

```tsx
import { useResumeDialog } from "@/hooks/use-resume-dialog";

function MyComponent() {
  const { ResumeDialogComponent, openResumeDialog } = useResumeDialog();
  
  return (
    <>
      <button onClick={openResumeDialog}>View Resume</button>
      {/* Or use with Link component */}
      <Link href="/resume-10-25.pdf" onClick={openResumeDialog}>
        Resume
      </Link>
      
      {/* Include the dialog component */}
      {ResumeDialogComponent}
    </>
  );
}
```

### Option 2: Using the Component Directly

If you need more control over the dialog state:

```tsx
import { useState } from "react";
import { ResumeDialog } from "@/components/ResumeDialog";

function MyComponent() {
  const [showDialog, setShowDialog] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowDialog(true)}>
        View Resume
      </button>
      
      <ResumeDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}
```

## Features

The dialog provides three options:
1. **Open in Google Docs (Recommended)** - Opens the resume in Google Docs (latest version)
2. **Open Resume as PDF** - Opens the PDF in a new tab
3. **Download Resume as PDF** - Downloads the PDF file with a user-friendly filename

## Example: Replace Direct PDF Links

**Before:**
```tsx
<Link href="/resume-10-25.pdf" target="_blank">
  View Resume
</Link>
```

**After:**
```tsx
import { useResumeDialog } from "@/hooks/use-resume-dialog";

function Component() {
  const { ResumeDialogComponent, openResumeDialog } = useResumeDialog();
  
  return (
    <>
      <Link href="/resume-10-25.pdf" onClick={openResumeDialog}>
        View Resume
      </Link>
      {ResumeDialogComponent}
    </>
  );
}
```

## Props

### ResumeDialog Component

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Controls whether the dialog is open |
| `onOpenChange` | `(open: boolean) => void` | Callback when dialog open state changes |

### useResumeDialog Hook

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `ResumeDialogComponent` | `JSX.Element` | The dialog component to render |
| `openResumeDialog` | `(e?: React.MouseEvent) => void` | Function to open the dialog |
| `isOpen` | `boolean` | Current open state of the dialog |
