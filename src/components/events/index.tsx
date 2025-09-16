'use client'

import { FC, useState } from 'react';
import styles from './styles.module.css';
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";
import { pmpSdk } from '../../core/pmp-sdk';
import { MinimalActivityCard } from "../minimal-activity-card";
import { ActivityEditorModal, Activity, ActivityFormData } from "../event-editor-modal";
import { AdminProvider } from "../admin-lock";
import { ReadingCardEvent } from '../reading-card-event';

// Create a "new activity" template for adding
const createNewActivity = (): Activity => ({
    id: 0, // Temporary ID for new activities
    title: '',
    description: '',
    limit: null,
    date: new Date().toISOString(),
    users: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});

export const Events: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { data: events, refetch, isFetching: isLoadingEvents } = useQuery({
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
                await pmpSdk.createActivity(activityData);
            } else {
                // Updating existing activity
                await pmpSdk.updateActivity({
                    id: selectedActivity.id,
                    ...activityData
                });
            }

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
                    <AdminProvider>
                        <button
                            className={styles.addButton}
                            onClick={handleAddEvent}
                            type="button"
                            title="Dodaj novi događaj"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                        </button>
                    </AdminProvider>
                </div>

                <div className={styles.cardContent}>
                    {!isLoadingEvents && events && events.length === 0 ? (
                        <p>Nema događaja</p>
                    ) : (
                        <>
                            {events?.map((item) => {
                                return (
                                    <ReadingCardEvent
                                        key={item.id}
                                        activity={item}
                                        date={item.date}
                                        activities={[item]}
                                        onChange={() => refetch()}
                                    />
                                );
                            })}
                        </>
                    )}

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
