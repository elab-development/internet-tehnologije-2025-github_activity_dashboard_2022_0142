"use client";

import { useState } from "react";
import ActivityItem from "./ActivityItem";
import { useRepoCommits } from "@/hooks/useRepoCommits";
import { useContributors } from "@/hooks/useContributors"; // Added this hook
import ActivityItemPlaceholder from "./ActivityItemPlaceholder";

type Props = {
  owner: string;
  repoName: string;
};

export default function ActivityList({ owner, repoName }: Props) {
  const [page, setPage] = useState(1);
  const [author, setAuthor] = useState(""); 
  
  // 1. Fetch contributors for the combobox
  const { data: contributors, loading: contributorsLoading } = useContributors(owner, repoName);
  
  // 2. Fetch commits based on the selected contributor
  const { commits, loading: commitsLoading } = useRepoCommits(owner, repoName, page, author);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold text-gray-500">Filter by Contributor</label>
<select 
  value={author}
  disabled={contributorsLoading}
  onChange={(e) => {
    setAuthor(e.target.value);
    setPage(1);
  }}
  className="text-xs border border-gray-800 p-2 outline-none w-full max-w-xs bg-white cursor-pointer rounded-none disabled:opacity-50"
>
  <option value="">All Contributors</option>
  {contributors.map((user: any) => (
    <option key={user.author} value={user.author}>
      {user.author} ({user.commits} commits)
    </option>
  ))}
</select>
      </div>

      {commitsLoading ? (
        <ul className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ActivityItemPlaceholder key={i} />
          ))}
        </ul>
      ) : (
        <>
          <ul className="space-y-4">
            {commits.map((commit) => (
              <ActivityItem key={commit.sha} activity={commit} />
            ))}
            {commits.length === 0 && (
              <p className="text-sm text-gray-500 border border-dashed border-gray-300 p-8 text-center">
                No commits found for this user.
              </p>
            )}
          </ul>

          <div className="flex items-center gap-4 pt-4">
            <button 
              disabled={page === 1 || commitsLoading}
              onClick={() => setPage(p => p - 1)}
              className="text-xs border border-gray-800 px-4 py-2 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-mono">Page {page}</span>
            <button 
              disabled={commits.length < 10 || commitsLoading}
              onClick={() => setPage(p => p + 1)}
              className="text-xs border border-gray-800 px-4 py-2 disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}