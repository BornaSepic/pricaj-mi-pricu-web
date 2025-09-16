'use client'

import React, { FC, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'

type Props = {
    children: React.ReactNode
}

export const AdminProvider: FC<Props> = ({ children }) => {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (isLoading) return

        if (!user || user.role !== 'admin') {
            // router.replace('/')
        }
    }, [user, isLoading, router])

    if (isLoading) return null
    if (!user || user.role !== 'admin') return null

    return <>{children}</>
}
