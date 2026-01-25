"use client";

import { Repo } from "@/types/repo";
import RepoItemPlaceholder from "./RepoItemPlaceholder";
import RepoItem from "./RepoItem";

type Props = {
  repos: Repo[];
  loading: boolean;
  query: string;
  type: string;
};

export default function RepoList({ repos, loading, query, type }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[...Array(6)].map((_, i) => (
          <RepoItemPlaceholder key={i} />
        ))}
      </div>
    );
  }

  if (repos.length === 0 && query) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 font-medium">
          {type === "user" ? "No users found" : "No repositories found"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {repos.map((repo) => (
        <RepoItem key={repo.id} repo={repo} />
      ))}
    </div>
  );
}