import Link from "next/link";
import { Repo } from "@/types/repo";
import BookmarkButton from "./BookmarkButton";

export default function RepoItem({ repo }: { repo: Repo }) {
  return (
    <li className="p-4 bg-gray-100 border-2 border-gray-800 flex justify-between items-center transition-all relative">
      <div className="min-w-0 flex-1">
        <Link href={`/${repo.full_name}`} className="text-xl font-semibold hover:underline block truncate">
          {repo.full_name}
        </Link>
        <p className="text-lg text-gray-500 mt-1 line-clamp-3">
          {repo.description ?? "No description available"}
        </p>
      </div>

      <div className="ml-4">
        <BookmarkButton repoFullName={repo.full_name} initialIsBookmarked={repo.isBookmarked} />
      </div>
    </li>
  );
}