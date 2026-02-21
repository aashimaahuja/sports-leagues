import { ref } from 'vue';
import { SPORTS_DB_BASE_URL } from 'src/configs';

export function useFetch<T extends Record<string, unknown>>(url: string) {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<T | undefined>(undefined);

  async function getJson({ queryParams }: { queryParams?: Record<string, string> } = {}) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        SPORTS_DB_BASE_URL +
          url +
          (queryParams ? `?${new URLSearchParams(queryParams).toString()}` : ''),
      );
      if (!response.ok) {
        error.value = new Error(`Failed to fetch data: ${url}`);
      }
      data.value = await response.json();
      return data.value as T;
    } finally {
      isLoading.value = false;
    }
  }

  return { isLoading, error, data, getJson };
}
