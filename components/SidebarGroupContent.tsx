'use client'
import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenuButton, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { SearchIcon, FileText, Trash2, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteNoteAction } from "@/app/action/notes";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Note = {
  id: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

type Props = {
  notes: Note[];
}

function SidebarGroupContent({notes}: Props) {
  const [searchText, setSearchText] = useState("")
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentNoteId = searchParams.get('noteId');
  
  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeleteClick = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteToDelete(noteId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    
    setDeletingNoteId(noteToDelete);
    setShowDeleteDialog(false);

    const result = await deleteNoteAction(noteToDelete);

    if (result.success) {
      toast.success("Note deleted", {
        description: "Your note has been deleted successfully"
      });

      // If we deleted the currently open note, redirect to home
      if (currentNoteId === noteToDelete) {
        router.push('/');
      } else {
        router.refresh();
      }
    } else {
      toast.error("Failed to delete note", {
        description: result.errorMessage
      });
    }

    setDeletingNoteId(null);
    setNoteToDelete(null);
  };
  
  return (
    <>
      <SidebarGroupContentShadCN>
        {/* Search Input */}
        <div className="relative px-2 pb-4 pt-7">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="bg-muted pl-8 h-9"
            placeholder="Search your notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Notes List */}
        <SidebarMenu>
          {filteredNotes.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              {searchText ? "No notes found" : "No notes yet"}
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = currentNoteId === note.id;
              const isDeleting = deletingNoteId === note.id;
              
              return (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link 
                      href={`/?noteId=${note.id}`}
                      className="group relative"
                    >
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate flex-1">
                        {note.text.slice(0, 50) || "Untitled Note"}
                      </span>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteClick(e, note.id)}
                        disabled={isDeleting}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                        aria-label="Delete note"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        ) : (
                          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        )}
                      </button>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarGroupContentShadCN>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default SidebarGroupContent;