'use client'

import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import { ReadingCard } from "../reading-card"
import styles from "./styles.module.css"
import { pmpSdk } from "../../core/pmp-sdk"
import { BlockedReadingCard } from "../blocked-reading-card"

export type Props = {
  id: string
}

export const Department: FC<Props> = ({
  id
}) => {
  const { data: department } = useQuery({
    queryKey: [`get-department`, id],
    queryFn: () => pmpSdk.getDepartment(id),
    placeholderData: (prev) => prev || null
  })

  const { data: readingsForDepartment, refetch } = useQuery({
    queryKey: [`get-readings-for-department`, id],
    queryFn: () => pmpSdk.getReadingsForDepartment(id, 'active'),
    placeholderData: (prev) => prev || []
  })

  if (!readingsForDepartment || !department) {
    return null
  }

  return (
    <div className={styles.department__wrapper}>
      <h1>{department.name}</h1>
      {readingsForDepartment.map((item) => {
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
      })}
    </div>
  )
}