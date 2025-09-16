import { FC, useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

export type Activity = {
    id: number;
    title: string;
    description: string;
    date: string;
    limit?: number;
    users: any[];
    created_at?: string;
    updated_at?: string;
}

export type ActivityFormData = {
    title: string;
    description: string;
    date: string;
    limit: number | '';
}

export type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (activityData: ActivityFormData) => void;
    activity: Activity;
    isLoading?: boolean;
    isReadOnly?: boolean;
}

export const ActivityEditorModal: FC<Props> = ({
    isOpen,
    onClose,
    onSubmit,
    activity,
    isLoading = false,
    isReadOnly = false
}) => {
    const [formData, setFormData] = useState<ActivityFormData>({
        title: '',
        description: '',
        date: '',
        limit: ''
    });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Create unique key for localStorage based on activity ID
    const storageKey = `activity_draft_${activity.id}`;

    // Check if current form data differs from original activity data
    useEffect(() => {
        const originalData: ActivityFormData = {
            title: activity.title,
            description: activity.description,
            date: activity.date,
            limit: activity.limit || ''
        };

        const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
        setHasUnsavedChanges(hasChanges);
    }, [formData, activity]);

    // Load activity data or saved draft on component mount and when modal opens
    useEffect(() => {
        if (isOpen) {
            if (!isReadOnly) {
                // First try to load saved draft
                try {
                    const savedDraft = localStorage.getItem(storageKey);
                    if (savedDraft) {
                        setFormData(JSON.parse(savedDraft));
                    } else {
                        // Use original activity data if no draft exists
                        setFormData({
                            title: activity.title,
                            description: activity.description,
                            date: activity.date,
                            limit: activity.limit || ''
                        });
                    }
                } catch (error) {
                    console.warn('Could not load saved draft:', error);
                    // Fallback to original activity data
                    setFormData({
                        title: activity.title,
                        description: activity.description,
                        date: activity.date,
                        limit: activity.limit || ''
                    });
                }
            } else {
                // In read-only mode, always use original activity data
                setFormData({
                    title: activity.title,
                    description: activity.description,
                    date: activity.date,
                    limit: activity.limit || ''
                });
            }

            // Focus title input when modal opens (only if not read-only)
            if (!isReadOnly) {
                setTimeout(() => {
                    titleInputRef.current?.focus();
                }, 100);
            }
        }
    }, [isOpen, storageKey, activity, isReadOnly]);

    // Auto-save draft while typing (debounced) - only if not read-only
    useEffect(() => {
        if (!isOpen || isReadOnly || (!formData.title.trim() && !formData.description.trim())) return;

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

        if (!isReadOnly && hasUnsavedChanges && formData.title.trim() && formData.description.trim() && formData.date) {
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
            // Revert to original activity data
            const originalData: ActivityFormData = {
                title: activity.title,
                description: activity.description,
                date: activity.date,
                limit: activity.limit || ''
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

    const handleInputChange = (field: keyof ActivityFormData, value: string | number) => {
        if (!isReadOnly) {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleLimitChange = (value: string) => {
        if (!isReadOnly) {
            // Allow empty string or valid positive numbers
            const numValue = value === '' ? 100 : parseInt(value, 10);
            if (value === '' || (!isNaN(numValue) && numValue > 0)) {
                handleInputChange('limit', numValue);
            }
        }
    };

    if (!isOpen) return null;

    const isNewActivity = activity.id === 0;
    const modalTitle = isReadOnly
        ? `Pregled događaja - ${activity.title}`
        : isNewActivity
            ? 'Dodaj novi događaj'
            : `Uredi događaj - ${activity.title}`;

    const submitButtonText = isNewActivity ? 'Stvori događaj' : 'Spremi promjene';

    // Format date for display
    const activityDate = activity.date ? new Date(activity.date) : new Date();

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        {modalTitle}
                    </h3>
                    <span className={styles.modalDate}>
                        {activity.id === 0 ?
                            'Novi događaj' :
                            `Datum: ${activityDate.toLocaleDateString('hr-HR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}`
                        }
                    </span>
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
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="title">
                                    Naziv događaja *
                                </label>
                                <input
                                    ref={titleInputRef}
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={styles.formInput}
                                    disabled={isLoading}
                                    readOnly={isReadOnly}
                                    required
                                    placeholder="Unesite naziv događaja..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="date">
                                    Datum događaja *
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className={styles.formInput}
                                    disabled={isLoading}
                                    readOnly={isReadOnly}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="limit">
                                    Maksimalni broj sudionika
                                </label>
                                <input
                                    id="limit"
                                    type="number"
                                    value={formData.limit}
                                    onChange={(e) => handleLimitChange(e.target.value)}
                                    className={styles.formInput}
                                    disabled={isLoading}
                                    readOnly={isReadOnly}
                                    min="1"
                                    placeholder="Bez ograničenja"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="description">
                                Opis događaja *
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className={styles.formTextarea}
                                disabled={isLoading}
                                readOnly={isReadOnly}
                                required
                                placeholder="Unesite opis događaja..."
                                rows={4}
                            />
                        </div>

                        {hasUnsavedChanges && !isReadOnly && (
                            <div className={styles.unsavedIndicator}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" opacity="0.3" />
                                    <circle cx="12" cy="12" r="3" />
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
                                disabled={!hasUnsavedChanges || isLoading || !formData.title.trim() || !formData.description.trim() || !formData.date}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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