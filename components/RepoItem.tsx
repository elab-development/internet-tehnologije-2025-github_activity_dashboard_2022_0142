"use client";

import { Repo } from "@/types/repo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  repo: Repo;
};

export default function RepoItem({ repo }: Props) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(repo.isBookmarked);

  const toggleBookmark = async () => {
    if (!session || isSubmitting) return;

    const previousState = isBookmarked;
    setIsSubmitting(true);
    setIsBookmarked(!previousState); 

    try {
      const response = await fetch("/api/bookmarks", {
        method: previousState ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName: repo.full_name }),
      });

      if (!response.ok) throw new Error("Sync failed");
    } catch (error) {
      setIsBookmarked(previousState); 
      console.error("Bookmark error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <li className="p-4 bg-gray-100 border border-gray-800 flex justify-between items-center transition-all">
      <div className="min-w-0 flex-1">
        <Link href={`/${repo.full_name}`} className="font-semibold hover:underline block truncate">
          {repo.full_name}
        </Link>
        <p className="text-sm text-gray-400 mt-1 line-clamp-3">
          {repo.description ?? "No description available"}
        </p>
      </div>

      {session && (
        <button
          onClick={toggleBookmark}
          disabled={isSubmitting}
          className={`ml-4 px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            isBookmarked
              ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-yellow-200/50"
              : "bg-white border border-gray-700 text-gray-700 hover:bg-gray-50"
          } ${isSubmitting ? "opacity-70 cursor-not-allowed scale-95" : "active:scale-95"}`}
        >
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      )}
    </li>
  );
}