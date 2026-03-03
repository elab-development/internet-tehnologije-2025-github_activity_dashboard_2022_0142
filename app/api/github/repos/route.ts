import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { auth } from "@/lib/auth";
import { bookmarkRepository } from "@/lib/repositories/bookmark.repository";
import { redis } from "@/lib/redis"; 
import { Repo } from "@/types/repo";

export async function GET(request: Request) {
  try {
    const session = await auth(); 
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase(); 
    const type = searchParams.get("type") ?? "repo";
    const page = Number(searchParams.get("page") ?? 1);
    const perPage = 10;

    if (!query) {
      return NextResponse.json({ items: [], totalCount: 0 });
    }

    const finalQuery = type === "user" ? `user:${query}` : query;
    const cacheKey = `gh:search:${type}:${query}:p:${page}`;
    let searchData;

    try {
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        searchData = cached;
      } else {
        const response = await octokit.rest.search.repos({
          q: finalQuery,
          page,
          per_page: perPage,
        });
        searchData = {
          items: response.data.items,
          totalCount: response.data.total_count,
        };
        await redis.set(cacheKey, searchData, {ex:30});
      }
    } catch (err: any) {
      if (err.status === 422) {
        searchData = { items: [], totalCount: 0 };
      } else {
        const response = await octokit.rest.search.repos({ q: finalQuery, page, per_page: perPage });
        searchData = { items: response.data.items, totalCount: response.data.total_count };
      }
    }

    if (!session?.user?.email) {
      return NextResponse.json({
        items: (searchData?.items ?? []).map((repo: Repo) => ({ ...repo, isBookmarked: false })),
        totalCount: searchData?.totalCount ?? 0,
      });
    }

    const bookmarks = await bookmarkRepository.getUserBookmarks(session.user.email);
    const bookmarkedSet = new Set(bookmarks.map(b => b.repoName));

    const items : Repo[] = (searchData?.items ?? []).map((repo: Repo) => ({
      ...repo,
      isBookmarked: bookmarkedSet.has(repo.full_name),
    }));

    return NextResponse.json({ items, totalCount: searchData?.totalCount ?? 0 });

  } catch (globalError: any) {
    if (globalError.status === 422) {
      return NextResponse.json({ items: [], totalCount: 0 });
    }
    return NextResponse.json({ items: [], totalCount: 0, error: "Internal Server Error" }, { status: 500 });
  }
}