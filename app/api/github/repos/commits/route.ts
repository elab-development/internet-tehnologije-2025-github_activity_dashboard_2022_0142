/**
 * @swagger
 * /api/github/repos/commits:
 *   get:
 *     summary: Get commits for a repository
 *     tags:
 *       - GitHub
 *     parameters:
 *       - in: query
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: Repository owner
 *       - in: query
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *         description: Repository name
 *       - in: query
 *         name: author
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter commits by author
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of commits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sha:
 *                     type: string
 *                     description: Commit SHA hash
 *                   message:
 *                     type: string
 *                     description: Commit message
 *                   author:
 *                     type: string
 *                     description: Commit author name
 *                   login:
 *                     type: string
 *                     description: GitHub login of author
 *                   avatar:
 *                     type: string
 *                     description: GitHub avatar URL
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Commit date
 *                   url:
 *                     type: string
 *                     description: Commit URL
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: Repository not found
 *       500:
 *         description: Internal server error
 */
import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { redis } from "@/lib/redis";
import { Commit } from "@/types/commit";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const author = searchParams.get("author");
    const page = Number(searchParams.get("page") ?? 1);
    const perPage = 10;

    if (!owner || !repo) {
      return NextResponse.json({ error: "Owner and Repo are required" }, { status: 400 });
    }

    const cacheKey = `gh:commits:${owner}:${repo}:${author ?? "all"}:p:${page}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      author: author || undefined,
      per_page: perPage,
      page,
    });

    const commitData: Commit[] = response.data.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      login: c.author?.login,
      avatar: c.author?.avatar_url,
      date: c.commit.author.date,
      url: c.html_url,
    }));

    await redis.set(cacheKey, commitData, {ex:300});

    return NextResponse.json(commitData);

  } catch (error: any) {
    if (error.status === 404) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}