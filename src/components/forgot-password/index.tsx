'use client'

import { FormEvent, useState } from 'react'
import { API_URL } from '../../core/constants'
import styles from './styles.module.css'
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                if (response.status === 404) {
                    setError('Email not found')
                    setIsLoading(false)
                    return
                } else {
                    setError(`Request failed: ${response.statusText}`)
                    setIsLoading(false)
                    return
                }
            }

            // Reset form and show success message
            setSuccess(true)
            event.currentTarget.reset()
        } catch (err) {
            console.error('Forgot password error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.authTitle}>Reset Your Password</h1>
            <p className={styles.authDescription}>
                Enter your email address below and we'll send you a link to reset your password.
            </p>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {success && (
                <div className={styles.successMessage}>
                    Password reset link has been sent to your email. Please check your inbox.
                </div>
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
                        disabled={isLoading || success}
                        className={styles.formInput}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || success}
                    className={styles.authButton}
                >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <div className={styles.additionalOptions}>
                <Link href="/auth/login" className={styles.link}>Back to login</Link>
            </div>
        </div>
    )
}