"use server";

import { getUser, createClient } from "../auth/auth/server";
import { revalidatePath } from "next/cache";

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");
    
    const supabase = await createClient();
    
    // Update the note using Supabase
    const { error } = await supabase
      .from('Note')
      .update({ 
        text,
        updatedAt: new Date().toISOString()
      })
      .eq('id', noteId)
      .eq('authorId', user.id);  // Ensure user owns the note
    
    if (error) throw error;

    // Revalidate to refresh sidebar
    revalidatePath('/');

    return { success: true, errorMessage: null };
  } catch (error) {
    return { 
      success: false,
      errorMessage: error instanceof Error ? error.message : "Failed to update note" 
    };
  }
};

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");
    
    const supabase = await createClient();
    
    // Create a new note using Supabase
    const { error } = await supabase
      .from('Note')
      .insert({
        id: noteId,
        text: "",  // Empty note initially
        authorId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    
    if (error) throw error;

    // Revalidate to refresh sidebar
    revalidatePath('/');

    return { success: true, errorMessage: null };
  } catch (error) {
    return { 
      success: false,
      errorMessage: error instanceof Error ? error.message : "Failed to create note" 
    };
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");
    
    const supabase = await createClient();
    
    // Delete the note using Supabase
    const { error } = await supabase
      .from('Note')
      .delete()
      .eq('id', noteId)
      .eq('authorId', user.id);  // Ensure user owns the note
    
    if (error) throw error;

    // Revalidate to refresh sidebar
    revalidatePath('/');

    return { success: true, errorMessage: null };
  } catch (error) {
    return { 
      success: false,
      errorMessage: error instanceof Error ? error.message : "Failed to delete note" 
    };
  }
};

export const getNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to view notes");
    
    const supabase = await createClient();
    
    // Get specific note
    const { data, error } = await supabase
      .from('Note')
      .select('*')
      .eq('id', noteId)
      .eq('authorId', user.id)
      .single();
    
    if (error) throw error;

    return { 
      success: true, 
      note: data,
      errorMessage: null 
    };
  } catch (error) {
    return { 
      success: false,
      note: null,
      errorMessage: error instanceof Error ? error.message : "Failed to get note" 
    };
  }
};

export const getAllNotesAction = async () => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to view notes");
    
    const supabase = await createClient();
    
    // Get all user's notes
    const { data, error } = await supabase
      .from('Note')
      .select('*')
      .eq('authorId', user.id)
      .order('updatedAt', { ascending: false });
    
    if (error) throw error;

    return { 
      success: true, 
      notes: data || [],
      errorMessage: null 
    };
  } catch (error) {
    return { 
      success: false,
      notes: [],
      errorMessage: error instanceof Error ? error.message : "Failed to get notes" 
    };
  }
};