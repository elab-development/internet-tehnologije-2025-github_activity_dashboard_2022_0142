import { useEffect, useState } from "react";

export function useCommitTimeline(owner: string, repo: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let retry: NodeJS.Timeout;

    async function fetchData() {
      const res = await fetch(
        `/api/github/repos/commits?owner=${owner}&repo=${repo}`
      );
      const json = await res.json();

      if (json?.pending) {
        retry = setTimeout(fetchData, 3000);
        return;
      }

      setData(json);
      setLoading(false);
    }

    if (owner && repo) fetchData();

    return () => clearTimeout(retry);
  }, [owner, repo]);

  return { data, loading };
}
