'use client'

import { FC, useState } from 'react';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import { pmpSdk } from '../../core/pmp-sdk';
import { MinimalActivityCard } from "../minimal-activity-card";
import { ActivityEditorModal, Activity, ActivityFormData } from "../event-editor-modal";

// Create a "new activity" template for adding
const createNewActivity = (): Activity => ({
    id: 0, // Temporary ID for new activities
    title: '',
    description: '',
    date: new Date().toISOString(),
    users: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});

export const Events: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { data: events, refetch } = useQuery({
        queryKey: [`get-events`],
        queryFn: () => pmpSdk.getEvents(),
        placeholderData: (prev) => prev || []
    })

    // Handle adding new event
    const handleAddEvent = () => {
        setSelectedActivity(createNewActivity());
        setIsModalOpen(true);
    };

    // Handle editing existing event (called from MinimalActivityCard if needed)
    const handleEditEvent = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedActivity(null);
    };

    const handleSaveActivity = async (activityData: ActivityFormData) => {
        if (!selectedActivity) return;

        setIsLoading(true);

        try {
            if (selectedActivity.id === 0) {
                // Creating new activity
                console.log('Creating new activity:', activityData);
                // TODO: Implement API call to create activity
                // await pmpSdk.createActivity(activityData);
            } else {
                // Updating existing activity
                console.log('Updating activity:', selectedActivity.id, activityData);
                // TODO: Implement API call to update activity
                // await pmpSdk.updateActivity(selectedActivity.id, activityData);
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            refetch();
            setIsModalOpen(false);
            setSelectedActivity(null);
        } catch (error) {
            console.error('Error saving activity:', error);
            // TODO: Show error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                        <Link href="/events">
                            Događaji
                        </Link>
                    </h2>
                    <button
                        className={styles.addButton}
                        onClick={handleAddEvent}
                        type="button"
                        title="Dodaj novi događaj"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.cardContent}>
                    {events?.map((item) => {
                        return (
                            <MinimalActivityCard
                                key={item.id}
                                activity={item}
                                onChange={() => refetch()}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Activity Modal - Handles both adding and editing */}
            {selectedActivity && (
                <ActivityEditorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSaveActivity}
                    activity={selectedActivity}
                    isLoading={isLoading}
                    isReadOnly={false}
                />
            )}
        </>
    );
}
