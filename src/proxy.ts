
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth' // 👈 আপনার Better-Auth ক্লায়েন্ট পাথ
import { headers } from 'next/headers'

// 🎯 ১. ফাংশনের নাম অবশ্যই 'middleware' হতে হবে
export async function proxy(request: NextRequest) {
  
  // Better-Auth এর সেশন চেক
  const session = await auth.api.getSession({
    headers: await headers()
  })

  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  
  return NextResponse.next()
}
 
export const config = {
  
  matcher: [
    '/channel', 
    '/channel/:path*', 
    '/watch/:path*'
  ],
}
