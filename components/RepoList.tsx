import { Repo } from "@/types/repo";
import RepoItem from "./RepoItem";

type Props = {
  repos: Repo[];
  loading: boolean;
  query?: string;
};

export default function RepoList({ repos, loading, query }: Props) {
  if (query === "") return null;

  if (loading) return <p className="text-gray-400">Loading...</p>;
  
  if (repos.length === 0) {
    const message = query === undefined 
      ? "You haven't bookmarked any repos yet." 
      : "No repositories found.";
      
    return <p className="text-gray-500">{message}</p>;
  }

  return (
    <ul className="space-y-4">
      {repos.map((repo) => (
        <RepoItem key={repo.id} repo={repo} />
      ))}
    </ul>
  );
}