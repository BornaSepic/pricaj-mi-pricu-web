import { FC, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { Activity } from '../../core/pmp-sdk/types';
import { pmpSdk } from '../../core/pmp-sdk';
import { useToast } from "../../hooks/useToast";
import { AdminProvider } from '../admin-lock';
import { ActivityEditorModal, ActivityFormData } from '../event-editor-modal';

export type Props = {
    activity: Activity;
    date: string;
    onChange?: () => void;
}


export const ActivityCard: FC<Props> = ({
    activity,
    date: dateAsString,
    onChange
}) => {

    const { user } = useAuth()
    const toast = useToast();


    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);

    const date = new Date(dateAsString);

    // Check if current user is signed up for this activity
    const isSignedUp = user && activity.users.some(signedUpUser => user.id === signedUpUser.id);

    // Check if activity limit is reached
    const isLimitReached = activity.limit && activity.users.length >= activity.limit;
    const canSignUp = !isSignedUp && !isLimitReached;

    const handleSignUp = () => {
        if (!canSignUp) return;

        setIsLoading(true);

        pmpSdk.signUpForActivity(activity.id)
            .then(() => {
                setIsLoading(false);
                if (onChange) {
                    onChange();
                }
            })
            .catch((error) => {
                const errorMessage = error?.message || 'Greška pri upisu';
                toast.error(errorMessage);
                setIsLoading(false);
            });
    }

    const handleSignOff = () => {
        setIsLoading(true);

        pmpSdk.signOffForActivity(activity.id)
            .then(() => {
                setIsLoading(false);
                if (onChange) {
                    onChange();
                }
            })
            .catch((error) => {
                const errorMessage = error?.message || 'Greška pri odjavi';
                toast.error(errorMessage);
                setIsLoading(false);
            });
    }

    // Determine badge status
    const getBadgeInfo = () => {
        if (isLimitReached) {
            return { text: 'POPUNJENO', className: styles.unavailableBadge };
        }
        if (activity.limit && activity.users.length > 0) {
            const remaining = activity.limit - activity.users.length;
            return {
                text: `SLOBODNO (${remaining}/${activity.limit})`,
                className: styles.availableBadge
            };
        }
        return { text: 'SLOBODNO', className: styles.availableBadge };
    };

    const badgeInfo = getBadgeInfo();

    const handleSaveActivity = async (activityData: ActivityFormData) => {
        if (!isEditing) return;

        setIsLoading(true);

        try {
            await pmpSdk.updateActivity({
                id: activity.id,
                ...activityData
            });

            setIsEditing(false);
            if (onChange) {
                onChange();
            }
        } catch (error) {
            console.error('Error saving activity:', error);
            // TODO: Show error toast
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteActivity = async () => {
        if (!confirm('Jeste li sigurni da želite obrisati ovu aktivnost?')) {
            return;
        }

        setIsLoading(true);

        try {
            await pmpSdk.deleteActivity(activity.id);

            if (onChange) {
                onChange();
            }
            toast.success('Aktivnost je uspješno obrisana');
        } catch (error) {
            const errorMessage = 'Greška pri brisanju aktivnosti';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const activitySlotCount = activity.limit ? Math.min(activity.limit, Math.max(activity.users.length + 1, 3)) : Math.max(activity.users.length + 1, 3);

    return (
        <>
            <div className={styles.card}>
                <div className={styles.cardHeaderFlex}>
                    <div className={styles.dateInfo}>
                        <span>
                            {date.toLocaleDateString('hr-HR', {
                                year: undefined,
                                month: '2-digit',
                                day: '2-digit'
                            })}
                        </span>
                        <span translate="no">
                            ({date.toLocaleDateString('hr-HR', {
                                year: undefined,
                                month: undefined,
                                day: undefined,
                                weekday: 'short'
                            })})
                        </span>
                    </div>
                    <div className={styles.department}>{activity.title}</div>
                </div>

                <div className={styles.cardContent}>
                    <div className={styles.badgeContainer}>
                        <div className={badgeInfo.className}>
                            {badgeInfo.text}
                        </div>
                    </div>

                    <div className={styles.ActivityCard__controls}>
                        <AdminProvider>
                            <button
                                className={styles.editButton}
                                onClick={() => setIsEditing(true)}
                                type="button"
                                title="Uredi događaj"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                            </button>
                            <button
                                className={styles.editButton}
                                onClick={handleDeleteActivity}
                                type="button"
                                title="Obriši događaj"
                                disabled={isLoading}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                </svg>
                            </button>
                        </AdminProvider>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            aria-label="Toggle details"
                            className={styles.toggleButton}
                            type="button"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx(styles.rotateIcon, isExpanded && styles.rotateIcon__rotated)}>
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className={styles.expandedContent}>
                        <div className={styles.descriptionSection}>
                            <h4 className={styles.descriptionTitle}>Opis aktivnosti:</h4>
                            <p className={styles.descriptionText}>{activity.description}</p>
                        </div>

                        {activity.limit > 0 && (
                            <div className={styles.limitInfo}>
                                <p>
                                    Maksimalno sudionika: {activity.users.length}/{activity.limit}
                                </p>
                            </div>
                        )}

                        <div className={styles.usersList}>
                            {Array.from({ length: activitySlotCount }).map((_, index) => {
                                const user = activity.users[index];

                                if (!user) {
                                    return (
                                        <div key={index} className={styles.userSlot}>
                                            <p>
                                                {index + 1}.
                                            </p>
                                        </div>
                                    )
                                }

                                return (
                                    <div key={index} className={styles.userSlot}>
                                        <p>
                                            {index + 1}. ({user.seniority === 'junior' ? 'J' : 'S'}) {user.name}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className={styles.buttonContainer}>
                            {isSignedUp ? (
                                <button
                                    onClick={handleSignOff}
                                    className={styles.registerButton}
                                    type="button"
                                >
                                    {isLoading ? 'ISPISUJEMO TE' : (
                                        <>
                                            ISPIŠI ME
                                            <svg className={styles.cancelIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSignUp}
                                    className={clsx(
                                        styles.registerButton,
                                        !canSignUp && styles.disabledButton
                                    )}
                                    type="button"
                                    disabled={isLoading || !canSignUp}
                                    title={isLimitReached ? 'Aktivnost je popunjena' : undefined}
                                >
                                    {isLoading ? 'UPISUJEMO TE' : isLimitReached ? (
                                        <>
                                            POPUNJENO
                                            <svg className={styles.lockIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 1C8.676 1 6 3.676 6 7v3H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V11a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zM8 7c0-2.206 1.794-4 4-4s4 1.794 4 4v3H8V7zm10 13H6v-8h12v8zm-6-6a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            UPIŠI ME
                                            <svg className={styles.penIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM13.379 4.793L3 15.172V18h2.828l10.379-10.379-2.828-2.828z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Activity Modal - Handles both adding and editing */}
            {isEditing && (
                <ActivityEditorModal
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                    onSubmit={handleSaveActivity}
                    activity={activity}
                    isLoading={isLoading}
                    isReadOnly={false}
                />
            )}
        </>
    );
}