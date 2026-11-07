import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs `fetcher` on mount (and whenever `deps` change) and exposes loading/error state.
 * `reload()` re-runs the fetch, e.g. after a create/update/delete.
 */
export default function useApiData(fetcher, deps = [], initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async (isCancelled = () => false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (!isCancelled()) setData(result ?? initialData);
    } catch (err) {
      if (!isCancelled()) setError(err.message || 'Something went wrong');
    } finally {
      if (!isCancelled()) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    load(() => cancelled);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload: () => load(), setData };
}
