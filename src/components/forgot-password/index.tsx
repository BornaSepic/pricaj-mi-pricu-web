'use client'

import { FormEvent, useState } from 'react'
import styles from './styles.module.css'
import Link from "next/link";
import { pmpSdk } from '../../core/pmp-sdk';

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

        if (typeof email !== 'string' || !email) {
            setError('Molimo unesite ispravnu email adresu.')
            setIsLoading(false)
            return
        }

        await pmpSdk.createPasswordReset({
            email: email
        }).catch((err) => {
                console.error('Error creating password reset:', err)
                if (err.response && err.response.status === 404) {
                    setError('Email not found')
                } else {
                    setError('Došlo je do greške prilikom slanja zahtjeva. Molimo pokušajte ponovno.')
                }
                throw err
            })

        setSuccess(true)
        event.currentTarget.reset()
    }

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.authTitle}>Promjena lozinke</h1>
            <p className={styles.authDescription}>
                Unesite svoju email adresu kako biste primili link za promjenu lozinke.
            </p>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {success && (
                <div className={styles.successMessage}>
                    Uspješno ste poslali zahtjev za promjenu lozinke. Provjerite svoj email.
                </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className={styles.authForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
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
                    {isLoading ? 'Slanje...' : 'Pošalji link za promjenu lozinke'}
                </button>
            </form>

            <div className={styles.additionalOptions}>
                <Link href="/auth/login" className={styles.link}>Natrag na prijavu</Link>
            </div>
        </div>
    )
}