// app/auth/callback/route.ts
import { createClient } from '@/app/auth/auth/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      // Redirect to login with error
      return NextResponse.redirect(`${requestUrl.origin}/login?error=verification_failed`)
    }
  }

  // Redirect to dashboard after successful verification
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}