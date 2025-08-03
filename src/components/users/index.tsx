'use client'

import { FC } from 'react';
import styles from './styles.module.css';
import { MinimalUserCard } from "../minimal-user-card";
import { useQuery } from '@tanstack/react-query';
import { pmpSdk } from '../../core/pmp-sdk';

export const Users: FC = () => {
    const { data: users, refetch } = useQuery({
        queryKey: ['get-users'],
        queryFn: () => pmpSdk.getUsers(),
        placeholderData: (prev) => prev || []
    })

    const handleUserChange = () => {
        refetch();
    };

    if (!users) {
        return null
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Korisnici</h2>
            </div>

            <div className={styles.cardContent}>
                {users.map((user) => {
                    if (!user) {
                        return null;
                    }

                    return (
                        <MinimalUserCard
                            key={user.id}
                            user={user}
                            onChange={handleUserChange}
                        />
                    )
                })}
            </div>
        </div>
    );
};
