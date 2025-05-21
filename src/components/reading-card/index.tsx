import { FC, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { Department, Reading } from '../../core/pmp-sdk/types';
import { pmpSdk } from '../../core/pmp-sdk';
import { useQueryClient } from '@tanstack/react-query';

export type Props = {
    department: Department;
    date: string;
    readings: Reading[];
    onChange?: () => void;
}

export const MAX_READINGS_COUNT = 3 as const;

export const ReadingCard: FC<Props> = ({
    department,
    date: dateAsString,
    readings,
    onChange
}) => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const date = new Date(dateAsString);
    const isAvailable = readings.length < MAX_READINGS_COUNT;

    const handleSignupForReading = () => {
        if (!user) {
            return;
        }
        setIsLoading(true);

        pmpSdk.createReading(dateAsString, department.id)
            .then(() => {
                setIsLoading(false);

                if (onChange) {
                    onChange();
                }

                queryClient.invalidateQueries({ queryKey: ['get-future-readings'] })
            })
            .catch((error) => {
                setIsLoading(false);
            });
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeaderGrid}>
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
                            weekday: 'long'
                        })})
                    </span>
                </div>
                <div className={styles.slotInfo}>{readings.length}/{MAX_READINGS_COUNT}</div>
                <div className={styles.department}>{department.name}</div>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.badgeContainer}>
                    <div className={isAvailable ? styles.availableBadge : styles.unavailableBadge}>
                        {isAvailable ? 'SLOBODNO' : 'ZAUZETO'}
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
                    <div className={styles.usersList}>
                        {Array.from({ length: MAX_READINGS_COUNT }).map((_, index) => {

                            const reading = readings[index];

                            if (!reading) {
                                return (
                                    <div key={index} className={styles.userSlot}>
                                        <p>
                                            {index + 1}.
                                        </p>
                                    </div>
                                )
                            }

                            const user = reading.user;

                            return (
                                <div key={index} className={styles.userSlot}>
                                    <p>
                                        {index + 1}. {readings[index] ? `(${user.seniority === 'junior' ? 'J' : 'S'}) ${user.name}` : ''}
                                    </p>
                                </div>
                            )
                        })}
                    </div>

                    {isAvailable && (
                        <div className={styles.buttonContainer}>
                            <button
                                onClick={() => {
                                    handleSignupForReading()
                                }}
                                className={styles.registerButton}
                                type="button"
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
