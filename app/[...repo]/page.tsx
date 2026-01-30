"use client";

import { use } from "react";
import ActivityList from "@/components/ActivityList";
import CommitsTimelineChart from "@/components/CommitsTimelineChart";
import ContributorsChart from "@/components/ContributorsChart"; 
import { useCommitTimeline } from "@/hooks/useCommitTimeline";
import { useContributors } from "@/hooks/useContributors";

export default function RepoActivityPage({
  params,
}: {
  params: Promise<{ repo: string[] }>;
}) {
  const { repo: pathSegments } = use(params);
  const [owner, repoName] = pathSegments;

  const { data: timelineData, loading: timelineLoading } = useCommitTimeline(owner, repoName);
  const { data: contribData, loading: contribLoading } = useContributors(owner, repoName);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {owner}/{repoName}
      </h1>

      <div className="border p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">Commits over time</h2>
        {timelineLoading ? (
          <div className="h-70 flex items-center justify-center text-gray-500">
            Loading...
          </div>
        ) : (
          <CommitsTimelineChart data={timelineData} />
        )}

        <h2 className="text-lg font-semibold mb-2">Commits per User</h2>
        {contribLoading ? (
          <div className="h-70 flex items-center justify-center text-gray-500">
            Loading...
          </div>
        ) : (
          <ContributorsChart data={contribData} />
        )}
      </div>
      <h1 className="text-2xl font-semibold mb-2">Recent events</h1>
      <ActivityList owner={owner} repoName={repoName} />
    </div>
  );
}