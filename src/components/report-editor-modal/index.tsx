import { FC, useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

export type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reportText: string) => void;
    departmentName: string;
    date: string;
    isLoading?: boolean;
}

export const ReportEditorModal: FC<Props> = ({
     isOpen,
     onClose,
     onSubmit,
     departmentName,
     date,
     isLoading = false
 }) => {
    const [reportText, setReportText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Create unique key for localStorage based on department and date
    const storageKey = `report_draft_${departmentName}_${date}`;

    // Load saved draft on component mount and when modal opens
    useEffect(() => {
        if (isOpen) {
            try {
                const savedDraft = localStorage.getItem(storageKey);
                if (savedDraft) {
                    setReportText(savedDraft);
                }
            } catch (error) {
                console.warn('Could not load saved draft:', error);
            }

            // Focus textarea when modal opens
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isOpen, storageKey]);

    // Auto-save draft while typing (debounced)
    useEffect(() => {
        if (!isOpen || !reportText.trim()) return;

        const timeoutId = setTimeout(() => {
            try {
                localStorage.setItem(storageKey, reportText);
            } catch (error) {
                console.warn('Could not save draft:', error);
            }
        }, 1000); // Save after 1 second of no typing

        return () => clearTimeout(timeoutId);
    }, [reportText, storageKey, isOpen]);

    const handleSubmit = () => {
        if (reportText.trim()) {
            onSubmit(reportText.trim());
            // Clear saved draft after successful submission
            try {
                localStorage.removeItem(storageKey);
            } catch (error) {
                console.warn('Could not clear draft:', error);
            }
            setReportText('');
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Submit with Ctrl/Cmd + Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
        // Close with Escape
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        Izvješće - {departmentName}
                    </h3>
                    <span className={styles.modalDate}>
                        {new Date(date).toLocaleDateString('hr-HR', {
                            weekday: 'long',
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

                <div className={styles.modalBody}>
                    <textarea
                        ref={textareaRef}
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Napišite izvješće o čitanju..."
                        className={styles.reportTextarea}
                        rows={12}
                        disabled={isLoading}
                    />
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
                    <button
                        onClick={handleSubmit}
                        className={styles.submitButton}
                        type="button"
                        disabled={!reportText.trim() || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Šalje se...
                            </>
                        ) : (
                            'Pošalji izvješće'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
