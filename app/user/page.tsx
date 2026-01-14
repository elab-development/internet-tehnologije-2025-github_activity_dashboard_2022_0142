"use client";

import { useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import RepoList from "@/components/RepoList";
import Pagination from "@/components/Pagination";

export default function UserBookmarksPage() {
  const [page, setPage] = useState(1);
  const { repos, totalCount, loading } = useBookmarks(page);
  
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold">Your Bookmarks</h1>

      <RepoList repos={repos} loading={loading} />

      {totalCount > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </section>
  );
}