import { FC, useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

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

export type UserFormData = {
    name: string;
    email: string;
    phone: string;
    role: "admin" | "user";
    seniority: "junior" | "senior";
    status: "active" | "inactive";
}

export type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: UserFormData) => void;
    user: User;
    isLoading?: boolean;
    isReadOnly?: boolean;
}

export const UserEditorModal: FC<Props> = ({
                                               isOpen,
                                               onClose,
                                               onSubmit,
                                               user,
                                               isLoading = false,
                                               isReadOnly = false
                                           }) => {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        seniority: 'junior',
        status: 'active'
    });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Create unique key for localStorage based on user ID
    const storageKey = `user_draft_${user.id}`;

    // Check if current form data differs from original user data
    useEffect(() => {
        const originalData: UserFormData = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            seniority: user.seniority,
            status: user.status
        };

        const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
        setHasUnsavedChanges(hasChanges);
    }, [formData, user]);

    // Load user data or saved draft on component mount and when modal opens
    useEffect(() => {
        if (isOpen) {
            if (!isReadOnly) {
                // First try to load saved draft
                try {
                    const savedDraft = localStorage.getItem(storageKey);
                    if (savedDraft) {
                        setFormData(JSON.parse(savedDraft));
                    } else {
                        // Use original user data if no draft exists
                        setFormData({
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            role: user.role,
                            seniority: user.seniority,
                            status: user.status
                        });
                    }
                } catch (error) {
                    console.warn('Could not load saved draft:', error);
                    // Fallback to original user data
                    setFormData({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                        seniority: user.seniority,
                        status: user.status
                    });
                }
            } else {
                // In read-only mode, always use original user data
                setFormData({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    seniority: user.seniority,
                    status: user.status
                });
            }

            // Focus name input when modal opens (only if not read-only)
            if (!isReadOnly) {
                setTimeout(() => {
                    nameInputRef.current?.focus();
                }, 100);
            }
        }
    }, [isOpen, storageKey, user, isReadOnly]);

    // Auto-save draft while typing (debounced) - only if not read-only
    useEffect(() => {
        if (!isOpen || isReadOnly) return;

        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(formData));
            } catch (error) {
                console.warn('Could not save draft:', error);
            }
        }, 1000); // Save after 1 second of no typing

        return () => clearTimeout(timeoutId);
    }, [formData, storageKey, isOpen, isReadOnly]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!isReadOnly && hasUnsavedChanges) {
            onSubmit(formData);
            // Clear saved draft after successful submission
            try {
                localStorage.removeItem(storageKey);
            } catch (error) {
                console.warn('Could not clear draft:', error);
            }
        }
    };

    // Handle "Odustani" button - reverts to original data
    const handleCancel = () => {
        if (!isReadOnly) {
            // Revert to original user data
            const originalData: UserFormData = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                seniority: user.seniority,
                status: user.status
            };
            setFormData(originalData);

            // Clear any saved draft since we're reverting
            try {
                localStorage.removeItem(storageKey);
            } catch (error) {
                console.warn('Could not clear draft:', error);
            }
        }
        onClose();
    };

    // Handle close (X button, overlay click) - preserves draft
    const handleClose = () => {
        onClose();
        // Don't reset form data when closing - preserve the draft
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (isReadOnly) return;

        // Submit with Ctrl/Cmd + Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
        // Close with Escape - preserves draft
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    const handleInputChange = (field: keyof UserFormData, value: string) => {
        if (!isReadOnly) {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    if (!isOpen) return null;

    const modalTitle = isReadOnly
        ? `Pregled korisnika - ${user.name}`
        : `Uredi korisnika - ${user.name}`;

    const submitButtonText = 'Spremi promjene';

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        {modalTitle}
                    </h3>
                    <span className={styles.modalDate}>
                        Registriran: {new Date(user.created_at).toLocaleDateString('hr-HR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    </span>
                    <button
                        onClick={handleClose}
                        className={styles.closeButton}
                        type="button"
                        aria-label="Zatvori"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                    <div className={styles.modalBody}>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="name">
                                    Ime i prezime *
                                </label>
                                <input
                                    ref={nameInputRef}
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={styles.formInput}
                                    disabled={isLoading}
                                    readOnly={isReadOnly}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="email">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={styles.formInput}
                                    disabled={isLoading}
                                    readOnly={isReadOnly}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="phone">
                                    Telefon
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={styles.formInput}
                                    disabled={isLoading}
                                    readOnly={isReadOnly}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="role">
                                    Uloga *
                                </label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => handleInputChange('role', e.target.value as UserFormData['role'])}
                                    className={styles.formSelect}
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="user">Korisnik</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="seniority">
                                    Staž *
                                </label>
                                <select
                                    id="seniority"
                                    value={formData.seniority}
                                    onChange={(e) => handleInputChange('seniority', e.target.value as UserFormData['seniority'])}
                                    className={styles.formSelect}
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="junior">Junior</option>
                                    <option value="senior">Senior</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="status">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value as UserFormData['status'])}
                                    className={styles.formSelect}
                                    disabled={isLoading}
                                    required
                                >
                                    <option value="active">Aktivan</option>
                                    <option value="inactive">Neaktivan</option>
                                </select>
                            </div>
                        </div>

                        {hasUnsavedChanges && !isReadOnly && (
                            <div className={styles.unsavedIndicator}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" opacity="0.3"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                <span>Imate nespremljene promjene</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            onClick={handleCancel}
                            className={styles.cancelButton}
                            type="button"
                            disabled={isLoading}
                        >
                            {isReadOnly ? 'Zatvori' : 'Odustani'}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                className={`${styles.submitButton} ${hasUnsavedChanges ? styles.hasChanges : ''}`}
                                disabled={!hasUnsavedChanges || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        Spremam...
                                    </>
                                ) : (
                                    submitButtonText
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
