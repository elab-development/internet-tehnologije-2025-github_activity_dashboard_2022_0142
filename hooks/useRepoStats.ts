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

    async function fetchData() {
      try {
        setLoading(true);

        const [statsRes, bookmarkRes] = await Promise.all([
          fetch(`/api/github/repos/stats?owner=${owner}&repo=${repo}`),
          fetch(`/api/bookmarks/check?repoName=${repoFullName}`)
        ]);

        if (statsRes.status === 202) {
          timer = setTimeout(fetchData, 3000);
          return;
        }

        const statsJson = await statsRes.json();
        const bookmarkJson = await bookmarkRes.json();

        setData(statsJson);
        setIsBookmarked(bookmarkJson.isBookmarked);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch repo data", err);
        setLoading(false);
      }
    }

    fetchData();
    return () => clearTimeout(timer);
  }, [owner, repo]);

  return { data, isBookmarked, loading };
}
