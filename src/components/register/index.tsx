'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '../../core/constants'
import { LoginSuccessResponse } from '../../core/types/auth'
import styles from './styles.module.css'
import Link from "next/link";
import { pmpSdk } from '../../core/pmp-sdk'

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [passwordMatch, setPasswordMatch] = useState(true)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const name = formData.get('name')
        const email = formData.get('email')
        const password = formData.get('password')
        const code = formData.get('code')
        const confirmPassword = formData.get('confirmPassword')

        if (!email || !password || !code) {
            setError('Email, password and code are required')
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setPasswordMatch(false)
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        try {
            const response = await pmpSdk.register(email, password, code)

            // if (!response.ok) {
            //     if (response.status === 409) {
            //         setError('Email already exists')
            //         setIsLoading(false)
            //         return
            //     } else {
            //         setError(`Registration failed: ${response.statusText}`)
            //         setIsLoading(false)
            //         return
            //     }
            // }

            localStorage.setItem('access_token', response.access_token)
            router.push('/')
        } catch (err) {
            console.error('Registration error:', err)
            setError('An unexpected error occurred. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.authTitle}>Create Account</h1>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className={styles.authForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        required
                        disabled={isLoading}
                        className={styles.formInput}
                    />
                </div>

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
                        placeholder="Create a password"
                        required
                        disabled={isLoading}
                        className={styles.formInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        required
                        disabled={isLoading}
                        className={`${styles.formInput} ${!passwordMatch ? styles.inputError : ''}`}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="code" className={styles.formLabel}>Code</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        placeholder="Code"
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
                    {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <div className={styles.additionalOptions}>
                <Link href="/auth/login" className={styles.link}>Already have an account? Log in</Link>
            </div>
        </div>
    )
}
