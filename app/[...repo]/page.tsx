"use client";

import { use } from "react";
import ActivityList from "@/components/ActivityList";

export default function RepoActivityPage({ params }: { params: Promise<{ repo: string[] }> }) {
  const { repo: pathSegments } = use(params);
  const [owner, repoName] = pathSegments;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Activities for {owner}/{repoName}
      </h1>

      <ActivityList owner={owner} repoName={repoName}/>
    </div>
  );
}