// app/page.tsx

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import RepoList from '@/components/RepoList';
import Pagination from '@/components/Pagination';
import { useRepos } from '@/hooks/useRepos';
import { Suspense } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "repo";
  const page = Number(searchParams.get("page")) || 1;

  const { repos, totalCount, loading } = useRepos(query, page, type);
  const totalPages = Math.ceil(totalCount / 10);

  function handleSearch(value: string, newType: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
      params.set("type", newType);
      params.set("page", "1");
    } else {
      params.delete("q");
      params.delete("type");
      params.delete("page");
    }

    router.replace(`/?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className={query
    ? "space-y-8"
    : "flex flex-col items-center justify-center min-h-[60vh]"}>

      <div className={query ? "w-full" : "w-full max-w-2xl"}>
        <SearchBox
          initialValue={query}
          initialType={type}
          onSearch={handleSearch}
        />
      </div>

      {query && (
        <div className="w-full space-y-8">
          <RepoList repos={repos} loading={loading} query={query}
type={type}/>

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

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading main content...</div>}>
      <HomeContent />
    </Suspense>
  );
}
