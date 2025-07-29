'use client'

import { FC, useState } from 'react';
import styles from './styles.module.css';
import { MinimalUserCard } from "../minimal-user-card";

// Sample users data (replace with actual API call when backend is ready)
const sampleUsers: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "user";
    seniority: "junior" | "senior";
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}[] = [
    {
        "id": 2,
        "name": "Borna S.",
        "email": "oldbornasepic98@gmail.com",
        "phone": "",
        "role": "admin",
        "seniority": "junior",
        "status": "active",
        "created_at": "2025-04-09T17:44:05.654Z",
        "updated_at": "2025-04-09T17:44:05.654Z"
    },
    {
        "id": 3,
        "name": "Marija K.",
        "email": "marija.kovac@gmail.com",
        "phone": "+385 91 234 5678",
        "role": "user",
        "seniority": "senior",
        "status": "active",
        "created_at": "2025-03-15T09:22:14.123Z",
        "updated_at": "2025-07-20T14:30:45.678Z"
    },
    {
        "id": 4,
        "name": "Petar M.",
        "email": "petar.milic@hotmail.com",
        "phone": "",
        "role": "user",
        "seniority": "junior",
        "status": "active",
        "created_at": "2025-01-28T11:15:33.456Z",
        "updated_at": "2025-01-28T11:15:33.456Z"
    },
    {
        "id": 5,
        "name": "Ana V.",
        "email": "ana.vuković@outlook.com",
        "phone": "+385 98 876 5432",
        "role": "admin",
        "seniority": "senior",
        "status": "inactive",
        "created_at": "2024-11-12T16:45:28.789Z",
        "updated_at": "2025-06-10T08:12:15.234Z"
    },
    {
        "id": 6,
        "name": "Luka P.",
        "email": "luka.pavic123@gmail.com",
        "phone": "+385 95 123 4567",
        "role": "user",
        "seniority": "junior",
        "status": "active",
        "created_at": "2025-05-03T13:28:47.567Z",
        "updated_at": "2025-05-03T13:28:47.567Z"
    },
    {
        "id": 7,
        "name": "Ivana T.",
        "email": "ivana.topic@yahoo.com",
        "phone": "",
        "role": "user",
        "seniority": "junior",
        "status": "inactive",
        "created_at": "2025-07-25T10:05:12.890Z",
        "updated_at": "2025-07-25T10:05:12.890Z"
    }
];

export const Users: FC = () => {
    const [users] = useState(sampleUsers);

    // TODO: Replace with actual API call when backend is ready
    // const { data: users, refetch } = useQuery({
    //     queryKey: ['get-users'],
    //     queryFn: () => pmpSdk.getUsers(),
    //     placeholderData: (prev) => prev || []
    // })

    const handleUserChange = () => {
        // TODO: Implement refetch when backend is ready
        // refetch();
        console.log('User changed - refetch would happen here');
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Korisnici</h2>
            </div>

            <div className={styles.cardContent}>
                {users.map((user) => (
                    <MinimalUserCard
                        key={user.id}
                        user={user}
                        onChange={handleUserChange}
                    />
                ))}
            </div>
        </div>
    );
};
