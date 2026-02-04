"use client";

import { useEffect, useState } from "react";

interface Commit {
  sha: string;
  message: string;
  author: string;
  login?: string;
  avatar?: string;
  date: string;
  url: string;
}

export function useRepoCommits(owner: string, repo: string, page: number, author?: string) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner || !repo) {
      setCommits([]);
      setLoading(false);
      return;
    }

    async function fetchCommits() {
      setLoading(true);
      try {
        const authorParam = author ? `&author=${author}` : "";
        const res = await fetch(
          `/api/repos/commits?owner=${owner}&repo=${repo}&page=${page}${authorParam}`
        );

        if (!res.ok) throw new Error("Failed to fetch commits");

        const data = await res.json();
        setCommits(data ?? []);
        setError(null);
      } catch (err: any) {
        console.error("Commits fetch error:", err);
        setError(err.message);
        setCommits([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, [owner, repo, page, author]);

  return { commits, loading, error };
}