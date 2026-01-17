"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import RepoList from "@/components/RepoList";
import Pagination from "@/components/Pagination";
import { useRepos } from "@/hooks/useRepos";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get("q") ?? "";
  
  const page = Number(searchParams.get("page")) || 1;

  const { repos, totalCount, loading } = useRepos(query, page);
  const totalPages = Math.ceil(totalCount / 10);

function handleSearch(value: string) {
  const params = new URLSearchParams(searchParams.toString());

  if (value) {
    params.set("q", value);
    params.set("page", "1"); // always mark first page
  } else {
    params.delete("q");
    params.delete("page");
  }

  router.replace(`/?${params.toString()}`);
}

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`/?${params.toString()}`);
  }

  const containerClass = query 
    ? "space-y-8" 
    : "flex flex-col items-center justify-center min-h-[60vh]";

  return (
    <div className={containerClass}>
      <div className={query ? "w-full" : "w-full max-w-2xl"}>
        <SearchBox initialValue={query} onSearch={handleSearch} />
      </div>
      
      {query && (
        <div className="w-full space-y-8">
          <RepoList repos={repos} loading={loading} query={query}/>

          {totalPages > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => handlePageChange(Math.max(1, page - 1))}
              onNext={() => handlePageChange(Math.min(totalPages, page + 1))}
            />
          )}
        </div>
      )}
    </div>
  );
}