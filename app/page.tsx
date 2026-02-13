import React, { Suspense } from "react";
import { getUser } from "./auth/auth/server";
import { createClient } from "./auth/auth/server";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";

type Props = {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}

// Separate the async content into its own component
async function HomePageContent({searchParams}: Props) {
  const noteIdParam = (await searchParams).noteId
  const user = await getUser()

  const noteId = Array.isArray(noteIdParam) ? noteIdParam![0] : noteIdParam || "";
  
  let note = null;
  
  if (noteId && user) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('Note')
      .select('*')
      .eq('id', noteId)
      .eq('authorId', user.id)
      .single();
    
    if (data && !error) {
      note = data;
    }
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user}/>
        <NewNoteButton user={user}/>
      </div>
      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}

// Wrap in Suspense
export default function HomePage(props: Props) {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
      <HomePageContent {...props} />
    </Suspense>
  );
}