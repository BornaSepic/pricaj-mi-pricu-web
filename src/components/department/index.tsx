'use client'

import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import { getReadingsForDepartment } from "./api/get-readings-for-department"
import { ReadingCard } from "../reading-card"
import styles from "./styles.module.css"

export type Props = {
  id: string
}

export const Department: FC<Props> = ({
  id
}) => {
  const { data: readingsForDepartment, refetch } = useQuery({
    queryKey: [`get-readings-for-department`, id],
    queryFn: () => getReadingsForDepartment(id, 'active'),
    placeholderData: (prev) => prev || []
  })

  if (!readingsForDepartment) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.department__wrapper}>
      <h1>Pedijatrija</h1>
      {readingsForDepartment.map((item) => {
        return (
          <ReadingCard
            department={{ id: 1, name: "Pedijatrija" }}
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