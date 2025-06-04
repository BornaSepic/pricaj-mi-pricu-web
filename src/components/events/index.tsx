'use client'

import { FC } from 'react';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import { pmpSdk } from '../../core/pmp-sdk';
import { MinimalActivityCard } from "../minimal-activity-card";

export const Events: FC = () => {
    const { data: events, refetch } = useQuery({
        queryKey: [`get-events`],
        queryFn: () => pmpSdk.getEvents(),
        placeholderData: (prev) => prev || []
    })

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <Link href="/events">
                        Događaji
                    </Link>
                </h2>
            </div>

            <div className={styles.cardContent}>
                {events?.map((item) => {
                    return (
                        <MinimalActivityCard
                            key={item.id}
                            activity={item}
                            onChange={() => refetch()}
                        />
                    );
                })}
            </div>
        </div>
    );
}
