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

  const handleBookmark = async () => {
    if (isSubmitting || isBookmarked) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: repo.full_name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add bookmark");
      }

      // optimistic success
      setIsBookmarked(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <li className="p-4 bg-gray-100 border border-gray-800 rounded-lg flex justify-between items-center">
      <div>
        <Link
          href={`/${repo.full_name}`}
          className="font-semibold hover:underline"
        >
          {repo.full_name}
        </Link>
        <p className="text-sm text-gray-400 mt-1">
          {repo.description ?? "No description"}
        </p>
      </div>

      {session && (
        <button
          onClick={handleBookmark}
          disabled={isSubmitting || isBookmarked}
          type="button"
          aria-label="Bookmark repository"
          className={`px-3 py-1 rounded transition ${
            isBookmarked
              ? "text-yellow-600 bg-yellow-100 cursor-default"
              : isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
          }`}
        >
          {isBookmarked ? "Bookmarked" : isSubmitting ? "Saving..." : "Bookmark"}
        </button>
      )}
    </li>
  );
}
