'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './styles.module.css'
import Link from "next/link";
import {useAuth} from "../../hooks/useAuth";
import { pmpSdk } from '../../core/pmp-sdk'

export default function LoginPage() {
    const router = useRouter()
    const {refetch} = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        if(!email || !password) {
            setError('Email and password are required')
            setIsLoading(false)
            return
        }

        try {
            const response = await pmpSdk.logIn(email, password)

            // if (!response.ok) {
            //     if (response.status === 401) {
            //         setError('Invalid email or password')
            //         setIsLoading(false)
            //         return
            //     } else {
            //         setError(`Login failed: ${response.statusText}`)
            //         setIsLoading(false)
            //         return
            //     }
            // }

            localStorage.setItem('access_token', response.access_token)

            await refetch()

        } catch (err) {
            console.error('Login error:', err)
            setError('An unexpected error occurred. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.authTitle}>Welcome Back</h1>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className={styles.authForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your email"
                        required
                        disabled={isLoading}
                        className={styles.formInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.formLabel}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Your password"
                        required
                        disabled={isLoading}
                        className={styles.formInput}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={styles.authButton}
                >
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <div className={styles.additionalOptions}>
                <Link href="/auth/forgot-password" className={styles.link}>Forgot password?</Link>
                <Link href="/auth/register" className={styles.link}>Don't have an account? Sign up</Link>
            </div>
        </div>
    )
}