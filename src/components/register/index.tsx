'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './styles.module.css'
import Link from "next/link";
import { pmpSdk } from '../../core/pmp-sdk'
import {toast} from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [passwordMatch, setPasswordMatch] = useState(true)
    const {refetch} = useAuth()


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

        if (!name || !email || !password || !code) {
            const errorMsg = 'Ime, email, lozinka i kod su obavezni'
            setError(errorMsg)
            toast.error(errorMsg)
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setPasswordMatch(false)
            const errorMsg = 'Lozinke se ne podudaraju'
            setError(errorMsg)
            toast.error(errorMsg)
            setIsLoading(false)
            return
        }

        try {
            const response = await pmpSdk.register(name, "user", "junior", "active", email, password, code)

            console.log(response)

            // Success case - user is now registered
            localStorage.setItem('access_token', response.access_token)

            toast.success('Uspješno ste se registrirali!')
            refetch()
            router.push('/')

        } catch (err: any) {
            console.error('Registration error:', err)
            setIsLoading(false)

            let errorMessage = 'Nešto je pošlo po zlu prilikom registracije. Molimo pokušajte ponovno.'

            if (err.response) {
                // Server responded with error status
                const status = err.response.status
                errorMessage = err.response.message

            } else if (err.message) {
                errorMessage = err.message
            }

            setError(errorMessage)
            toast.error(errorMessage)
        }
    }

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.authTitle}>Registracija</h1>

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className={styles.authForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Ime i prezime</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ime i prezime"
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
                        placeholder="email"
                        required
                        disabled={isLoading}
                        className={styles.formInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.formLabel}>Lozinka</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Lozinka"
                        required
                        disabled={isLoading}
                        className={styles.formInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.formLabel}>Ponovi lozinku</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Ponovite lozinku"
                        required
                        disabled={isLoading}
                        className={`${styles.formInput} ${!passwordMatch ? styles.inputError : ''}`}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="code" className={styles.formLabel}>Kod</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        placeholder="Kod za registraciju"
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
                    {isLoading ? 'Izrada...' : 'Registriraj se'}
                </button>
            </form>

            <div className={styles.additionalOptions}>
                <Link href="/auth/login" className={styles.link}>Povratak na prijavu</Link>
            </div>
        </div>
    )
}
