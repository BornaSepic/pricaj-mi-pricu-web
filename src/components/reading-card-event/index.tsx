import { FC, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import {Activity} from '../../core/pmp-sdk/types';
import { pmpSdk } from '../../core/pmp-sdk';
import { useQueryClient } from '@tanstack/react-query';
import {useToast} from "../../hooks/useToast";

export type Props = {
    activity: Activity;
    date: string;
    activities: Activity[];
    description?: string;
    onChange?: () => void;
}

export const MAX_READINGS_COUNT = 3 as const;

export const ReadingCardEvent: FC<Props> = ({
                                                activity,
                                                date: dateAsString,
                                                activities,
                                                description,
                                                onChange
                                            }) => {

    const queryClient = useQueryClient()
    const { user } = useAuth()
    const toast = useToast();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const date = new Date(dateAsString);

    // Check if current user is signed up for this activity
    const isSignedUp = user && activity.users.some(signedUpUser => user.id === signedUpUser.id);

    const handleSignUp = () => {
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

    return (
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
                    <span>
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
                    <div className={styles.availableBadge}>
                        {'SLOBODNO'}
                    </div>
                </div>
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

            {isExpanded && (
                <div className={styles.expandedContent}>
                    <div className={styles.descriptionSection}>
                        <h4 className={styles.descriptionTitle}>Opis aktivnosti:</h4>
                        <p className={styles.descriptionText}>{activity.description}</p>
                    </div>

                    <div className={styles.usersList}>
                        {Array.from({ length: (activity.users.length > 0) ? activity.users.length + 1 : MAX_READINGS_COUNT }).map((_, index) => {

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
                        {
                            isSignedUp ? (
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
                                    className={styles.registerButton}
                                    type="button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'UPISUJEMO TE' : (
                                        <>
                                            UPIŠI ME
                                            <svg className={styles.penIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM13.379 4.793L3 15.172V18h2.828l10.379-10.379-2.828-2.828z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    );
}
