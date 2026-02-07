"use client";

import { Repo } from "@/types/repo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  repo: Repo;
};

const PixelBookmarkIcon = ({ filled }: { filled: boolean | undefined}) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className="rendering-pixelated"
  >
    <path d="M5 3h14v18l-7-4-7 4V3Z" />
  </svg>
);

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
    <li className="p-4 bg-gray-100 border-2 border-gray-800 flex justify-between items-center transition-all">
      <div className="min-w-0 flex-1">
        <Link href={`/${repo.full_name}`} className="text-xl font-bold hover:underline block truncate">
          {repo.full_name}
        </Link>
        <p className="text-base text-gray-500 mt-1 line-clamp-3">
          {repo.description ?? "No description available"}
        </p>
      </div>

      {session && (
        <button
          onClick={toggleBookmark}
          disabled={isSubmitting}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          className={`ml-4 p-2.5 transition-all duration-200 border-2 ${
            isBookmarked
              ? "bg-yellow-400 border-yellow-600 text-yellow-900"
              : "bg-white border-gray-400 text-gray-400 hover:text-gray-600 hover:border-gray-600"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "active:scale-90"}`}
        >
          <PixelBookmarkIcon filled={isBookmarked} />
        </button>
      )}
    </li>
  );
}