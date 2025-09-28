'use client'

import { FC, useState } from 'react';
import styles from './styles.module.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pmpSdk } from '../../core/pmp-sdk';
import { useToast } from '../../hooks/useToast';

export const AdminLoginCode: FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [newCode, setNewCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const toast = useToast();

    const { data: currentCode } = useQuery({
        queryKey: ['get-registration-code'],
        queryFn: () => pmpSdk.getRegistrationCode(),
        placeholderData: (prev) => prev || ''
    });

    const handleEditClick = () => {
        setNewCode(currentCode || '');
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewCode('');
    };

    const handleSave = async () => {
        if (!newCode.trim()) {
            toast.error('Kod ne može biti prazan');
            return;
        }

        setIsLoading(true);

        try {
            await pmpSdk.updateRegistrationCode(newCode.trim());
            toast.success('Kod je uspješno ažuriran');
            setIsEditing(false);
            setNewCode('');
            queryClient.invalidateQueries({ queryKey: ['get-registration-code'] });
        } catch (error) {
            // TODO
            // const errorMessage = error?.message || 'Greška pri ažuriranju koda';
            const errorMessage = 'Greška pri ažuriranju koda';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Kod za registraciju</h2>
                {!isEditing && (
                    <button
                        onClick={handleEditClick}
                        className={styles.editButton}
                        disabled={!currentCode}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Uredi
                    </button>
                )}
            </div>

            <div className={styles.cardContent}>
                {isEditing ? (
                    <div className={styles.editContainer}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Novi kod:</label>
                            <input
                                type="text"
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={styles.codeInput}
                                placeholder="Unesite novi kod"
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button
                                onClick={handleCancel}
                                className={styles.cancelButton}
                                disabled={isLoading}
                            >
                                Odustani
                            </button>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                                disabled={isLoading || !newCode.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Spremam...
                                    </>
                                ) : (
                                    'Spremi'
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.displayContainer}>
                        <p className={styles.currentCode}>
                            Trenutni kod: <span className={styles.codeValue}>{currentCode || 'Učitavanje...'}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
