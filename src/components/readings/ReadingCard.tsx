import { useState } from 'react';
import styles from './ReadingCard.module.css';

interface ReadingCardProps {
    date: string;
    dayOfWeek: string;
    slotNumber: number;
    totalSlots: number;
    department: string;
    isAvailable: boolean;
    registeredUsers?: string[];
    buttonLabel?: string;
    onRegister?: () => void;
}

export default function ReadingCard({
                                        date,
                                        dayOfWeek,
                                        slotNumber,
                                        totalSlots,
                                        department,
                                        isAvailable,
                                        registeredUsers = [],
                                        buttonLabel = "UPISI ME",
                                        onRegister
                                    }: ReadingCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleRegister = () => {
        if (onRegister && isAvailable) {
            onRegister();
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.dateInfo}>{date}. ({dayOfWeek})</div>
                    <div className={styles.slotInfo}>{slotNumber}/{totalSlots}</div>
                    <div className={styles.department}>{department}</div>
                </div>

                <button
                    onClick={handleToggle}
                    className={styles.toggleButton}
                    type="button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isExpanded ? styles.rotateIcon : ''}>
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            <div className={styles.badgeContainer}>
                <div className={isAvailable ? styles.availableBadge : styles.unavailableBadge}>
                    {isAvailable ? 'SLOBODNO' : 'ZAUZETO'}
                </div>
            </div>

            {isExpanded && (
                <div className={styles.expandedContent}>
                    <div className={styles.usersList}>
                        {Array.from({ length: totalSlots }).map((_, index) => (
                            <div key={index} className={styles.userSlot}>
                                <p>
                                    {index + 1}. {registeredUsers[index] ? `(J) ${registeredUsers[index]}` : ''}
                                </p>
                            </div>
                        ))}
                    </div>

                    {isAvailable && (
                        <div className={styles.buttonContainer}>
                            <button
                                onClick={handleRegister}
                                className={styles.registerButton}
                                type="button"
                            >
                                {buttonLabel}
                                <svg className={styles.penIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.586 2.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM13.379 4.793L3 15.172V18h2.828l10.379-10.379-2.828-2.828z"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
