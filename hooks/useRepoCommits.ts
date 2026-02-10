"use client";

import { Commit } from "@/types/commit";
import { useEffect, useState } from "react";

export function useRepoCommits(owner: string, repo: string, page: number, author?: string) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo) return;

    async function fetchCommits() {
      setLoading(true);
      try {
        const authorParam = author ? `&author=${author}` : "";
        const res = await fetch(
          `/api/github/repos/commits?owner=${owner}&repo=${repo}&page=${page}${authorParam}`
        );
        const data = await res.json();
        setCommits(data ?? []);
      } catch (err) {
        console.error("Commits fetch error:", err);
        setCommits([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, [owner, repo, page, author]);

  return { commits, loading };
}