import { z, ZodTypeAny } from "zod";
import { authenticatedFetch } from "../authenticated-fetch";
import { API_URL } from "../constants";

export const post = async <Z extends ZodTypeAny>(path: string, body: unknown, schema: Z): Promise<z.infer<Z>> => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error('Failed to post data', path, response.statusText);
    throw new Error('Failed to post data');
  }

  const rawData = await response.json()

  const { success, data, error } = schema.safeParse(rawData)

  if (!success) {
    console.error("Failed to parse data", path, error)
  }

  return data
}

export const get = async <Z extends ZodTypeAny>(path: string, schema: Z): Promise<z.infer<Z>> => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  if (!response.ok) {
    console.error("Failed to fetch data", path)
    return null
  }

  const rawData = await response.json()

  const { success, data, error } = schema.safeParse(rawData)

  if (!success) {
    console.error("Failed to parse data", path, error)
    return null
  }

  return data
}