import { cookies } from 'next/headers';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('strapi-jwt')?.value;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

async function strapiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${STRAPI_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (STRAPI_TOKEN) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function strapiFetchAuth<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${STRAPI_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (STRAPI_TOKEN) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const token = await getAuthToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchFromStrapi<T>(endpoint: string): Promise<T> {
  return strapiFetch<T>(endpoint);
}

export async function postToStrapi<T>(endpoint: string, data: unknown): Promise<T> {
  return strapiFetch<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

export async function putToStrapi<T>(endpoint: string, data: unknown): Promise<T> {
  return strapiFetch<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

export async function deleteToStrapi<T>(endpoint: string): Promise<T> {
  return strapiFetch<T>(endpoint, {
    method: 'DELETE',
  });
}