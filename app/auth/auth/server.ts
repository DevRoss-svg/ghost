/*import { createServerClient } from '@supabase/ssr'
import { create } from 'domain'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
  return client 
}
 export async function getUser(){
    const {auth} = await createClient();
    const userObject = await auth.getUser()

    if(userObject.error){
        console.error(userObject.error);
        return null;
    }
    return userObject.data.user
  }
*/
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
  return client 
}

export async function getUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  // "Auth session missing!" is expected when no user is logged in
  // Only log errors that are NOT about missing sessions
  if (error && error.message !== 'Auth session missing!') {
    console.error('Error fetching user:', error.message)
  }

  return data.user
}