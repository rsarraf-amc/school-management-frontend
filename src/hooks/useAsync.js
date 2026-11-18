import { useCallback, useEffect, useRef, useState } from "react";

export default function useAsync(fn, initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fnRef.current());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, loading, error, setError, reload };
}
