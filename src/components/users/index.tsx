'use client'

import { FC } from 'react';
import styles from './styles.module.css';
import { MinimalUserCard } from "../minimal-user-card";
import { useQuery } from '@tanstack/react-query';
import { pmpSdk } from '../../core/pmp-sdk';
import Link from "next/link";
import {UserData} from "../../core/pmp-sdk/types";

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

    // Show only first 5-6 users on homepage, sorted by name
    const displayUsers = users
        .filter((user): user is UserData => user !== null && user !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 6);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <Link href="/users">
                        Korisnici
                    </Link>
                </h2>
            </div>

            <div className={styles.cardContent}>
                {displayUsers.map((user) => {
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
                {users.length > 6 && (
                    <div className={styles.showMoreLink}>
                        <Link href="/users">
                            Prikaži sve korisnike ({users.length})
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
