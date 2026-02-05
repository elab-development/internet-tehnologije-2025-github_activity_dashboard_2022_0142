"use client";
//not used anymore

import { useEffect, useState, useRef } from "react";

export function useCommitTimeline(owner: string, repo: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!owner || !repo) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/github/repos/commits?owner=${owner}&repo=${repo}`);
        const result = await res.json();

        if (result.pending) {
          setLoading(true);
          timerRef.current = setTimeout(fetchData, 3000);
        } else {
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch commits:", error);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, [owner, repo]);

  return { data, loading };
}