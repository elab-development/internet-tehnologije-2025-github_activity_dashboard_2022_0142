import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { auth } from "@/lib/auth";
import { bookmarkRepository } from "@/lib/repositories/bookmark.repository";

export async function GET(request: Request) {
  const session = await auth(); 

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = 10;

  if (!query) {
    return NextResponse.json({ items: [], totalCount: 0 });
  }

  const response = await octokit.rest.search.repos({
    q: query,
    page,
    per_page: perPage,
  });

  if (!session?.user?.email) {
    return NextResponse.json({
      items: response.data.items.map(repo => ({
        ...repo,
        isBookmarked: false,
      })),
      totalCount: response.data.total_count,
    });
  }

  const bookmarks = await bookmarkRepository.getUserBookmarks(
    session.user.email
  );

  const bookmarkedSet = new Set(
    bookmarks.map(b => b.repoName)
  );

  const items = response.data.items.map(repo => ({
    ...repo,
    isBookmarked: bookmarkedSet.has(repo.full_name),
  }));

  return NextResponse.json({
    items,
    totalCount: response.data.total_count,
  });
}
