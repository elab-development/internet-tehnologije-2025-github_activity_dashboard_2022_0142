import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { auth } from "@/lib/auth";
import { bookmarkRepository } from "@/lib/repositories/bookmark.repository";
import { redis } from "@/lib/redis"; 

export async function GET(request: Request) {
  const session = await auth(); 
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase(); 
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = 10;

  if (!query) {
    return NextResponse.json({ items: [], totalCount: 0 });
  }

  const cacheKey = `gh:search:$aa{query}:p:${page}`;
  let searchData;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Data retrieved from cache.");
      searchData = JSON.parse(cached);
    } else {
      console.log("Data not cached, fetched instead.");
      const response = await octokit.rest.search.repos({
        q: query,
        page,
        per_page: perPage,
      });
      
      searchData = {
        items: response.data.items,
        totalCount: response.data.total_count,
      };

      await redis.set(cacheKey, JSON.stringify(searchData), "EX", 30);
    }
  } catch (err) {
    console.error("Redis Error:", err);
    const response = await octokit.rest.search.repos({ q: query, page, per_page: perPage });
    searchData = { items: response.data.items, totalCount: response.data.total_count };
  }

  if (!session?.user?.email) {
    return NextResponse.json({
      items: searchData.items.map((repo: any) => ({ ...repo, isBookmarked: false })),
      totalCount: searchData.totalCount,
    });
  }

  const bookmarks = await bookmarkRepository.getUserBookmarks(session.user.email);
  const bookmarkedSet = new Set(bookmarks.map(b => b.repoName));

  const items = searchData.items.map((repo: any) => ({
    ...repo,
    isBookmarked: bookmarkedSet.has(repo.full_name),
  }));

  return NextResponse.json({ items, totalCount: searchData.totalCount });
}