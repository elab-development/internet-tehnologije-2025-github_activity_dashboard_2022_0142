/**
 * @swagger
 * /api/github/repos/stats:
 *   get:
 *     summary: Get repository commit statistics
 *     tags:
 *       - GitHub
 *     description: Returns daily, weekly, and yearly commit statistics for a GitHub repository.
 *     parameters:
 *       - in: query
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: Repository owner (GitHub username or organization)
 *       - in: query
 *         name: repo
 *         required: true
 *         schema:
 *           type: string
 *         description: Repository name
 *     responses:
 *       200:
 *         description: Repository statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 daily:
 *                   type: array
 *                   description: Commit counts for the last 30 days
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "Mar 5"
 *                       commits:
 *                         type: integer
 *                         example: 12
 *                     required:
 *                       - label
 *                       - commits
 *                 weekly:
 *                   type: array
 *                   description: Commit counts for the last 12 weeks
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "Mar 5"
 *                       commits:
 *                         type: integer
 *                         example: 12
 *                     required:
 *                       - label
 *                       - commits
 *                 yearly:
 *                   type: array
 *                   description: Commit counts grouped by year
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "2024"
 *                       commits:
 *                         type: integer
 *                         example: 340
 *                     required:
 *                       - label
 *                       - commits
 *       202:
 *         description: GitHub is still processing commit statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: processing
 *       400:
 *         description: Missing owner or repo parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */

import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      return NextResponse.json({ error: "Owner and Repo are required" }, { status: 400 });
    }

    const cacheKey = `gh:stats:${owner}:${repo}`;
    const cached = await redis.get(cacheKey);
    if (cached) return NextResponse.json(cached);

    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const [{ data: repoData }, activityRes, { data: veryRecent }] = await Promise.all([
      //will need this for created_at
      octokit.rest.repos.get({ owner, repo }),
      
      //returns last 52 weeks (52 arrays containing commit count for each day of week)
      octokit.rest.repos.getCommitActivityStats({ owner, repo }),
      
      octokit.rest.repos.listCommits({
        owner,
        repo,
        since: threeDaysAgo.toISOString(),
        //GitHub API can return max of 100 commits at once,
        //and it should be enough for most repos (we dont want to waste extra requests)
        per_page: 100
      })
    ]);

    if (activityRes.status === 202) {
      return NextResponse.json({ status: "processing" }, { status: 202 });
    }

    //when only using getCommitActivityStats() last few days of commits
    //were always missing, so in the following we make sure recent commits are included
    const activityData = activityRes.data;
    const allDays = activityData.flatMap((week) => week.days);
    
    const daily = allDays.slice(-30).map((count, i) => {
      //instead of increment we want acthual date
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      //YYYY-MM-DDTHH-MM-SS => YYYY-MM-DD
      const dateStr = date.toISOString().split("T")[0];
      
      const liveCount = veryRecent.filter(c => 
        new Date(c.commit.author?.date!).toISOString().split("T")[0] === dateStr
      ).length;

      return {
        label: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
        commits: Math.max(count, liveCount),
      };
    });

    const weekly = activityData.slice(-12).map((item, index, arr) => {
      const date = new Date();
      date.setDate(date.getDate() - (arr.length - 1 - index) * 7);
      return {
        label: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
        commits: item.total,
      };
    });

    const creationYear = new Date(repoData.created_at).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - creationYear + 1 }, (_, i) => creationYear + i);

    const yearly = await Promise.all(
      years.map(async (year) => {
        const q = `repo:${owner}/${repo} author-date:${year}-01-01..${year}-12-31`;
        const { data } = await octokit.rest.search.commits({ q, per_page: 1 });
        return { label: year.toString(), commits: data.total_count };
      })
    );

    const result = { daily, weekly, yearly };

    await redis.set(cacheKey, result, {ex: 300});
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message }, 
      { status: 500 }
    );
  }
}