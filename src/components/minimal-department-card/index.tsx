import { FC } from 'react';
import styles from './styles.module.css';
import { Department } from '../../core/pmp-sdk/types';

export type Props = {
    department: Department;
    onChange?: () => void;
    onEdit?: () => void;
}

export const MinimalDepartmentCard: FC<Props> = ({
    department,
    onChange,
    onEdit
}) => {
    const handleEditDepartment = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit();
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.departmentName}>
                    {department.name}
                </div>
                <button
                    className={styles.editButton}
                    onClick={handleEditDepartment}
                    type="button"
                    title="Uredi odjel"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
