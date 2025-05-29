import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  const supabase = createClient(cookies())

  const response = await supabase.from('users').select('*')

  return (
    <>Connected {JSON.stringify(response)}</>
  )
}
