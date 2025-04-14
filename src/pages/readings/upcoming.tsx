import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import ReadingCard from '../../components/reading-card';
import styles from './readings.module.css';

interface Reading {
    id: string;
    date: string;
    dayOfWeek: string;
    slotNumber: number;
    totalSlots: number;
    department: string;
    isAvailable: boolean;
    registeredUsers: string[];
}

const UpcomingReadings: NextPage = () => {
    // Sample data
    const [readings, setReadings] = useState<Reading[]>([
        {
            id: '1',
            date: '24.02',
            dayOfWeek: 'Utorak',
            slotNumber: 3,
            totalSlots: 3,
            department: 'Onkologija',
            isAvailable: false,
            registeredUsers: ['Marko Marković', 'Ana Anić', 'Petar Petrović']
        },
        {
            id: '2',
            date: '24.02',
            dayOfWeek: 'Utorak',
            slotNumber: 1,
            totalSlots: 3,
            department: 'Onkologija',
            isAvailable: true,
            registeredUsers: ['Paulina Svetic']
        },
        {
            id: '3',
            date: '24.02',
            dayOfWeek: 'Utorak',
            slotNumber: 1,
            totalSlots: 3,
            department: 'Onkologija',
            isAvailable: true,
            registeredUsers: []
        },
    ]);

    // Handle user registration for a reading slot
    const handleRegister = (readingId: string, userName: string = 'Current User') => {
        setReadings(prevReadings =>
            prevReadings.map(reading => {
                if (reading.id === readingId) {
                    const updatedUsers = [...reading.registeredUsers];

                    // Add the user if there's space available
                    if (updatedUsers.length < reading.totalSlots) {
                        updatedUsers.push(userName);
                    }

                    // Update slot availability if it's now full
                    const isNowAvailable = updatedUsers.length < reading.totalSlots;

                    return {
                        ...reading,
                        registeredUsers: updatedUsers,
                        isAvailable: isNowAvailable,
                        slotNumber: updatedUsers.length
                    };
                }
                return reading;
            })
        );
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Upcoming Readings</title>
                <meta name="description" content="View and register for upcoming readings" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Upcoming Readings</h1>

                <div className={styles.readingsGrid}>
                    {readings.map(reading => (
                        <ReadingCard
                            key={reading.id}
                            date={reading.date}
                            dayOfWeek={reading.dayOfWeek}
                            slotNumber={reading.slotNumber}
                            totalSlots={reading.totalSlots}
                            department={reading.department}
                            isAvailable={reading.isAvailable}
                            registeredUsers={reading.registeredUsers}
                            buttonLabel="UPISI ME"
                            onRegister={() => handleRegister(reading.id)}
                        />
                    ))}
                </div>

                {/* Example with different button label */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Other Departments</h2>
                    <ReadingCard
                        date="25.02"
                        dayOfWeek="Srijeda"
                        slotNumber={2}
                        totalSlots={4}
                        department="Kardiologija"
                        isAvailable={true}
                        registeredUsers={['Ivan Ivić']}
                        buttonLabel="REZERVIRAJ"
                        onRegister={() => console.log('Reserved cardiology slot')}
                    />
                </div>
            </main>
        </div>
    );
};

export default UpcomingReadings;