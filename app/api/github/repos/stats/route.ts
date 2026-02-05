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

    // 1. Get Repo metadata for the creation date (to calculate "all-time" years)
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const creationYear = new Date(repoData.created_at).getFullYear();
    const currentYear = new Date().getFullYear();

    // 2. Get Recent Activity (Daily/Weekly) - Returns last 52 weeks
    const activityRes = await octokit.rest.repos.getCommitActivityStats({ owner, repo });
    
    // GitHub Status 202 means they are calculating the stats in the background
    if (activityRes.status === 202) {
      return NextResponse.json({ status: "processing" }, { status: 202 });
    }

    const activityData = activityRes.data;

    // 3. Fetch All-Time Yearly Data via Search API
    const years = Array.from({ length: currentYear - creationYear + 1 }, (_, i) => creationYear + i);
    
    const yearly = await Promise.all(
      years.map(async (year) => {
        const q = `repo:${owner}/${repo} author-date:${year}-01-01..${year}-12-31`;
        const { data } = await octokit.rest.search.commits({ q, per_page: 1 });
        return { label: year.toString(), count: data.total_count };
      })
    );

    const result = {
      // Last 4 weeks of daily data
      daily: activityData.slice(-4).flatMap((week) => 
        week.days.map((count, dayIndex) => ({ day: dayIndex, count }))
      ),
      // Full year of weekly data
      weekly: activityData.map((week, index) => ({ week: index, count: week.total })),
      // Historical yearly data
      yearly: yearly
    };

    // Cache stats for 1 hour (3600s) as historical data doesn't change fast
    await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}