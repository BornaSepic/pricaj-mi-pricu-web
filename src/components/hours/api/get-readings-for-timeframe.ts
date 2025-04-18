import { authenticatedFetch } from "../../../core/authenticated-fetch";
import { API_URL } from "../../../core/constants";
import { SuccessResponse } from "../types";

export const getReadingsForTimeframe = async (from: Date, to: Date) => {
  const startOfMonth = new Date(from.getFullYear(), from.getMonth(), 1).toISOString().split("T")[0];
  const endOfMonth = new Date(to.getFullYear(), to.getMonth() + 1, 0).toISOString().split("T")[0];

  return authenticatedFetch(`${API_URL}/readings/user?from=${startOfMonth}&to=${endOfMonth}`, {
    method: "GET",
  }).then(res => res.json())
    .then(rawData => {
      const { success, data, error } = SuccessResponse.safeParse(rawData)

      if (!success) {
        return null
      }

      return data
    })
    .catch(() => {
      return null; // or handle the error as needed
    })
}