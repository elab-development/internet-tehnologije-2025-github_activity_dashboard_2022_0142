"use client";

import { useEffect, useState } from "react";

export function useRepoStats(owner: string, repo: string) {
  const [data, setData] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo) return;

    let timer: NodeJS.Timeout;
    const repoFullName = `${owner}/${repo}`;

    async function checkBookmark() {
      try {
        const res = await fetch(`/api/bookmarks/check?repoName=${repoFullName}`);
        const json = await res.json();
        setIsBookmarked(json.isBookmarked);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchStats() {
      try {
        const res = await fetch(`/api/github/repos/stats?owner=${owner}&repo=${repo}`);
        
        if (res.status === 202) {
          timer = setTimeout(fetchStats, 3000);
          return;
        }

        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    setLoading(true);
    checkBookmark();
    fetchStats();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [owner, repo]);

  return { data, isBookmarked, loading };
}