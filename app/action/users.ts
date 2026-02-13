// app/actions/users.ts
'use server'

import { createClient } from '@/app/auth/auth/server'
import { getUser } from '@/app/auth/auth/server'

/**
 * Creates or updates a user in Supabase database using Supabase client
 * (Alternative to Prisma when direct DB connection is blocked)
 */
export async function syncUserToDatabase() {
  try {
    const supabaseUser = await getUser()
    
    if (!supabaseUser) {
      return { success: false, error: 'No authenticated user found' }
    }

    const supabase = await createClient()

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('User')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = not found, which is okay
      throw fetchError
    }

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('User')
        .update({
          email: supabaseUser.email || existingUser.email,
          name: supabaseUser.user_metadata?.name || existingUser.name,
          updatedAt: new Date().toISOString()
        })
        .eq('id', supabaseUser.id)
        .select()
        .single()

      if (error) throw error

      return { success: true, user: data, action: 'updated' }
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('User')
        .insert({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, user: data, action: 'created' }
    }
  } catch (error) {
    console.error('Error syncing user to database:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Gets user profile with notes
 */
export async function getUserProfile() {
  try {
    const supabaseUser = await getUser()
    
    if (!supabaseUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const supabase = await createClient()

    const { data: user, error } = await supabase
      .from('User')
      .select(`
        *,
        notes:Note(*)
      `)
      .eq('id', supabaseUser.id)
      .single()

    if (error) throw error

    return { success: true, user }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Updates user profile
 */
export async function updateUserProfile(name: string) {
  try {
    const supabaseUser = await getUser()
    
    if (!supabaseUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('User')
      .update({ name, updatedAt: new Date().toISOString() })
      .eq('id', supabaseUser.id)
      .select()
      .single()

    if (error) throw error

    return { success: true, user: data }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}