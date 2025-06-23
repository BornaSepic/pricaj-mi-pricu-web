'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { API_URL } from '../../core/constants'
import styles from './styles.module.css'
import Link from "next/link";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Get token from URL parameters
        const tokenParam = searchParams.get('token')
        if (tokenParam) {
            setToken(tokenParam)
        } else {
            setError('Neispravan ili nedostajući token za resetiranje lozinke.')
        }
    }, [searchParams])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(event.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Lozinke se ne podudaraju.')
            setIsLoading(false)
            return
        }

        if (!token) {
            setError('Neispravan token za resetiranje lozinke.')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password,
                    confirmPassword
                }),
            })

            if (!response.ok) {
                if (response.status === 400) {
                    setError('Neispravan ili istekao token.')
                } else if (response.status === 422) {
                    setError('Lozinka ne zadovoljava sigurnosne uvjete.')
                } else {
                    setError(`Greška: ${response.statusText}`)
                }
                setIsLoading(false)
                return
            }

            // Success - show message and redirect after delay
            setSuccess(true)
            event.currentTarget.reset()

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/auth/login')
            }, 3000)

        } catch (err) {
            console.error('Reset password error:', err)
            setError('Došlo je do greške prilikom resetiranja lozinke. Molimo pokušajte ponovno.')
        } finally {
            setIsLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.authTitle}>Postavite novu lozinku</h1>
            {/*<p className={styles.authDescription}>
                Unesite novu lozinku.
            </p>*/}

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {success && (
                <div className={styles.successMessage}>
                    Lozinka je uspješno promijenjena! Preusmjeravamo vas na stranicu za prijavu...
                </div>
            )}

            {!success && token && (
                <form onSubmit={handleSubmit} autoComplete="off" className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>Nova lozinka</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Unesite novu lozinku"
                                required
                                disabled={isLoading}
                                className={styles.formInput}
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className={styles.passwordToggle}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.formLabel}>Potvrdite lozinku</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Potvrdite novu lozinku"
                                required
                                disabled={isLoading}
                                className={styles.formInput}
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className={styles.passwordToggle}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.authButton}
                    >
                        {isLoading ? 'Spremanje...' : 'Postavite novu lozinku'}
                    </button>
                </form>
            )}

            <div className={styles.additionalOptions}>
                <Link href="/auth/login" className={styles.link}>
                    {success ? 'Idite na prijavu' : 'Natrag na prijavu'}
                </Link>
            </div>
        </div>
    )
}
