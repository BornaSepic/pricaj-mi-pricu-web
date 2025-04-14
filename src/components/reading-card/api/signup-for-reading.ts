import { authenticatedFetch } from "../../../core/authenticated-fetch";
import { API_URL } from "../../../core/constants";

export const signupForReading = async (date: string, departmentId: number) => {
  const response = await authenticatedFetch(`${API_URL}/readings/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      date,
      departmentId
    })
  });

  if (!response.ok) {
    throw new Error('Failed to signup for reading');
  }

  return response.json();
}