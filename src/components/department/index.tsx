'use client'

import { useQuery } from "@tanstack/react-query"
import { FC, useState } from "react"
import { ReadingCard } from "../reading-card"
import styles from "./styles.module.css"
import { pmpSdk } from "../../core/pmp-sdk"
import { BlockedReadingCard } from "../blocked-reading-card"
import { MinimalReadingCard } from "../minimal-reading-card"

export type Props = {
    id: string
}

export const Department: FC<Props> = ({
    id
}) => {
    const [showFuture, setShowFuture] = useState(true)

    const { data: department } = useQuery({
        queryKey: [`get-department`, id],
        queryFn: () => pmpSdk.getDepartment(id),
        placeholderData: (prev) => prev || null
    })

    const { data: readingsForDepartment, refetch } = useQuery({
        queryKey: [`get-readings-for-department`, id, showFuture],
        queryFn: () => pmpSdk.getReadingsForDepartment(id, showFuture ? 'active' : 'inactive'),
        placeholderData: (prev) => prev || []
    })

    if (!readingsForDepartment || !department) {
        return null
    }

    return (
        <div className={styles.department__wrapper}>
            <div className={styles.department__header}>
                <h1>{department.name}</h1>
                <div className={styles.toggle__container}>
                    <label className={styles.toggle__label}>
                        <span className={styles.toggle__text}>
                            {showFuture ? 'Sljedećih 14 dana' : 'Prethodnih 14 dana'}
                        </span>
                        <div className={styles.toggle__switch}>
                            <input
                                type="checkbox"
                                checked={!showFuture}
                                onChange={(e) => setShowFuture(!e.target.checked)}
                                className={styles.toggle__input}
                            />
                            <div className={styles.toggle__slider}></div>
                        </div>
                    </label>
                </div>
            </div>

            {showFuture ? (
                readingsForDepartment.map((item) => {
                    const isBlocked = item.readings.some(reading => reading.blocked)
                    if (isBlocked) {
                        return (
                            <BlockedReadingCard
                                department={department}
                                key={item.date}
                                date={item.date}
                            />
                        )
                    }

                    return (
                        <ReadingCard
                            department={department}
                            key={item.date}
                            date={item.date}
                            readings={item.readings}
                            onChange={() => refetch()}
                        />
                    )
                })
            ) : (
                readingsForDepartment.map((item) => {
                    return (
                        <MinimalReadingCard
                            key={`${item.date}`}
                            department={department}
                            readings={item.readings}
                            date={item.date}
                            timeframe={"past"}
                            onChange={() => refetch()}
                        />
                    )
                })
            )
            }

        </div>
    )
}
