import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './styles.module.css';
import { pmpSdk } from '../../core/pmp-sdk';
import { User, UserData } from '../../core/pmp-sdk/types';

export type Props = {
    isOpen: boolean;
    onClose: () => void;
    onUserSelect: (userId: number) => void;
    date: string;
    departmentName: string;
    isLoading?: boolean;
    excludeUserIds?: number[]; // Users already signed up for this reading
}

export const AdminUserSelectionModal: FC<Props> = ({
                                                       isOpen,
                                                       onClose,
                                                       onUserSelect,
                                                       date,
                                                       departmentName,
                                                       isLoading = false,
                                                       excludeUserIds = []
                                                   }) => {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const { data: allUsers } = useQuery({
        queryKey: ['get-users'],
        queryFn: () => pmpSdk.getUsers(),
        placeholderData: (prev) => prev || [],
        enabled: isOpen // Only fetch when modal is open
    });

    // Filter to only show active users who aren't already signed up
    const availableUsers = (allUsers || []).filter((user): user is UserData =>
        user !== null &&
        user !== undefined &&
        user.status === 'active' &&
        !excludeUserIds.includes(user.id)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserId) {
            onUserSelect(selectedUserId);
            setSelectedUserId(null); // Reset selection
        }
    };

    const handleClose = () => {
        setSelectedUserId(null); // Reset selection on close
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit with Enter when a user is selected
        if (e.key === 'Enter' && selectedUserId) {
            e.preventDefault();
            handleSubmit(e);
        }
        // Close with Escape
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const formattedDate = new Date(date).toLocaleDateString('hr-HR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
    });

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        Upiši korisnika na čitanje
                    </h3>
                    <div className={styles.modalDate}>
                        {departmentName} • {formattedDate}
                    </div>
                    <button
                        onClick={handleClose}
                        className={styles.closeButton}
                        type="button"
                        aria-label="Zatvori"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                    <div className={styles.modalBody}>
                        {availableUsers.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>Nema dostupnih korisnika za upis.</p>
                                <p className={styles.emptyStateSubtext}>
                                    Svi aktivni korisnici su već upisani ili nema aktivnih korisnika.
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className={styles.instructionText}>
                                    Odaberite korisnika kojeg želite upisati na čitanje:
                                </p>
                                <div className={styles.usersList}>
                                    {availableUsers.map((user) => (
                                        <label
                                            key={user.id}
                                            className={`${styles.userItem} ${selectedUserId === user.id ? styles.userItemSelected : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="selectedUser"
                                                value={user.id}
                                                checked={selectedUserId === user.id}
                                                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                                                className={styles.radioInput}
                                            />
                                            <div className={styles.userInfo}>
                                                <div className={styles.userName}>
                                                    <span className={styles.seniorityBadge}>
                                                        {user.seniority === 'junior' ? 'J' : 'S'}
                                                    </span>
                                                    {user.name}
                                                </div>
                                                <div className={styles.userEmail}>
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div className={styles.radioIndicator}>
                                                <div className={styles.radioCircle}></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            onClick={handleClose}
                            className={styles.cancelButton}
                            type="button"
                            disabled={isLoading}
                        >
                            Odustani
                        </button>
                        {availableUsers.length > 0 && (
                            <button
                                type="submit"
                                className={`${styles.submitButton} ${selectedUserId ? styles.hasSelection : ''}`}
                                disabled={!selectedUserId || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Upisujemo...
                                    </>
                                ) : (
                                    'Upiši korisnika'
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
