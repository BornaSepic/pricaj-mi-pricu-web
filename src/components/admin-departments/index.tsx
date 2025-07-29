'use client'

import { FC, useState } from 'react';
import styles from './styles.module.css';
import { MinimalDepartmentCard, Department } from "../minimal-department-card";
import { DepartmentEditorModal, DepartmentFormData } from "../department-editor-modal";

// Sample departments data (replace with actual API call when backend is ready)
const sampleDepartments: Department[] = [
    {
        "id": 1,
        "name": "Prodaja",
        "created_at": "2024-01-15T08:30:00.000Z",
        "updated_at": "2024-01-15T08:30:00.000Z"
    },
    {
        "id": 2,
        "name": "Marketing",
        "created_at": "2024-02-20T10:15:00.000Z",
        "updated_at": "2024-07-10T14:22:30.000Z"
    },
    {
        "id": 3,
        "name": "IT",
        "created_at": "2024-01-10T12:45:00.000Z",
        "updated_at": "2024-01-10T12:45:00.000Z"
    },
    {
        "id": 4,
        "name": "Ljudski resursi",
        "created_at": "2024-03-05T09:20:00.000Z",
        "updated_at": "2024-05-18T16:35:45.000Z"
    },
    {
        "id": 5,
        "name": "Računovodstvo",
        "created_at": "2024-01-08T11:10:00.000Z",
        "updated_at": "2024-01-08T11:10:00.000Z"
    }
];

// Create a "new department" template for adding
const createNewDepartment = (): Department => ({
    id: 0, // Temporary ID for new departments
    name: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});

export const AdminDepartments: FC = () => {
    const [departments] = useState<Department[]>(sampleDepartments);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // TODO: Replace with actual API call when backend is ready
    // const { data: departments, refetch } = useQuery({
    //     queryKey: ['get-departments'],
    //     queryFn: () => pmpSdk.getDepartments(),
    //     placeholderData: (prev) => prev || []
    // })

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
                // Creating new department
                console.log('Creating new department:', departmentData);
                // TODO: Implement API call to create department
                // await pmpSdk.createDepartment(departmentData);
            } else {
                // Updating existing department
                console.log('Updating department:', selectedDepartment.id, departmentData);
                // TODO: Implement API call to update department
                // await pmpSdk.updateDepartment(selectedDepartment.id, departmentData);
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            handleDepartmentChange();
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
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                </button>
            </div>

            <div className={styles.cardContent}>
                {departments.map((department) => (
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
