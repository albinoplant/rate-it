import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function getUserServer() {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()
    return user
}