"use client";

import { useEffect, useState } from "react";

export function useRepoStats(owner: string, repo: string) {
 const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo) return;

    let timer: NodeJS.Timeout;

    async function fetchData() {
      try {
        const res = await fetch(`/api/github/repos/stats?owner=${owner}&repo=${repo}`);
        
        if (res.status === 202) {
          setLoading(true);
          timer = setTimeout(fetchData, 3000);
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch timeline", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => clearTimeout(timer);
  }, [owner, repo]);

  return { data, loading };
}