'use client'

import { FC, useState, useMemo } from 'react';
import styles from './styles.module.css';
import { MinimalUserCard } from "../minimal-user-card";
import { useQuery } from '@tanstack/react-query';
import { pmpSdk } from '../../core/pmp-sdk';
import { UserData } from '../../core/pmp-sdk/types';

type UserStatus = 'all' | 'active' | 'inactive';
type UserSeniority = 'all' | 'junior' | 'senior';

export const UsersPage: FC = () => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<UserStatus>('all');
    const [seniorityFilter, setSeniorityFilter] = useState<UserSeniority>('all');

    const { data: users, refetch } = useQuery({
        queryKey: ['get-users'],
        queryFn: () => pmpSdk.getUsers(),
        placeholderData: (prev) => prev || []
    });

    // Update the filteredUsers memo to include default sorting by name
    const filteredUsers = useMemo(() => {
        if (!users) return [];

        let filtered = users.filter((user): user is UserData => {
            if (!user) return false;

            // Name/email filter
            if (nameFilter.trim()) {
                const filterLower = nameFilter.toLowerCase().trim();
                const matchesName = user.name.toLowerCase().includes(filterLower);
                const matchesEmail = user.email.toLowerCase().includes(filterLower);
                if (!matchesName && !matchesEmail) return false;
            }

            // Status filter
            if (statusFilter !== 'all' && user.status !== statusFilter) {
                return false;
            }

            // Seniority filter
            if (seniorityFilter !== 'all' && user.seniority !== seniorityFilter) {
                return false;
            }

            return true;
        });

        // Sort by name (A-Z)
        filtered.sort((a, b) => a.name.localeCompare(b.name));

        return filtered;
    }, [users, nameFilter, statusFilter, seniorityFilter]);

    const handleUserChange = () => {
        refetch();
    };

    const clearFilters = () => {
        setNameFilter('');
        setStatusFilter('all');
        setSeniorityFilter('all');
    };

    const hasActiveFilters = nameFilter || statusFilter !== 'all' || seniorityFilter !== 'all';

    if (!users) {
        return null;
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Korisnici</h2>
            </div>

            {/* Filters Section */}
            <div className={styles.filtersSection}>
                {/* Search Input */}
                <div className={styles.searchInputContainer}>
                    <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Pretraži po imenu ili email adresi..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className={styles.searchInput}
                    />
                    {nameFilter && (
                        <button
                            type="button"
                            onClick={() => setNameFilter('')}
                            className={styles.clearFilterButton}
                            aria-label="Obriši pretragu"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Filter Dropdowns */}
                {/*<div className={styles.filtersRow}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="status-filter" className={styles.filterLabel}>
                            Status:
                        </label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Svi statusi</option>
                            <option value="active">Aktivni</option>
                            <option value="inactive">Neaktivni</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="seniority-filter" className={styles.filterLabel}>
                            Senioritet:
                        </label>
                        <select
                            id="seniority-filter"
                            value={seniorityFilter}
                            onChange={(e) => setSeniorityFilter(e.target.value as UserSeniority)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Svi nivoi</option>
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className={styles.clearFiltersButton}
                        >
                            Obriši filtere
                        </button>
                    )}
                </div>*/}

                {/* Results Summary */}
                {/*<div className={styles.resultsInfo}>
                    Prikazano {filteredUsers.length} od ukupno {users.length} korisnika
                    {hasActiveFilters && (
                        <span className={styles.filteringNote}> (filtrirano)</span>
                    )}
                </div>*/}
            </div>

            <div className={styles.cardContent}>
                {filteredUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        {hasActiveFilters ? (
                            <>
                                <p>Nema korisnika koji odgovaraju odabranim kriterijima.</p>
                                <p className={styles.emptyStateSubtext}>
                                    Pokušajte s drugačijim filterima.
                                </p>
                            </>
                        ) : (
                            <p>Nema korisnika za prikaz.</p>
                        )}
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <MinimalUserCard
                            key={user.id}
                            user={user}
                            onChange={handleUserChange}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
