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

    const date = new Date(dateAsString);
    const isPast = timeframe === 'past';

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
        const readingToCancel = readings.find(reading => reading.user.id === user?.id);

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

    const openReportModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
    };

    const currentUserReading = readings.find(reading => reading.user.id === user?.id);
    const hasSubmittedReport = currentUserReading?.report != null;

    const handleSubmitReport = async (reportText: string) => {

        const currentUserReading = readings.find(reading => reading.user.id === user?.id);

        if (!currentUserReading) {
            toast.error('Nije pronađeno vaše čitanje za ovaj datum');
            return;
        }

        // TODO should be able to modify report

        setIsSubmittingReport(true);

        try {
            await pmpSdk.createReport({
                id: 111,
                title: 'title',
                description: reportText,
                readingId: currentUserReading.id
            });

            toast.success('Izvješće je uspješno poslano');
            setIsReportModalOpen(false);

            if (onChange) {
                onChange();
            }

            await queryClient.invalidateQueries({queryKey: ['get-reports']});

        } catch (error: any) {
            const errorMessage = error?.message || 'Greška pri slanju izvješća';
            toast.error(errorMessage);
        } finally {
            setIsSubmittingReport(false);
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
                            {!isPast ? (
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
                            ) : (
                                <button
                                    onClick={openReportModal}
                                    className={styles.registerButton}
                                    type="button"
                                >
                                    IZVJEŠĆE
                                    <svg className={styles.notepadIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Report Modal */}
            <ReportEditorModal
                isOpen={isReportModalOpen}
                onClose={closeReportModal}
                onSubmit={handleSubmitReport}
                departmentName={department.name}
                date={dateAsString}
                isLoading={isSubmittingReport}
            />
        </>
    );
}
