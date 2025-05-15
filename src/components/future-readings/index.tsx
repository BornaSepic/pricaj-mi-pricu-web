'use client'

import { FC, useState } from 'react';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';
import { getReadingsForTimeframe } from './api/get-readings-for-timeframe';
import { ReadingCard } from '../reading-card';
import {MinimalReadingCard} from "../minimal-reading-card";

interface Props {

}

export const FutureReadings: FC<Props> = () => {
    const [currentDate] = useState(new Date());
    console.log('currentDate', currentDate);

    const { data: readingsForTimeframe } = useQuery({
        queryKey: [`get-future-readings`],
        queryFn: () => getReadingsForTimeframe(currentDate, new Date(2030, 11, 31)),
        placeholderData: (prev) => prev || []
    })

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Moja čitanja</h2>
            </div>

            <div className={styles.cardContent}>
                {readingsForTimeframe?.map((groupedReadings, index) => {
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
                            category={"reading"}
                        />
                    )
                })}
            </div>
        </div>
    );
}
