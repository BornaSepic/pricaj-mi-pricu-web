'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_URL } from '../../core/constants'
import { useAuth } from '../../hooks/useAuth'
import styles from './styles.module.css'
import ThemePicker from "../../components/theme/ThemePicker";
import { pmpSdk } from '../../core/pmp-sdk'

export const ProfilePage = () => {
    const router = useRouter()
    const { user, isLoading, refetch } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [seniority, setSeniority] = useState<'senior' | 'junior'>('junior')

    const { logout } = useAuth()

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setPhone(user.phone || '')
            setSeniority(user.seniority)
        }
    }, [user])

    async function handleSaveProfile() {
        setIsSaving(true)
        setError(null)
        setSuccess(null)

        if (!user) {
            return
        }

        pmpSdk.updateUser({
            id: user.id,
            name: name,
            email: email,
            phone: phone,
            seniority: seniority,
            role: user.role,
            status: user.status
        }).then(async () => {
            await refetch()
            setIsEditing(false)
            setSuccess('Uspješno ste ažurirali svoj profil.')
        })
            .catch((err) => {
                console.error('Error updating profile:', err)
                setError('Došlo je do greške prilikom ažuriranja profila. Molimo pokušajte ponovno kasnije.')
            })
    }

    if (isLoading) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.loadingSpinner}>Pričekajte...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.errorMessage}>
                    Molimo vas da se prijavite kako biste pristupili ovoj stranici.
                    <div className={styles.linkContainer}>
                        <Link href="/auth/login" className={styles.link}>Log in</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.profileTitle}>
                {isEditing ? 'Uređivanje profila' : 'Profil'}
            </h1>

            <ThemePicker />

            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}

            {success && (
                <div className={styles.successMessage}>{success}</div>
            )}

            <div className={styles.profileCard}>
                {!isEditing ? (
                    // View mode
                    <div className={styles.profileDetails}>
                        <div className={styles.profileField}>
                            <label className={styles.fieldLabel}>Ime i prezime</label>
                            <div className={styles.fieldValue}>{user.name}</div>
                        </div>

                        <div className={styles.profileField}>
                            <label className={styles.fieldLabel}>E-mail</label>
                            <div className={styles.fieldValue}>{user.email}</div>
                        </div>

                        <div className={styles.profileField}>
                            <label className={styles.fieldLabel}>Broj mobitela</label>
                            <div className={styles.fieldValue}>{user.phone}</div>
                        </div>

                        <div className={styles.profileField}>
                            <label className={styles.fieldLabel}>Status</label>
                            <div className={styles.fieldValue}>{user.seniority}</div>
                        </div>
                    </div>
                ) : (
                    // Edit mode
                    <div className={styles.profileForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.formLabel}>Ime i prezime</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.formInput}
                                disabled={isSaving}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.formInput}
                                disabled={isSaving}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.formLabel}>Broj mobitela</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={styles.formInput}
                                disabled={isSaving}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="seniority" className={styles.formLabel}>Status</label>
                            <select
                                id="seniority"
                                value={seniority}
                                onChange={(e) => setSeniority(e.target.value as 'senior' | 'junior')}
                                className={styles.formInput}
                                disabled={isSaving}
                            >
                                <option value="junior">Junior</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>

                        {/*<div className={styles.formInfo}>
                            <p>Role can only be changed by an administrator.</p>
                        </div>*/}
                    </div>
                )}

                <div className={styles.profileActions}>
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className={styles.editButton}
                            >
                                Uredi Profil
                            </button>
                            <button
                                onClick={() => logout()}
                                className={styles.logoutButton}
                            >
                                Odjava
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className={styles.saveButton}
                            >
                                {isSaving ? 'Spremanje...' : 'Spremi'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false)
                                    setName(user.name)
                                    setEmail(user.email)
                                }}
                                disabled={isSaving}
                                className={styles.cancelButton}
                            >
                                Odustani
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.profileNavigation}>
                <Link href="/" className={styles.link}>Natrag na početnu</Link>
            </div>
        </div>
    )
}
