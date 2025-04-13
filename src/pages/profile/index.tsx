import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { API_URL } from '../../core/constants'
import { useAuth } from '../../hooks/useAuth'
import styles from './profile.module.css'

export default function ProfilePage() {
    const router = useRouter()
    const { user, isLoading, refetch } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [seniority, setSeniority] = useState<'senior' | 'junior'>('junior')

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setSeniority(user.seniority)
        }
    }, [user])

    async function handleSaveProfile() {
        setIsSaving(true)
        setError(null)
        setSuccess(null)

        const token = localStorage.getItem('access_token')

        if (!token) {
            router.push('/auth/login')
            return
        }

        try {
            const response = await fetch(`${API_URL}/users/${user?.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    seniority
                })
            })

            if (!response.ok) {
                /*if (response.status === 401) {
                    logout()
                    return
                }*/
                if (response.status === 409) {
                    throw new Error('Email is already in use')
                }
                throw new Error(`Failed to update profile: ${response.statusText}`)
            }

            // Refetch user data to update the state across the app
            await refetch()
            setIsEditing(false)
            setSuccess('Profile updated successfully')
        } catch (err: any) {
            console.error('Error updating profile:', err)
            setError(err.message || 'Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.loadingSpinner}>Loading profile...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.errorMessage}>
                    You need to be logged in to view this page.
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
                {isEditing ? 'Edit Profile' : 'Your Profile'}
            </h1>

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
                            <label className={styles.fieldLabel}>Name</label>
                            <div className={styles.fieldValue}>{user.name}</div>
                        </div>

                        <div className={styles.profileField}>
                            <label className={styles.fieldLabel}>Email</label>
                            <div className={styles.fieldValue}>{user.email}</div>
                        </div>

                        <div className={styles.profileField}>
                            <label className={styles.fieldLabel}>Seniority</label>
                            <div className={styles.fieldValue}>{user.seniority}</div>
                        </div>
                    </div>
                ) : (
                    // Edit mode
                    <div className={styles.profileForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.formLabel}>Name</label>
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
                            <label htmlFor="email" className={styles.formLabel}>Email</label>
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
                            <label htmlFor="seniority" className={styles.formLabel}>Seniority</label>
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
                                Edit Profile
                            </button>
                            <button
                                /*onClick={logout}*/
                                className={styles.logoutButton}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className={styles.saveButton}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
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
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.profileNavigation}>
                <Link href="/" className={styles.link}>Back to Home</Link>
            </div>
        </div>
    )
}