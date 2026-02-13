'use client'

import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { updateNoteAction } from "@/app/action/notes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  noteId: string;
  startingNoteText: string;
}

function NoteTextInput({noteId, startingNoteText}: Props) {
  const [text, setText] = useState(startingNoteText);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update text when note changes
  useEffect(() => {
    setText(startingNoteText);
  }, [startingNoteText, noteId]);

  // Auto-save with debounce
  useEffect(() => {
    if (!noteId) return;
    if (text === startingNoteText) return; // Don't save if unchanged

    const timeout = setTimeout(async () => {
      setIsSaving(true);
      
      const result = await updateNoteAction(noteId, text);
      
      if (result.success) {
        setLastSaved(new Date());
      } else {
        toast.error("Failed to save", {
          description: result.errorMessage
        });
      }
      
      setIsSaving(false);
    }, 1000); // Save 1 second after user stops typing

    return () => clearTimeout(timeout);
  }, [text, noteId, startingNoteText]);

  const formatLastSaved = () => {
    if (!lastSaved) return "";
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diff < 5) return "Saved just now";
    if (diff < 60) return `Saved ${diff}s ago`;
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    
    return `Saved at ${lastSaved.toLocaleTimeString()}`;
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-4xl">
      {/* Save Status */}
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground h-5">
        {isSaving && (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </>
        )}
        {!isSaving && lastSaved && (
          <span>{formatLastSaved()}</span>
        )}
      </div>

      {/* Text Area */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={noteId ? "Type your notes here..." : "Create a new note to start writing"}
        className="min-h-[500px] resize-none text-base"
        disabled={!noteId}
      />
    </div>
  );
}

export default NoteTextInput;