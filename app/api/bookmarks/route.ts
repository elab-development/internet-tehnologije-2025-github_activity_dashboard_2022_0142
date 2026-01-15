import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { bookmarkRepository } from "@/lib/repositories/bookmark.repository";
import { octokit } from "@/lib/github";


export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoName } = await req.json();

    if (!repoName) {
      return NextResponse.json(
        { error: "repoFullName is required" },
        { status: 400 }
      );
    }

    const bookmark = await bookmarkRepository.addBookmark(
      session.user.email,
      repoName
    );

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("POST Bookmark Error:", error);
    return NextResponse.json(
      { error: "Failed to add bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ items: [], totalCount: 0 });

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = 10;

  const bookmarks = await bookmarkRepository.getUserBookmarks(session.user.email);
  const totalCount = bookmarks.length;
  
  const paginatedNames = bookmarks
    .slice((page - 1) * perPage, page * perPage)
    .map(b => `repo:${b.repoName}`)
    .join(" ");

  if (!paginatedNames) return NextResponse.json({ items: [], totalCount: 0 });

  const response = await octokit.rest.search.repos({
    q: paginatedNames,
    per_page: perPage,
  });

  return NextResponse.json({
    items: response.data.items.map(repo => ({ ...repo, isBookmarked: true })),
    totalCount
  });
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoName } = await req.json();

    if (!repoName) {
      return NextResponse.json(
        { error: "repoName is required" },
        { status: 400 }
      );
    }

    const result = await bookmarkRepository.removeBookmark(
      session.user.email,
      repoName
    );

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Bookmark Error:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}