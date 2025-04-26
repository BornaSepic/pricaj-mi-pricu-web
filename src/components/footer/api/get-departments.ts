import { authenticatedFetch } from "../../../core/authenticated-fetch"
import { API_URL } from "../../../core/constants"
import {Departments} from "../../../core/types/department";

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

    const rawData = await response.json()

    const { success, data, error } = Departments.safeParse(rawData)

    if (!success) {
        throw new Error("Failed to parse departments", error)
    }


    return data
}
