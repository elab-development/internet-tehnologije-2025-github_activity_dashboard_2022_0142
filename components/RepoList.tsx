import { Repo } from "@/types/repo";
import RepoItem from "./RepoItem";

type Props = {
  repos: Repo[];
  loading: boolean;
  query?: string;
};

export default function RepoList({ repos, loading, query }: Props) {
  // 1. If we are searching and there's no query, show nothing
  

  if (query === "") return null;

  // 2. HIGHEST PRIORITY: If we are loading, show ONLY the loading state
  if (loading) return <p className="text-gray-400">Loading...</p>;
  
  // 3. If we are NOT loading and the array is empty, then it's truly empty
  if (repos.length === 0) {
    // If query is undefined, we are on the bookmarks page
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