'use client'

import { FC, useState } from 'react';
import styles from './styles.module.css';
import { MinimalDepartmentCard } from "../minimal-department-card";
import { DepartmentEditorModal, DepartmentFormData } from "../department-editor-modal";
import { useQuery } from '@tanstack/react-query';
import { pmpSdk } from '../../core/pmp-sdk';
import { Department } from '../../core/pmp-sdk/types';

const createNewDepartment = (): Department => ({
    id: 0, // Temporary ID for new departments
    name: ''
});

export const AdminDepartments: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { data: departments, refetch } = useQuery({
        queryKey: ['get-departments'],
        queryFn: () => pmpSdk.getDepartments(),
        placeholderData: (prev) => prev || []
    })

    const handleDepartmentChange = () => {
        // TODO: Implement refetch when backend is ready
        // refetch();
        console.log('Department changed - refetch would happen here');
    };

    // Handle adding new department
    const handleAddDepartment = () => {
        setSelectedDepartment(createNewDepartment());
        setIsModalOpen(true);
    };

    // Handle editing existing department (called from MinimalDepartmentCard)
    const handleEditDepartment = (department: Department) => {
        setSelectedDepartment(department);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDepartment(null);
    };

    const handleSaveDepartment = async (departmentData: DepartmentFormData) => {
        if (!selectedDepartment) return;

        setIsLoading(true);

        try {
            if (selectedDepartment.id === 0) {
                await pmpSdk.createDepartment({
                    name: departmentData.name
                });
            } else {
                await pmpSdk.updateDepartment({
                    id: selectedDepartment.id, 
                    name: departmentData.name
                })
            }

            refetch();
            setIsModalOpen(false);
            setSelectedDepartment(null);
        } catch (error) {
            console.error('Error saving department:', error);
            // TODO: Show error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Odjeli</h2>
                <button
                    className={styles.addButton}
                    onClick={handleAddDepartment}
                    type="button"
                    title="Dodaj novi odjel"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                </button>
            </div>

            <div className={styles.cardContent}>
                {(departments || []).map((department) => (
                    <MinimalDepartmentCard
                        key={department.id}
                        department={department}
                        onChange={handleDepartmentChange}
                        onEdit={() => handleEditDepartment(department)}
                    />
                ))}
            </div>

            {/* Department Modal - Handles both adding and editing */}
            {selectedDepartment && (
                <DepartmentEditorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSaveDepartment}
                    department={selectedDepartment}
                    isLoading={isLoading}
                    isReadOnly={false}
                />
            )}
        </div>
    );
};
