import { useState, useEffect, useCallback } from "react";

function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    const hasNullDep = deps.some((d) => d === null || d === undefined);
    if (hasNullDep) {
      setLoading(true);
      return () => {};
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, deps);

  useEffect(() => {
    return execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

export default useApi;
