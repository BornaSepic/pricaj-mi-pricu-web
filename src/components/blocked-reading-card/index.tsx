import { FC } from 'react';
import styles from './styles.module.css';
import { Department } from '../../core/pmp-sdk/types';

export type Props = {
    department: Department;
    date: string;
}

export const MAX_READINGS_COUNT = 3 as const;

export const BlockedReadingCard: FC<Props> = ({
    department,
    date: dateAsString
}) => {
    const date = new Date(dateAsString);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeaderGrid}>
                <div className={styles.dateInfo}>
                    <span>
                        {date.toLocaleDateString('hr-HR', {
                            year: undefined,
                            month: '2-digit',
                            day: '2-digit'
                        })}
                    </span>
                    <span translate="no">
                        ({date.toLocaleDateString('hr-HR', {
                            year: undefined,
                            month: undefined,
                            day: undefined,
                            weekday: 'short'
                        })})
                    </span>
                </div>
                <div className={styles.slotInfo}></div>
                <div className={styles.department}>{department.name}</div>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.badgeContainer}>
                    <div className={
                        styles.blockedBadge
                    }>
                        <span>BLOKIRANO</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
