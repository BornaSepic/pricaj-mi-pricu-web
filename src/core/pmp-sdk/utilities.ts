import { z, ZodTypeAny } from "zod";
import { authenticatedFetch } from "../authenticated-fetch";
import { API_URL } from "../constants";

// Custom error class to preserve server response details
class ApiError extends Error {
  status: number;
  statusCode: number;
  response?: any;
  data?: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusCode = status;
    this.response = response;
    this.data = response;
  }
}

export const _delete = async <Z extends ZodTypeAny>(path: string, schema: Z): Promise<z.infer<Z>> => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    let errorData = null;

    try {
      errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to delete data', path, errorMessage);
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  const rawData = await response.json()

  const { success, data, error } = schema.safeParse(rawData)

  if (!success) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to parse data", path, error);
    }
    throw new Error('Failed to parse response data');
  }

  return data
}

export const _post = async <Z extends ZodTypeAny>(path: string, body: unknown, schema: Z): Promise<z.infer<Z>> => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).catch((error) => {
    console.error('Network error:', error);
    return Promise.reject(new ApiError('Network error', 0, error));
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    let errorData = null;

    try {
      // Try to parse the error response as JSON
      errorData = await response.json();

      // Extract message from common server response structures
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors[0]?.message) {
        errorMessage = errorData.errors[0].message;
      }
    } catch {
      // If JSON parsing fails, use statusText or keep default
      errorMessage = response.statusText || errorMessage;
    }

    // Only log in development to avoid production console spam
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to post data', path, errorMessage);
    }

    // Throw structured error with server message
    throw new ApiError(errorMessage, response.status, errorData);
  }

  const rawData = await response.json()

  const { success, data, error } = schema.safeParse(rawData)

  if (!success) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to parse data", path, error);
    }
    throw new Error('Failed to parse response data');
  }

  return data
}

export const _get = async <Z extends ZodTypeAny>(path: string, schema: Z): Promise<z.infer<Z>> => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).catch((error) => {
    console.error('Network error:', error);
    return Promise.reject(new ApiError('Network error', 0, error));
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    let errorData = null;

    try {
      errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to fetch data", path, errorMessage);
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  const rawData = await response.json()

  const { success, data, error } = schema.safeParse(rawData)

  if (!success) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to parse data", path, error);
    }
    return null
  }

  return data
}

export const _patch = async <Z extends ZodTypeAny>(path: string, body: unknown, schema: Z): Promise<z.infer<Z>> => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).catch((error) => {
    console.error('Network error:', error);
    return Promise.reject(new ApiError('Network error', 0, error));
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    let errorData = null;

    try {
      // Try to parse the error response as JSON
      errorData = await response.json();

      // Extract message from common server response structures
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors[0]?.message) {
        errorMessage = errorData.errors[0].message;
      }
    } catch {
      // If JSON parsing fails, use statusText or keep default
      errorMessage = response.statusText || errorMessage;
    }

    // Only log in development to avoid production console spam
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to post data', path, errorMessage);
    }

    // Throw structured error with server message
    throw new ApiError(errorMessage, response.status, errorData);
  }

  const rawData = await response.json()

  const { success, data, error } = schema.safeParse(rawData)

  if (!success) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to parse data", path, error);
    }
    throw new Error('Failed to parse response data');
  }

  return data
}

export const _put = async <Z extends ZodTypeAny>(path: string, body: unknown, schema: Z): Promise<z.infer<Z>> => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).catch((error) => {
    console.error('Network error:', error);
    return Promise.reject(new ApiError('Network error', 0, error));
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    let errorData = null;

    try {
      // Try to parse the error response as JSON
      errorData = await response.json();

      // Extract message from common server response structures
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors[0]?.message) {
        errorMessage = errorData.errors[0].message;
      }
    } catch {
      // If JSON parsing fails, use statusText or keep default
      errorMessage = response.statusText || errorMessage;
    }

    // Only log in development to avoid production console spam
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to post data', path, errorMessage);
    }

    // Throw structured error with server message
    throw new ApiError(errorMessage, response.status, errorData);
  }

  const rawData = await response.json()

  const { success, data, error } = schema.safeParse(rawData)

  if (!success) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to parse data", path, error);
    }
    throw new Error('Failed to parse response data');
  }

  return data
}