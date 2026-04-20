import { ApiResponse } from './types';

const SIMULATED_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiGet<T>(fetcher: () => T): Promise<ApiResponse<T>> {
  await delay(SIMULATED_DELAY_MS);

  try {
    const data = fetcher();
    return { data, success: true };
  } catch (error) {
    return {
      data: null as unknown as T,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
