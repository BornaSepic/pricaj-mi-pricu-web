import { authenticatedFetch } from "../../../core/authenticated-fetch";
import { API_URL } from "../../../core/constants";
import {Events} from "../../../core/types/event";

export const getEvents = async () => {
    return authenticatedFetch(`${API_URL}/events`, {
        method: "GET",
    }).then(res => res.json())
        .then(rawData => {
            const { success, data, error } = Events.safeParse(rawData)

            if (!success) {
                return null
            }

            return data
        })
        .catch(() => {
            return null; // or handle the error as needed
        })
}