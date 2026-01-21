import { Repo } from "@/types/repo";
import RepoItem from "./RepoItem";
import RepoItemPlaceholder from "./RepoItemPlaceholder";

type Props = {
  repos: Repo[];
  loading: boolean;
  query?: string;
};

export default function RepoList({ repos, loading, query }: Props) {
  if (query === "") return null;

  if (loading) {
    return (
      <ul className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <RepoItemPlaceholder key={i} />
        ))}
      </ul>
    );
  }
  if (query === "") return null;

  if (loading) return <p className="text-gray-400">Loading...</p>;
  
  if (repos.length === 0) {   
    return <p className="text-gray-500">{"No repositories found."}</p>;
  }

  return (
    <ul className="space-y-4">
      {repos.map((repo) => (
        <RepoItem key={repo.id} repo={repo} />
      ))}
    </ul>
  );
}