"use client";

import { useEffect, useState } from "react";

export function useCommitTimeline(owner: string, repo: string) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!owner || !repo) return;

    setLoading(true);
    fetch(`/api/github/repos/commits?owner=${owner}&repo=${repo}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [owner, repo]);

  return { data, loading };
}