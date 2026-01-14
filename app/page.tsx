"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import RepoList from "@/components/RepoList";
import Pagination from "@/components/Pagination"; // Moved here
import { useRepos } from "@/hooks/useRepos";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get("q") ?? "";
  const [page, setPage] = useState(1);

  // Data fetching now happens at the Page level
  const { repos, totalCount, loading } = useRepos(query, page);
  const totalPages = Math.ceil(totalCount / 10);

  // Reset to page 1 whenever the search query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`/?${params.toString()}`);
  }

  return (
    <section className="space-y-8">
      <SearchBox initialValue={query} onSearch={handleSearch} />
      
      {/* RepoList now only cares about the list and loading state */}
      <RepoList repos={repos} loading={loading} query={query}/>

      {/* Pagination is controlled here */}
      {query && totalPages > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </section>
  );
}