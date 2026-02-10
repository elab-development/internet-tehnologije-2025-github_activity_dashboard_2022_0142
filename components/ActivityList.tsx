"use client";

import { useState, useEffect } from "react";
import ActivityItem from "./ActivityItem";
import { useRepoCommits } from "@/hooks/useRepoCommits";
import { useContributors } from "@/hooks/useContributors";
import PlaceholderCard from "./PlaceholderCard";
import { Commit } from "@/types/commit";

type Props = {
  owner: string;
  repoName: string;
};

export default function ActivityList({ owner, repoName }: Props) {
  const [page, setPage] = useState(1);
  const [author, setAuthor] = useState("");
  const [allCommits, setAllCommits] = useState<Commit[]>([]);
  
  const { data: contributors, loading: contributorsLoading } = useContributors(owner, repoName);
  const { commits, loading: commitsLoading } = useRepoCommits(owner, repoName, page, author);

  useEffect(() => {
    if (commits && commits.length > 0) {
      setAllCommits((prev) => (page === 1 ? commits : [...prev, ...commits]));
    } else if (page === 1 && commits.length === 0) {
      setAllCommits([]); 
    }
  }, [commits, page]);

  
  const handleAuthorChange = (newAuthor: string) => {
    setAuthor(newAuthor);
    setPage(1);
    setAllCommits([]);
  };

  const hasMore = commits.length === 10;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold text-gray-500">Filter by Contributor</label>
        <select 
          value={author}
          disabled={contributorsLoading}
          onChange={(e) => handleAuthorChange(e.target.value)}
          className="text-xs border border-gray-800 p-2 outline-none w-full max-w-xs bg-white cursor-pointer rounded-none disabled:opacity-50"
        >
          <option value="">All Contributors</option>
          {Array.isArray(contributors) && contributors.map((user: any) => (
            <option key={user.author} value={user.author}>
              {user.author} ({user.commits} commits)
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {allCommits.map((commit, index) => (
          <ActivityItem key={`${commit.sha}-${index}`} activity={commit} />
        ))}
        
        {commitsLoading && Array.from({ length: 5 }).map((_, i) => (
          <PlaceholderCard key={`skeleton-${i}`} />
        ))}
      </ul>

      {allCommits.length === 0 && !commitsLoading && (
        <p className="text-sm text-gray-500 border border-dashed border-gray-300 p-8 text-center">
          No commits found.
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button 
            disabled={commitsLoading}
            onClick={() => setPage(p => p + 1)}
            className="text-xs border border-gray-800 px-8 py-3 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            {commitsLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}