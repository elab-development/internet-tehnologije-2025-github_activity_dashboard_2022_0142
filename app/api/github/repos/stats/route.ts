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
    if (cached) return NextResponse.json(JSON.parse(cached));

    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const [{ data: repoData }, activityRes, { data: veryRecent }] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }),
      octokit.rest.repos.getCommitActivityStats({ owner, repo }),
      octokit.rest.repos.listCommits({
        owner,
        repo,
        since: threeDaysAgo.toISOString(),
        per_page: 100
      })
    ]);

    if (activityRes.status === 202) {
      return NextResponse.json({ status: "processing" }, { status: 202 });
    }

    const activityData = (activityRes.data as any[]) || [];
    const allDays = activityData.flatMap((week) => week.days);
    const last30DaysCounts = allDays.slice(-30);

    const dailyData = last30DaysCounts.map((count, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split("T")[0];

      const liveCount = veryRecent.filter(c => 
        new Date(c.commit.author?.date!).toISOString().split("T")[0] === dateStr
      ).length;

      return {
        day: dateStr,
        count: Math.max(count, liveCount),
      };
    });

    const creationYear = new Date(repoData.created_at).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - creationYear + 1 }, (_, i) => creationYear + i);

    const yearly = await Promise.all(
      years.map(async (year) => {
        const q = `repo:${owner}/${repo} author-date:${year}-01-01..${year}-12-31`;
        const { data } = await octokit.rest.search.commits({ q, per_page: 1 });
        return { label: year.toString(), count: data.total_count };
      })
    );

    const result = {
      daily: dailyData,
      weekly: activityData.map((week, index) => ({ week: index, count: week.total })),
      yearly: yearly,
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}