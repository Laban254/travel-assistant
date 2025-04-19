export interface TravelResponse {
  destination: string;
  origin: string;
  visaRequirements: string;
  documents: string[];
  advisories: string[];
  estimatedProcessingTime: string;
  embassyInformation: string;
  timestamp: string;
}

export interface TravelQuery {
  id: number;
  query: string;
  destination: string;
  origin: string;
  response: TravelResponse;
  created_at: string;
}

export interface ApiError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
  status?: number;
}

export const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/api/v1${endpoint}`;
};

export const handleApiError = async (response: Response): Promise<ApiError> => {
  try {
    const errorData = await response.json();
    return {
      detail: errorData.detail || 'An error occurred',
      status: response.status
    };
  } catch (err) {
    return {
      detail: 'Failed to parse error response',
      status: response.status
    };
  }
};

export const fetchWithErrorHandling = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await handleApiError(response);
    throw new Error(typeof error.detail === 'string' ? error.detail : error.detail[0]?.msg || 'An error occurred');
  }

  return response.json();
};

// API Functions
export async function createTravelQuery(data: { query: string; destination: string; origin?: string }): Promise<TravelQuery> {
  return fetchWithErrorHandling<TravelQuery>('/query', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getQueryHistory(): Promise<TravelQuery[]> {
  return fetchWithErrorHandling<TravelQuery[]>('/history');
}

export async function getQueryById(id: number): Promise<TravelQuery> {
  return fetchWithErrorHandling<TravelQuery>(`/history/${id}`);
}

export async function deleteQuery(id: number): Promise<void> {
  return fetchWithErrorHandling<void>(`/history/${id}`, {
    method: 'DELETE',
  });
} 