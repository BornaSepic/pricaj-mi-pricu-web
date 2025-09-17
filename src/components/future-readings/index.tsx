'use client'

import { FC, useMemo, useState } from 'react';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';
import {MinimalReadingCard} from "../minimal-reading-card";
import { pmpSdk } from '../../core/pmp-sdk';

export const FutureReadings: FC = () => {
    const [currentDate] = useState(new Date());

    const { data: readingsForTimeframe, refetch } = useQuery({
        queryKey: [`get-future-readings`],
        queryFn: () => pmpSdk.getReadingsForTimeframe(currentDate, new Date(2030, 11, 31)),
        placeholderData: (prev) => prev || []
    })

    // Filter readings to exclude today's reading after 8pm
    const filteredReadings = useMemo(() => {
        if (!readingsForTimeframe) return [];

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const isPast8PM = now.getHours() >= 20; // 8 PM = 20:00

        return readingsForTimeframe.filter(groupedReadings => {
            const readingDate = new Date(groupedReadings.date);
            const readingDateOnly = new Date(readingDate.getFullYear(), readingDate.getMonth(), readingDate.getDate());

            // If this reading is from today and it's past 8 PM, exclude it
            if (readingDateOnly.getTime() === today.getTime() && isPast8PM) {
                return false;
            }

            return true;
        });
    }, [readingsForTimeframe]);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Moja čitanja</h2>
            </div>

            <div className={styles.cardContent}>
                {filteredReadings?.map((groupedReadings, index) => {
                    const reading = groupedReadings.readings.find(reading => reading.department);

                    if (!reading) {
                        return null;
                    }

                    return (
                        <MinimalReadingCard
                            key={`${reading.date}-${index}`}
                            department={reading.department}
                            readings={groupedReadings.readings}
                            date={groupedReadings.date}
                            timeframe={"future"}
                            onChange={() => refetch()}
                        />
                    )
                })}
            </div>
        </div>
    );
}
