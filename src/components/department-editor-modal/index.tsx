import { FC, useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { Department } from '../../core/pmp-sdk/types';

export type DepartmentFormData = {
    name: string;
}

export type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (departmentData: DepartmentFormData) => void;
    department: Department;
    isLoading?: boolean;
    isReadOnly?: boolean;
}

export const DepartmentEditorModal: FC<Props> = ({
    isOpen,
    onClose,
    onSubmit,
    department,
    isLoading = false,
    isReadOnly = false
}) => {
    const [formData, setFormData] = useState<DepartmentFormData>({
        name: ''
    });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Create unique key for localStorage based on department ID
    const storageKey = `department_draft_${department.id}`;

    // Check if current form data differs from original department data
    useEffect(() => {
        const originalData: DepartmentFormData = {
            name: department.name
        };

        const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
        setHasUnsavedChanges(hasChanges);
    }, [formData, department]);

    // Load department data or saved draft on component mount and when modal opens
    useEffect(() => {
        if (isOpen) {
            if (!isReadOnly) {
                // First try to load saved draft
                try {
                    const savedDraft = localStorage.getItem(storageKey);
                    if (savedDraft) {
                        setFormData(JSON.parse(savedDraft));
                    } else {
                        // Use original department data if no draft exists
                        setFormData({
                            name: department.name
                        });
                    }
                } catch (error) {
                    console.warn('Could not load saved draft:', error);
                    // Fallback to original department data
                    setFormData({
                        name: department.name
                    });
                }
            } else {
                // In read-only mode, always use original department data
                setFormData({
                    name: department.name
                });
            }

            // Focus name input when modal opens (only if not read-only)
            if (!isReadOnly) {
                setTimeout(() => {
                    nameInputRef.current?.focus();
                }, 100);
            }
        }
    }, [isOpen, storageKey, department, isReadOnly]);

    // Auto-save draft while typing (debounced) - only if not read-only
    useEffect(() => {
        if (!isOpen || isReadOnly || !formData.name.trim()) return;

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

        if (!isReadOnly && hasUnsavedChanges && formData.name.trim()) {
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
            // Revert to original department data
            const originalData: DepartmentFormData = {
                name: department.name
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

    const handleInputChange = (value: string) => {
        if (!isReadOnly) {
            setFormData(prev => ({
                ...prev,
                name: value
            }));
        }
    };

    if (!isOpen) return null;

    const isNewDepartment = department.id === 0;
    const modalTitle = isReadOnly
        ? `Pregled odjela - ${department.name}`
        : isNewDepartment
            ? 'Dodaj novi odjel'
            : `Uredi odjel - ${department.name}`;

    const submitButtonText = isNewDepartment ? 'Stvori odjel' : 'Spremi promjene';

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        {modalTitle}
                    </h3>
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
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="name">
                                Naziv odjela *
                            </label>
                            <input
                                ref={nameInputRef}
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange(e.target.value)}
                                className={styles.formInput}
                                disabled={isLoading}
                                readOnly={isReadOnly}
                                required
                                placeholder="Unesite naziv odjela..."
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
                                disabled={!hasUnsavedChanges || isLoading || !formData.name.trim()}
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
