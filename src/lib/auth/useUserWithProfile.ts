'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface Profile {
    id: string
    full_name: string | null
    avatar_url: string | null
    created_at: string
    user: User
}

export function useUserWithProfile() {
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile({...data, user})
            }
        })
    }, [])

    return profile
}