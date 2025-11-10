import { FC, useEffect, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { Department, Reading } from '../../core/pmp-sdk/types';
import { pmpSdk } from '../../core/pmp-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "../../hooks/useToast";
import {AdminProvider} from "../admin-lock";
import {AdminUserSelectionModal} from "../admin-select-user-modal";

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
    const [optimisticIsUserSignedUp, setOptimisticIsUserSignedUp] = useState<boolean | null>(null);

    // Admin modal state
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isAdminSignupLoading, setIsAdminSignupLoading] = useState(false);
    const [removingUserId, setRemovingUserId] = useState<number | null>(null);

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

    // Check if date is Monday, Friday, or Sunday
    const isBlockedDay = () => {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, 5 = Friday
        return dayOfWeek === 0 || dayOfWeek === 5; // Sunday, Monday, Friday
    };

    const isDayBlocked = isBlockedDay();

    // Helper function to check if user is admin
    const isUserAdmin = () => {
        return user?.role === 'admin';
    };

    // Count juniors in current readings
    const juniorCount = readings.filter(reading => reading.user?.seniority === 'junior').length;
    const isJuniorLimitReached = juniorCount >= 2;
    const isUserJunior = user?.seniority === 'junior';
    const isJuniorBlocked = isJuniorLimitReached && isUserJunior && !isUserAdmin();

    console.log("date", readings)

    const userReading = readings.find(reading => reading.user && user && reading.user.id === user.id);
    const isUserSignedUp = optimisticIsUserSignedUp === null ? !!userReading : optimisticIsUserSignedUp;

    useEffect(() => {
        setOptimisticIsUserSignedUp(null);
    }, [readings, setOptimisticIsUserSignedUp]);

    const toast = useToast();

    const handleSignupForReading = () => {
        if (!user) {
            return;
        }

        if (isDayBlocked) {
            toast.warning('Čitanje nije dostupno za ovaj dan u tjednu');
            return;
        }

        if (isTodayAndPast2PM) {
            toast.warning('Ne možete se prijaviti za današnje čitanje nakon 14:00h');
            return;
        }

        if (isJuniorBlocked) {
            toast.warning('Ne možete se prijaviti - već ima dovoljno juniora');
            return;
        }

        setIsLoading(true);

        pmpSdk.createReading(user.id, dateAsString, department.id)
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

        if (isDayBlocked) {
            toast.warning('Čitanje nije dostupno za ovaj dan u tjednu');
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

    // Admin functionality - no 2PM restriction but still respects blocked days
    const handleAdminSignup = (userId: number) => {
        if (isDayBlocked && !isUserAdmin()) {
            toast.warning('Čitanje nije dostupno za ovaj dan u tjednu');
            return;
        }

        setIsAdminSignupLoading(true);

        pmpSdk.createReading(userId, dateAsString, department.id)
            .then(() => {
                setIsAdminSignupLoading(false);
                setIsAdminModalOpen(false);
                toast.success('Uspješno ste upisali korisnika na čitanje');

                if (onChange) {
                    onChange();
                }

                queryClient.invalidateQueries({ queryKey: ['get-future-readings'] })
                queryClient.invalidateQueries({ queryKey: [`get-readings-for-department`, department.id] })
            })
            .catch((error: { message: string; }) => {
                const errorMessage = error?.message || 'Greška pri upisu korisnika';
                toast.error(errorMessage);
                setIsAdminSignupLoading(false);
            });
    };

    const handleAdminRemoveUser = (readingId: number) => {
        const reading = readings.find(r => r.id === readingId);
        if (!reading?.user) return;

        setRemovingUserId(reading.user.id);

        pmpSdk.deleteReading(readingId)
            .then(() => {
                setRemovingUserId(null);
                toast.success(`Uspješno ste uklonili ${reading.user!.name} s čitanja`);

                if (onChange) {
                    onChange();
                }

                queryClient.invalidateQueries({ queryKey: ['get-future-readings'] })
                queryClient.invalidateQueries({ queryKey: [`get-readings-for-department`, department.id] })
            })
            .catch((error) => {
                const errorMessage = error?.message || 'Greška pri uklanjanju korisnika';
                toast.error(errorMessage);
                setRemovingUserId(null);
            });
    };

    // Get list of user IDs already signed up for this reading
    const signedUpUserIds = readings
        .filter(reading => reading.user)
        .map(reading => reading.user!.id);

    return (
        <>
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
                        <span translate="no">
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
                            isDayBlocked
                                ? styles.blockedBadge
                                : (isTodayAndPast2PM && !isUserAdmin())
                                    ? styles.blockedBadge
                                    : !isAvailable
                                        ? styles.unavailableBadge
                                        : (isJuniorBlocked)
                                            ? styles.juniorBlockedBadge
                                            : styles.availableBadge
                        }>
                            {isDayBlocked
                                ? <span>NEDOSTUPNO</span>
                                : (isTodayAndPast2PM && !isUserAdmin())
                                    ? <span>NEDOSTUPNO</span>
                                    : !isAvailable
                                        ? <span>ZAUZETO</span>
                                        : (isJuniorBlocked)
                                            ? <span>SAMO SENIORI</span>
                                            : <span>SLOBODNO</span>
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

                                if (!user) {
                                    return null
                                }

                                return (
                                    <div key={index} className={styles.userSlot}>
                                        <p>
                                            {index + 1}. {readings[index] ? `(${user.seniority === 'junior' ? 'J' : 'S'}) ${user.name}` : ''}
                                        </p>
                                        <AdminProvider>
                                            <button
                                                onClick={() => handleAdminRemoveUser(reading.id)}
                                                className={styles.removeUserButton}
                                                type="button"
                                                disabled={removingUserId === user.id}
                                                title={`Ukloni ${user.name}`}
                                            >
                                                {removingUserId === user.id ? (
                                                    <svg className={styles.spinner} width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                ) : (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </button>
                                        </AdminProvider>
                                    </div>
                                )
                            })}
                        </div>

                        <div className={styles.buttonContainer}>
                            {isUserSignedUp ? (
                                <div className={styles.availableButtons}>
                                    <button
                                        onClick={handleCancelReading}
                                        className={clsx(styles.registerButton, (isTodayAndPast2PM || isDayBlocked) && styles.disabledButton)}
                                        type="button"
                                        disabled={isCancelLoading || isTodayAndPast2PM || isDayBlocked}
                                        title={isDayBlocked ? 'Čitanje nije dostupno za ovaj dan u tjednu' : (isTodayAndPast2PM ? 'Ne možete otkazati nakon 14:00h' : undefined)}
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
                                    {/* Admin-only button - no day restrictions for admins */}
                                    <AdminProvider>
                                        <button
                                            onClick={() => setIsAdminModalOpen(true)}
                                            className={styles.adminButton}
                                            type="button"
                                            title="Upiši drugog korisnika (admin)"
                                        >
                                            <>
                                                UPIŠI KORISNIKA
                                            </>
                                        </button>
                                    </AdminProvider>
                                </div>
                            ) : isAvailable && !isJuniorBlocked && !isDayBlocked ? (
                                <div className={styles.availableButtons}>
                                    <button
                                        onClick={handleSignupForReading}
                                        className={clsx(styles.registerButton, (isTodayAndPast2PM || isDayBlocked) && styles.disabledButton)}
                                        type="button"
                                        disabled={isLoading || isTodayAndPast2PM || isDayBlocked}
                                        title={isDayBlocked ? 'Čitanje nije dostupno za ovaj dan u tjednu' : (isTodayAndPast2PM ? 'Ne možete se prijaviti nakon 14:00h' : undefined)}
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

                                    {/* Admin-only button - no day restrictions for admins */}
                                    <AdminProvider>
                                        <button
                                            onClick={() => setIsAdminModalOpen(true)}
                                            className={styles.adminButton}
                                            type="button"
                                            title="Upiši drugog korisnika (admin)"
                                        >
                                            <>
                                                UPIŠI KORISNIKA
                                            </>
                                        </button>
                                    </AdminProvider>
                                </div>
                            ) : (
                                /* Show admin button even when blocked days, junior blocked or no slots available */
                                <div className={styles.availableButtons}>
                                    <AdminProvider>
                                        <button
                                            onClick={() => setIsAdminModalOpen(true)}
                                            className={styles.adminButton}
                                            type="button"
                                            title="Upiši drugog korisnika (admin)"
                                        >
                                            <>
                                                UPIŠI KORISNIKA
                                            </>
                                        </button>
                                    </AdminProvider>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Admin User Selection Modal */}
            <AdminUserSelectionModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                onUserSelect={handleAdminSignup}
                date={dateAsString}
                departmentName={department.name}
                isLoading={isAdminSignupLoading}
                excludeUserIds={signedUpUserIds}
            />
        </>
    );
}
