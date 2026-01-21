"use client"

import ActivityItem from "./ActivityItem";
import { useActivities } from "@/hooks/useActivities";
import ActivityItemPlaceholder from "./ActivityItemPlaceholder";

type Props = {
    owner: string;
    repoName: string;
};

export default function ActivityList({ owner, repoName }: Props) {
  const { activities, loading } = useActivities(owner, repoName);

  return (
    <div className="space-y-6">
      {loading ? (
        <ul className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ActivityItemPlaceholder key={i} />
          ))}
        </ul>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          {activities.length === 0 && <p>No recent activity found.</p>}
        </ul>
      )}
    </div>
  );
}
