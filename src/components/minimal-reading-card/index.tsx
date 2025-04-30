import { FC, useState, KeyboardEvent } from 'react';
import styles from './styles.module.css';
import { Reading } from '../../core/types/readings';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import type { Department } from '../../core/types/department';

interface Props {
    department: Department;
    date: string;
    readings: Reading[];
    timeframe: "past" | "future";
    category: "reading" | "event"
    onChange?: () => void;
}

export const MAX_READINGS_COUNT = 3 as const;

export const MinimalReadingCard: FC<Props> = ({
    department,
    date: dateAsString,
    readings,
    timeframe,
    category,
    onChange
}) => {
    const { user } = useAuth()

    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const date = new Date(dateAsString);
    const isPast = timeframe === 'past';
    const isEvent = category === 'event';

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
        // Stop event propagation to prevent card expansion when clicking the button
        e.stopPropagation();

        if (!user) {
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        /*cancelReading(dateAsString, department.id, user.id)
            .then(() => {
                setIsLoading(false);

                if(onChange) {
                    onChange();
                }
            })*/
    }

    const submitReport = (e: React.MouseEvent) => {
        // Stop event propagation to prevent card expansion when clicking the button
        e.stopPropagation();

        if (!user) {
            return;
        }
    }

    return (
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
                            weekday: isEvent ? 'short' : 'long'
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
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={submitReport}
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
    );
}
