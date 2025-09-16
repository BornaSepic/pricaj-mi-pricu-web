'use client'

import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import styles from "./styles.module.css"
import { pmpSdk } from "../../core/pmp-sdk"
import { ReadingCardEvent } from "../reading-card-event";

export const Event: FC = ({ }) => {
    const { data: events, refetch, isLoading } = useQuery({
        queryKey: [`get-events`],
        queryFn: () => pmpSdk.getEvents(),
        placeholderData: (prev) => prev || []
    })

    if (!events) {
        return null
    }

    return (
        <div className={styles.event__wrapper}>
            <h1>Događaji</h1>
            {!isLoading && events.length === 0 ? (
                <p>Nema događaja</p>
            ) : (
                <>
                    {events.map((item) => {
                        return (
                            <ReadingCardEvent
                                activity={item}
                                key={item.id}
                                date={item.date}
                                activities={[item]}
                                onChange={() => refetch()}
                            />
                        )
                    })}
                </>
            )}
        </div>
    )
}