/**
 * @swagger
 * /api/bookmarks/check:
 *   get:
 *     summary: Check if a repo is bookmarked
 *     tags:
 *       - Bookmarks
 *     description: Returns whether the current user has bookmarked a specific repository.
 *     parameters:
 *       - in: query
 *         name: repoName
 *         schema:
 *           type: string
 *         required: true
 *         description: Full name of the repository to check
 *     responses:
 *       200:
 *         description: Bookmark status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isBookmarked:
 *                   type: boolean
 *       400:
 *         description: Missing repoName parameter
 *       401:
 *         description: Unauthorized
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { bookmarkRepository } from "@/lib/repositories/bookmark.repository";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ isBookmarked: false });
  }

  const { searchParams } = new URL(req.url);
  const repoName = searchParams.get("repoName");

  if (!repoName) {
    return NextResponse.json({ error: "repoName required" }, { status: 400 });
  }

  const bookmarks = await bookmarkRepository.getUserBookmarks(session.user.email);
  const isBookmarked = bookmarks.some((b) => b.repoName === repoName);

  return NextResponse.json({ isBookmarked });
}