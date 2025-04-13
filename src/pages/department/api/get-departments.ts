import { authenticatedFetch } from "../../../core/authenticated-fetch"
import { API_URL } from "../../../core/constants"

export const getDepartments = async () => {
  const response = await authenticatedFetch(`${API_URL}/departments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch departments")
  }

  return response.json()
}