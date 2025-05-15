import { FC } from "react"
import { Department } from "../../../components/department"

export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params

  if (!handle) {
    return <div>Invalid department ID</div>
  }

  return (
    <div>
      <Department id={handle} />
    </div>
  )
}