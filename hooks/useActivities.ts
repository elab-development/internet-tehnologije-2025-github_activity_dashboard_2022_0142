"use client";
//not used anymore

import { useEffect, useState } from "react";
import { Activity } from "@/types/activity";

export function useActivities(owner: string, repo: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      try {
        const res = await fetch(`/api/github/activities?owner=${owner}&repo=${repo}`);
        const data = await res.json();
        setActivities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch activities", err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }

    if (owner && repo) fetchActivities();
  }, [owner, repo]);

  return { activities, loading };
}