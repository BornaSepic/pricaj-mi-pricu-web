'use client'

import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import styles from "./styles.module.css"
import { pmpSdk } from "../../core/pmp-sdk"
import {ReadingCardEvent} from "../reading-card-event";

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
                    <ReadingCardEvent
                        activity={item}
                        key={item.id}
                        date={item.date}
                        activities={[item]}
                        onChange={() => refetch()}
                    />
                )
            })}
        </div>
    )
}