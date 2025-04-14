import { useQuery } from "@tanstack/react-query"
import { getDepartments } from "./api/get-departments"
import { useAuth } from "../../hooks/useAuth"
import { useRouter } from "next/router"
import { getReadingsForDepartment } from "./api/get-readings-for-department"
import { Department } from "../../components/department"


export default function DepartmentPage() {
  const {user} = useAuth()
  const router = useRouter()


  if(!user) {
    return <div>Loading...</div>
  }

  if(typeof router.query.id !== "string") {
    return <div>Invalid department ID</div>
  }

  return (
    <div>
      <Department id={router.query.id} />
    </div>
  )
}