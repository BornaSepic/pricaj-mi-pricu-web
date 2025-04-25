import { authenticatedFetch } from "../../../core/authenticated-fetch"
import { API_URL } from "../../../core/constants"
import { ReadingsByDate } from "../../../core/types/readings"

export const getReadingsForDepartment = async (id: string, status: 'active' | 'inactive') => {
  const response = await authenticatedFetch(`${API_URL}/readings/list?departmentId=${id}&status=${status}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch departments")
  }

  const rawData = await response.json()

  const { success, data, error } = ReadingsByDate.safeParse(rawData)

  if (!success) {
    throw new Error("Failed to parse departments", error)
  }


  return data
}