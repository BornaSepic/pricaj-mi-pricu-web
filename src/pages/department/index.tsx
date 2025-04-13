import { useQuery } from "@tanstack/react-query"
import { getDepartments } from "./api/get-departments"
import { useAuth } from "../../hooks/useAuth"


export default function Department() {
  const {user} = useAuth()

  const { data, isFetching } = useQuery({
    queryKey: [`get-departments`],
    queryFn: () => getDepartments(),
    placeholderData: (prev) => prev || []
  })

  if(!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Department - {user.name}</h1>
      <p>Welcome to the department page!</p>
    </div>
  )
}