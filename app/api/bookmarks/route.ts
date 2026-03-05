/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get user bookmarks
 *     tags:
 *       - Bookmarks
 *     description: Returns paginated GitHub repositories bookmarked by the authenticated user.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of bookmarked repositories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   description: List of GitHub repositories
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       html_url:
 *                         type: string
 *                       stargazers_count:
 *                         type: integer
 *                       isBookmarked:
 *                         type: boolean
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of bookmarks
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Add a bookmark
 *     tags:
 *       - Bookmarks
 *     description: Adds a repository to the authenticated user's bookmarks.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repoName:
 *                 type: string
 *                 example: "vercel/next.js"
 *             required:
 *               - repoName
 *     responses:
 *       201:
 *         description: Bookmark added successfully
 *       400:
 *         description: Missing repoName
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Remove a bookmark
 *     tags:
 *       - Bookmarks
 *     description: Removes a repository from the authenticated user's bookmarks.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repoName:
 *                 type: string
 *                 example: "vercel/next.js"
 *             required:
 *               - repoName
 *     responses:
 *       200:
 *         description: Bookmark removed
 *       400:
 *         description: Missing repoName
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bookmark not found
 *       500:
 *         description: Internal server error
 */
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