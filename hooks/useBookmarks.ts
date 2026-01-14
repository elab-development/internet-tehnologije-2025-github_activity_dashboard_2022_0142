"use client";

import { useEffect, useState } from "react";
import { Repo } from "@/types/repo";

export function useBookmarks(page: number) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      setLoading(true);
      try {
        // Only one network request!
        const res = await fetch(`/api/bookmarks?page=${page}`);
        const data = await res.json();
        setRepos(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
      } catch (err) {
        setRepos([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, [page]);

  return { repos, totalCount, loading };
}