import { FC, useState, KeyboardEvent } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { UserEditorModal, UserFormData } from '../user-editor-modal';

// User type based on your JSON structure
export type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "user";
    seniority: "junior" | "senior";
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export type Props = {
    user: User;
    onChange?: () => void;
}

export const MinimalUserCard: FC<Props> = ({
                                               user,
                                               onChange
                                           }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleExpand();
        }
    };

    const getSeniorityLabel = (seniority: string) => {
        switch (seniority) {
            case 'junior': return 'J';
            case 'mid': return 'M';
            case 'senior': return 'S';
            default: return seniority.charAt(0).toUpperCase();
        }
    };

    const createdDate = new Date(user.created_at);

    const handleEditUser = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card from collapsing when clicking edit
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleSaveUser = async (updatedUserData: UserFormData) => {
        setIsLoading(true);

        try {
            // TODO: Implement API call to update user
            console.log('Updating user:', user.id, updatedUserData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Call onChange to refresh data when backend is ready
            if (onChange) {
                onChange();
            }

            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
            // TODO: Show error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div
                className={clsx(
                    styles.card,
                    styles.clickableCard,
                    user.status === 'inactive' && styles.inactiveCard
                )}
                onClick={toggleExpand}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-label={`${user.name} user card. Click to ${isExpanded ? 'collapse' : 'expand'}`}
            >
                <div className={styles.cardHeader}>
                    <div className={styles.dateInfo}>
                        <span>
                            ({getSeniorityLabel(user.seniority)}) {user.name}
                        </span>
                    </div>
                    <div className={styles.badgeContainer}>
                        <div className={
                            user.status === 'active'
                                ? styles.availableBadge
                                : styles.unavailableBadge
                        }>
                            <span>
                                {user.status === 'active'
                                    ? 'AKTIVAN'
                                    : 'NEAKTIVAN'
                                }
                            </span>
                        </div>
                    </div>
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
                        <div className={styles.descriptionSection}>
                            <div className={styles.sectionHeader}>
                                <h4 className={styles.descriptionTitle}>Informacije o korisniku</h4>
                                <button
                                    className={styles.editButton}
                                    onClick={handleEditUser}
                                    type="button"
                                    title="Uredi korisnika"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.userDetailsTable}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Email</span>
                                    <span className={styles.detailValue}>
                                        {user.email || 'Nema email'}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Telefon</span>
                                    <span className={styles.detailValue}>
                                        {user.phone || 'Nema telefon'}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Uloga</span>
                                    <span className={styles.detailValue}>{user.role}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Staž</span>
                                    <span className={styles.detailValue}>{user.seniority}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Registriran</span>
                                    <span className={styles.detailValue}>
                                        {createdDate.toLocaleDateString('hr-HR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Status</span>
                                    <span className={styles.detailValue}>
                                        <span className={clsx(
                                            styles.statusBadge,
                                            user.status === 'active' ? styles.statusActive : styles.statusInactive
                                        )}>
                                            {user.status === 'active' ? 'Aktivan' : 'Neaktivan'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit User Modal - Rendered outside the card like ReportEditorModal */}
            {isEditModalOpen && (
                <UserEditorModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSubmit={handleSaveUser}
                    user={user}
                    isLoading={isLoading}
                    isReadOnly={false}
                />
            )}
        </>
    );
};
