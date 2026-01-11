import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { bookmarkRepository } from "@/lib/repositories/bookmark.repository";

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

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await bookmarkRepository.getUserBookmarks(
      session.user.email
    );

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error("GET Bookmarks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}