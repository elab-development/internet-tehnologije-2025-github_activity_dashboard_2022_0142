/**
 * @swagger
 * /api/github/repos/contributors:
 *   get:
 *     summary: Get repository contributors stats
 *     tags:
 *       - GitHub
 *     description: Returns a list of contributors for the specified repository.
 *     parameters:
 *       - in: query
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: Repository owner username
 *       - in: query
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *         description: Repository name
 *     responses:
 *       200:
 *         description: List of contributors with commit counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   author:
 *                     type: string
 *                   commits:
 *                     type: integer
 *       202:
 *         description: GitHub stats computation pending
 *       400:
 *         description: Missing owner or repo query parameters
 *       500:
 *         description: Internal Server Error
 */
import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const key = `contributors:${owner}:${repo}`;
  const cached = await redis.get(key);
  if (cached) return NextResponse.json(cached);

  const res = await octokit.rest.repos.getContributorsStats({ owner, repo });

  if (res.status === 202) return NextResponse.json({ pending: true });

  const data = (res.data as any[])
    .map((item) => ({
      author: item.author.login,
      commits: item.total,
    }))
    .sort((a, b) => b.commits - a.commits);

  await redis.set(key, data, {ex: 3600});
  return NextResponse.json(data);
}