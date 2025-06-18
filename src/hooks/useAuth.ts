'use client'

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { authenticatedFetch } from "../core/authenticated-fetch"
import { API_URL } from "../core/constants"
import { ProfileSuccessResponse, User } from "../core/pmp-sdk/types"

const getUser = (): Promise<User | null> => {
  return authenticatedFetch(`${API_URL}/auth/profile`, {
    method: "GET",
  }).then(res => res.json())
    .then(rawData => {
      const { success, data, error } = ProfileSuccessResponse.safeParse(rawData)

      if (!success) {
        return null
      }

      return data
    })
    .catch(() => {
      return null; // or handle the error as needed
    })
}

export const useAuth = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [`get-user`],
    queryFn: () => getUser(),
    placeholderData: keepPreviousData,
    //initialData: getUserFromToken()
  })


const logout = () => {
  localStorage.removeItem("access_token")

  refetch()
}

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    isAdmin: data?.role === "admin",
    isUser: data?.role === "user",
    isSenior: data?.seniority === "senior",
    isJunior: data?.seniority === "junior",
    refetch: refetch,
    logout: logout
  }
}