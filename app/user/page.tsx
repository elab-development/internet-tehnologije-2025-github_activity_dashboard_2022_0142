"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RepoItem from "@/components/RepoItem"; // Adjust path as needed
import { Repo } from "@/types/repo";

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [bookmarks, setBookmarks] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchBookmarks();
    }
  }, [status, router]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      
      // Map Prisma Bookmark model to the Repo type expected by RepoItem
      const formattedRepos: Repo[] = data.map((b: any) => ({
        id: b.id,
        full_name: b.repoName,
        description: "Your bookmarked repository", // Or fetch full details if needed
        isBookmarked: true,
      }));

      setBookmarks(formattedRepos);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="p-8 text-gray-400 text-center">Loading your profile...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <p className="text-gray-500">{session?.user?.email}</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-gray-400">You haven't bookmarked any repositories yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((repo) => (
            <RepoItem key={repo.id} repo={repo} />
          ))}
        </ul>
      )}
    </main>
  );
}