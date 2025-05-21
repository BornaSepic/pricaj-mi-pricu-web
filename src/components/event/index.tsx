'use client'

import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import { ReadingCard } from "../reading-card"
import styles from "./styles.module.css"
import { pmpSdk } from "../../core/pmp-sdk"

export const Event: FC = ({}) => {
    const { data: events, refetch } = useQuery({
        queryKey: [`get-events`],
        queryFn: () => pmpSdk.getEvents(),
        placeholderData: (prev) => prev || []
    })

    if (!events) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.event__wrapper}>
            <h1>Događaji</h1>
            {events.map((item) => {
                return (
                    <ReadingCard
                        department={{ id: 1, name: "Događaj 01" }}
                        key={item.date}
                        date={item.date}
                        readings={[]}
                        onChange={() => refetch()}
                    />
                )
            })}
        </div>
    )
}