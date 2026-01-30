import { useEffect, useState } from "react";

export function useContributors(owner: string, repo: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let retry: NodeJS.Timeout;

    async function fetchData() {
      try {
        const res = await fetch(
          `/api/github/repos/contributors?owner=${owner}&repo=${repo}`
        );
        const json = await res.json();

        if (json?.pending) {
          // GitHub is still calculating, try again in 3 seconds
          retry = setTimeout(fetchData, 3000);
          return;
        }

        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contributors");
        setLoading(false);
      }
    }

    if (owner && repo) {
      setLoading(true);
      fetchData();
    }

    return () => clearTimeout(retry);
  }, [owner, repo]);

  return { data, loading, error };
}