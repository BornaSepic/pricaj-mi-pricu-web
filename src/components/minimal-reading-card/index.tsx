import { FC, useState, KeyboardEvent } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { Department, Reading } from '../../core/pmp-sdk/types';
import { pmpSdk } from '../../core/pmp-sdk';
import { useQueryClient } from '@tanstack/react-query';
import { ReportEditorModal } from '../report-editor-modal';
import { useToast } from '../../hooks/useToast';

export type Props = {
    department: Department;
    date: string;
    readings: Reading[];
    timeframe: "past" | "future";
    onChange?: () => void;
}

export const MAX_READINGS_COUNT = 3 as const;

export const MinimalReadingCard: FC<Props> = ({
    department,
    date: dateAsString,
    readings,
    timeframe,
    onChange
}) => {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    const toast = useToast();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const [selectedReadingForReport, setSelectedReadingForReport] = useState<Reading | null>(null);

    const date = new Date(dateAsString);
    const isPast = timeframe === 'past';

    // Check if current user has a reading without a report
    const currentUserReading = readings.find(reading =>
        reading.user && user && reading.user.id === user.id
    );
    const showNoReportBadge = isPast && currentUserReading && !currentUserReading.report;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleExpand();
        }
    };

    const handleCancelingReading = (e: React.MouseEvent) => {
        const readingToCancel = readings.find(reading => {
            return reading.user && user && reading.user.id === user.id;
        });

        if (!readingToCancel) {
            return;
        }

        setIsLoading(true);

        pmpSdk.deleteReading(readingToCancel.id)
            .then(() => {
                setIsLoading(false);
                if (onChange) {
                    onChange();
                }
                toast.success('Uspješno ste se odjavili s čitanja');
                queryClient.invalidateQueries({ queryKey: ['get-future-readings'] })
            })
            .catch((error) => {
                const errorMessage = error?.message || 'Greška pri odjavi';
                toast.error(errorMessage);
                setIsLoading(false);
            });
    }

    const openReportModal = (reading: Reading) => {
        setSelectedReadingForReport(reading);
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedReadingForReport(null);
    };

    const handleSubmitReport = async (reportText: string) => {
        if (!selectedReadingForReport) {
            toast.error('Nije pronađeno čitanje za ovaj datum');
            return;
        }

        setIsSubmittingReport(true);

        try {
            // Check if report already exists (for editing)
            if (selectedReadingForReport.report) {
                await pmpSdk.updateReport({
                    id: selectedReadingForReport.report.id,
                    title: 'title',
                    description: reportText
                });
                toast.success('Izvješće je uspješno ažurirano');
                setIsReportModalOpen(false);
                setSelectedReadingForReport(null);
                if (onChange) {
                    onChange();
                }
                await queryClient.invalidateQueries({ queryKey: ['get-reports'] });
                return;
            } else {
                // Create new report
                await pmpSdk.createReport({
                    title: 'title',
                    description: reportText,
                    readingId: selectedReadingForReport.id
                });
            }

            toast.success('Izvješće je uspješno poslano');
            setIsReportModalOpen(false);
            setSelectedReadingForReport(null);

            if (onChange) {
                onChange();
            }

            await queryClient.invalidateQueries({ queryKey: ['get-reports'] });

        } catch (error: unknown) {
            if (error instanceof Error) {
                const errorMessage = error?.message || 'Greška pri slanju izvješća';
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmittingReport(false);
        }
    }

    const getReportButtonText = (reading: Reading) => {
        const isCurrentUser = reading.user && reading.user.id === user?.id;
        const hasReport = reading.report != null;

        if (isCurrentUser) {
            return hasReport ? 'UREDI' : 'DODAJ';
        } else {
            return hasReport ? 'ČITAJ' : 'NEMA';
        }
    };

    const getReportButtonIcon = (reading: Reading) => {
        const isCurrentUser = reading.user && reading.user.id === user?.id;
        const hasReport = reading.report != null;

        if (isCurrentUser && hasReport) {
            // Edit icon
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
            );
        } else if (isCurrentUser && !hasReport) {
            // Add icon
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
            );
        } else if (!isCurrentUser && hasReport) {
            // Read icon
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
            );
        } else {
            // No report icon
            return (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
            );
        }
    };

    return (
        <>
            <div
                className={clsx(styles.card, styles.clickableCard)}
                onClick={toggleExpand}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-label={`${department.name} reading for ${date.toLocaleDateString('hr-HR')}. Click to ${isExpanded ? 'collapse' : 'expand'}`}
            >
                <div className={styles.cardHeader}>
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
                    <div className={styles.badgeContainer}>
                        {showNoReportBadge && (
                            <div className={styles.unavailableBadge}>
                                <span>NEMA IZVJEŠĆA</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.department}>{department.name}</div>
                    <button
                        className={styles.toggleButton}
                        type="button"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={clsx(styles.rotateIcon, isExpanded && styles.rotateIcon__rotated)}>
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {isExpanded && (
                    <div className={styles.expandedContent} onClick={e => e.stopPropagation()}>
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
                                const isCurrentUser = reading.user && reading.user.id === user?.id;
                                const hasReport = reading.report != null;
                                const canInteractWithReport = isPast && (isCurrentUser || hasReport);

                                if (!user) {
                                    return null;
                                }

                                return (
                                    <div key={index} className={styles.userSlot}>
                                        <div className={styles.userInfo}>
                                            <p>
                                                {index + 1}. ({user.seniority === 'junior' ? 'J' : 'S'}) {user.name}
                                            </p>
                                        </div>
                                        {canInteractWithReport && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openReportModal(reading);
                                                }}
                                                className={clsx(
                                                    styles.reportButton,
                                                    !hasReport && !isCurrentUser && styles.reportButtonDisabled
                                                )}
                                                type="button"
                                                disabled={!hasReport && !isCurrentUser}
                                            >
                                                {getReportButtonText(reading)}
                                                {getReportButtonIcon(reading)}
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {!isPast && (
                            <div className={styles.buttonContainer}>
                                <button
                                    onClick={handleCancelingReading}
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
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Report Modal */}
            {selectedReadingForReport && selectedReadingForReport.user && (
                <ReportEditorModal
                    isOpen={isReportModalOpen}
                    onClose={closeReportModal}
                    onSubmit={handleSubmitReport}
                    departmentName={department.name}
                    date={dateAsString}
                    isLoading={isSubmittingReport}
                    readingId={selectedReadingForReport.id}
                    userId={selectedReadingForReport.user.id}
                    userName={selectedReadingForReport.user.name}
                    existingReport={selectedReadingForReport.report?.description}
                    isReadOnly={selectedReadingForReport.user.id !== user?.id}
                />
            )}
        </>
    );
}
