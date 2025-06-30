import {FC, useEffect, useState} from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { Department, Reading } from '../../core/pmp-sdk/types';
import { pmpSdk } from '../../core/pmp-sdk';
import { useQueryClient } from '@tanstack/react-query';
import {useToast} from "../../hooks/useToast";

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
    const [isLoading, setIsLoading] = useState(false);
    const [isCancelLoading, setIsCancelLoading] = useState(false);
    const [optimisticIsUserSignedUp, setOptimisticIsUserSignedUp] = useState<boolean|null>(null);

    const date = new Date(dateAsString);
    const isAvailable = readings.length < MAX_READINGS_COUNT;

    // Check if it's today and past 2pm
    const isToday = () => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isPast2PM = () => {
        const now = new Date();
        return now.getHours() >= 14; // 14:00 = 2PM
    };

    const isTodayAndPast2PM = isToday() && isPast2PM();

    console.log("date", readings)

    const userReading = readings.find(reading => reading.user.id === user?.id);
    const isUserSignedUp = optimisticIsUserSignedUp === null ? !!userReading : optimisticIsUserSignedUp;

    useEffect(() => {
        setOptimisticIsUserSignedUp(null);
    }, [readings, setOptimisticIsUserSignedUp]);

    const toast = useToast();

    const handleSignupForReading = () => {
        if (!user) {
            return;
        }

        if (isTodayAndPast2PM) {
            toast.warning('Ne možete se prijaviti za današnje čitanje nakon 14:00h');
            return;
        }

        setIsLoading(true);

        pmpSdk.createReading(dateAsString, department.id)
            .then(() => {
                setOptimisticIsUserSignedUp(true);
                setIsLoading(false);
                toast.success('Uspješno ste se prijavili na čitanje');

                if (onChange) {
                    onChange();
                }

                queryClient.invalidateQueries({ queryKey: ['get-future-readings'] })
            })
            .catch((error) => {
                const errorMessage = error?.message || 'Greška pri upisu';

                if (error?.status === 409) {
                    toast.warning(errorMessage);
                } else {
                    toast.error(errorMessage);
                }

                setIsLoading(false);
            });
    }

    const handleCancelReading = () => {
        if (!userReading) {
            return;
        }

        if (isTodayAndPast2PM) {
            toast.warning('Ne možete otkazati današnje čitanje nakon 14:00h');
            return;
        }

        setIsCancelLoading(true);

        pmpSdk.deleteReading(userReading.id)
            .then(() => {
                setOptimisticIsUserSignedUp(false);
                setIsCancelLoading(false);
                toast.success('Uspješno ste otkazali čitanje');

                if (onChange) {
                    onChange();
                }

                queryClient.invalidateQueries({ queryKey: ['get-future-readings'] })
            })
            .catch((error) => {
                const errorMessage = error?.message || 'Greška pri odjavi';
                toast.error(errorMessage);
                setIsCancelLoading(false);
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
                        weekday: 'short'
                    })})
                    </span>
                </div>
                <div className={styles.slotInfo}>{readings.length}/{MAX_READINGS_COUNT}</div>
                <div className={styles.department}>{department.name}</div>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.badgeContainer}>
                    <div className={
                        isTodayAndPast2PM
                            ? styles.blockedBadge
                            : isAvailable
                                ? styles.availableBadge
                                : styles.unavailableBadge
                    }>
                        {isTodayAndPast2PM
                            ? <span>NEDOSTUPNO</span>
                            : isAvailable
                                ? <span>SLOBODNO</span>
                                : <span>ZAUZETO</span>
                        }
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

                    <div className={styles.buttonContainer}>
                        {isUserSignedUp ? (
                            <button
                                onClick={handleCancelReading}
                                className={clsx(styles.registerButton, isTodayAndPast2PM && styles.disabledButton)}
                                type="button"
                                disabled={isCancelLoading || isTodayAndPast2PM}
                                title={isTodayAndPast2PM ? 'Ne možete otkazati nakon 14:00h' : undefined}
                            >
                                {isCancelLoading ? 'ISPISUJEMO TE' : (
                                    <>
                                        ISPIŠI ME
                                        <svg className={styles.cancelIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        ) : isAvailable ? (
                            <button
                                onClick={handleSignupForReading}
                                className={clsx(styles.registerButton, isTodayAndPast2PM && styles.disabledButton)}
                                type="button"
                                disabled={isLoading || isTodayAndPast2PM}
                                title={isTodayAndPast2PM ? 'Ne možete se prijaviti nakon 14:00h' : undefined}
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
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
