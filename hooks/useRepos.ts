"use client";

import { useEffect, useState } from "react";
import { Repo } from "@/types/repo";

export function useRepos(query: string, page: number, type: string) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setRepos([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    async function fetchRepos() {
      setLoading(true);
      try {
        const res = await fetch(`/api/github/repos?q=${query}&page=${page}&type=${type}`);
        const data = await res.json();
        setRepos(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
      } catch (err) {
        console.error("Failed to fetch repos", err);
        setRepos([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [query, page, type]);

  return { repos, totalCount, loading };
}