import { authenticatedFetch } from "../../../core/authenticated-fetch";
import { API_URL } from "../../../core/constants";
import { ReadingsByDate } from "../../../core/types/readings";

export const getPastReadings = async (from: Date, to: Date) => {
    const startOfYear = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-01`;
    const endOfYear = `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;

    return authenticatedFetch(`${API_URL}/readings/user?from=${startOfYear}&to=${endOfYear}`, {
        method: "GET",
    }).then(res => res.json())
        .then(rawData => {
            const { success, data, error } = ReadingsByDate.safeParse(rawData)

            if (!success) {
                return null
            }

            return data
        })
        .catch(() => {
            return null; // or handle the error as needed
        })
}