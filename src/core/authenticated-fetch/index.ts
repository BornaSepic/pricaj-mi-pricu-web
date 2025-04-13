export const authenticatedFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem("access_token")
    const headers = new Headers(options.headers)

    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`)
    }

    return fetch(url, {
        ...options,
        headers,
    })
}
