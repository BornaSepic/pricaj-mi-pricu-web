'use client'

import { FC, useMemo, useState } from 'react';
import styles from './styles.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { capitalizeWord } from '../../core/string/capitalize-word';
import { pmpSdk } from '../../core/pmp-sdk';

const HOURS_PER_READING = 3;

export const Hours: FC = () => {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());

    // Get current date to compare with selected date
    const currentDate = new Date();

    // Check if selected month is current month
    const isCurrentMonth = date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();

    const startOfMonth = new Date(date.getFullYear(), date.getMonth());
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const { data: allReadings } = useQuery({
        queryKey: [`get-all-readings`],
        queryFn: () => pmpSdk.getReadingsForTimeframe(
            new Date(2023, 0, 1),
            new Date(2030, 11, 31)
        ),
        placeholderData: (prev) => prev || []
    })

    const { data: readingsForTimeframe } = useQuery({
        queryKey: [`get-readings-for-timeframe`, date],
        queryFn: () => pmpSdk.getReadingsForTimeframe(startOfMonth, endOfMonth),
        placeholderData: (prev) => prev || []
    })

    const selectPreviousMonth = () => {
        const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        setDate(previousMonth);
    }

    const selectNextMonth = () => {
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setDate(nextMonth);
    }

    const totalHoursForTimeframe = readingsForTimeframe ? readingsForTimeframe.reduce((acc, reading) => {
        const readingForUser = reading.readings.find(reading => {
            return user && reading.user && user.id === reading.user.id;
        });
        if (readingForUser && readingForUser.report) {
            return acc + HOURS_PER_READING;
        }

        return acc;
    }, 0) : 0

    const totalHours = useMemo(() => {
        if (!allReadings) {
            return 0;
        }

        return allReadings.reduce((acc, reading) => {
            const readingForUser = reading.readings.find(reading => {
                return user && reading.user && user.id === reading.user.id
            });
            if (readingForUser && readingForUser.report) {
                return acc + HOURS_PER_READING;
            }

            return acc;
        }, 0);
    }, [allReadings]);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Moji sati</h2>

                <div className={styles.monthSelector}>
                    <button
                        onClick={selectPreviousMonth}
                        className={styles.monthSelector__button}
                    >
                        <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_4_171)">
                                <path d="M0.283594 8.70626C-0.107031 8.31563 -0.107031 7.68126 0.283594 7.29063L6.28359 1.29063C6.67422 0.900005 7.30859 0.900005 7.69922 1.29063C8.08984 1.68126 8.08984 2.31563 7.69922 2.70626L2.40547 8.00001L7.69609 13.2938C8.08672 13.6844 8.08672 14.3188 7.69609 14.7094C7.30547 15.1 6.67109 15.1 6.28047 14.7094L0.280468 8.70938L0.283594 8.70626Z" fill="#563327" />
                            </g>
                            <defs>
                                <clipPath id="clip0_4_171">
                                    <rect width="16.0047" height="8.00156" rx="4.00078" transform="matrix(0 -1 -1 0 7.99219 16.0023)" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <span className={styles.monthSelector__label}>
                        {capitalizeWord(date.toLocaleString('hr-HR', { month: 'long' }))} {date.getFullYear()}.
                    </span>
                    {!isCurrentMonth && (
                        <button
                            onClick={selectNextMonth}
                            className={styles.monthSelector__button}
                        >
                            <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_4_174)">
                                    <path d="M7.70704 8.70626C8.09766 8.31563 8.09766 7.68126 7.70704 7.29063L1.70704 1.29063C1.31641 0.900005 0.682037 0.900005 0.291412 1.29063C-0.0992126 1.68126 -0.0992126 2.31563 0.291412 2.70626L5.58516 8.00001L0.294537 13.2938C-0.0960879 13.6844 -0.0960879 14.3188 0.294537 14.7094C0.685162 15.1 1.31954 15.1 1.71016 14.7094L7.71016 8.70938L7.70704 8.70626Z" fill="#563327" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_4_174">
                                        <rect x="-0.0015564" y="16.0023" width="16.0047" height="8.00156" rx="4.00078" transform="rotate(-90 -0.0015564 16.0023)" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    )}
                    {isCurrentMonth && (
                        <div className={styles.monthSelector__button} style={{ visibility: 'hidden' }}>
                            {/* Empty space to maintain layout */}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.cardContent}>
                <p className={styles.cardContent__currentMonth}>{capitalizeWord(date.toLocaleString('hr-HR', { month: 'long' }))}: {totalHoursForTimeframe} sat(a/i)</p>

                <p className={styles.cardContent__total}>
                    Ukupno: {totalHours} sat(a/i)
                </p>
            </div>
        </div>
    );
}
