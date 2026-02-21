import { describe, it, expect, vi, afterEach } from 'vitest';
import { useFetch } from 'src/composables/useFetch';
import { SPORTS_DB_BASE_URL } from 'src/configs';

type FakeData = { items: string[] } & Record<string, unknown>;

describe('useFetch', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has correct initial state', () => {
    const { isLoading, error, data } = useFetch('/test');

    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(data.value).toBeUndefined();
  });

  describe('getJson', () => {
    it('fetches data successfully and returns it', async () => {
      const payload: FakeData = { items: ['a', 'b'] };

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify(payload), { status: 200 }),
      );

      const { data, error, getJson } = useFetch<FakeData>('/test');
      const result = await getJson();

      expect(result).toEqual(payload);
      expect(data.value).toEqual(payload);
      expect(error.value).toBeNull();
    });

    it('calls the correct URL without query params', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));

      const { getJson } = useFetch('/some/path');
      await getJson();

      expect(fetchSpy).toHaveBeenCalledWith(`${SPORTS_DB_BASE_URL}/some/path`);
    });

    it('appends query params to the URL', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));

      const { getJson } = useFetch('/some/path');
      await getJson({ queryParams: { id: '42', badge: '1' } });

      expect(fetchSpy).toHaveBeenCalledWith(`${SPORTS_DB_BASE_URL}/some/path?id=42&badge=1`);
    });

    it('does not append a query string when no queryParams are provided', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));

      const { getJson } = useFetch('/some/path');
      await getJson();

      const calledUrl = fetchSpy.mock.calls[0]![0] as string;
      expect(calledUrl).not.toContain('?');
    });

    it('sets isLoading to true while fetching and false after', async () => {
      let resolveResponse!: (value: Response) => void;
      const pendingResponse = new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      });

      vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(pendingResponse);

      const { isLoading, getJson } = useFetch('/test');
      const fetchPromise = getJson();

      expect(isLoading.value).toBe(true);

      resolveResponse(new Response(JSON.stringify({}), { status: 200 }));
      await fetchPromise;

      expect(isLoading.value).toBe(false);
    });

    it('sets isLoading to false after a non-ok response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 500 }),
      );

      const { isLoading, getJson } = useFetch('/test');
      await getJson();

      expect(isLoading.value).toBe(false);
    });

    it('sets error when response is not ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 404 }),
      );

      const { error, getJson } = useFetch('/test-path');
      await getJson();

      expect(error.value).toBeInstanceOf(Error);
      expect(error.value?.message).toBe('Failed to fetch data: /test-path');
    });

    it('clears a previous error before a new fetch', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 500 }),
      );

      const { error, getJson } = useFetch('/test');
      await getJson();
      expect(error.value).toBeInstanceOf(Error);

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 200 }),
      );
      await getJson();

      expect(error.value).toBeNull();
    });

    it('sets isLoading to false when fetch throws', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

      const { isLoading, getJson } = useFetch('/test');

      await expect(getJson()).rejects.toThrow('Network failure');
      expect(isLoading.value).toBe(false);
    });

    it('propagates the error when fetch throws', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

      const { getJson } = useFetch('/test');

      await expect(getJson()).rejects.toThrow('Network failure');
    });
  });
});
