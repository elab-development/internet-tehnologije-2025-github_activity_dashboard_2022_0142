import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const key = `full_commits:${owner}:${repo}`;
  const cached = await redis.get(key);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  try {
    const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
      owner,
      repo,
      per_page: 100,
    });

    const stats: Record<string, number> = {};

    commits.forEach((item) => {
      const date = item.commit.committer?.date?.slice(0, 10);
      if (date) {
        stats[date] = (stats[date] || 0) + 1;
      }
    });

    const data = Object.entries(stats)
      .map(([date, count]) => ({ date, commits: count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    await redis.set(key, JSON.stringify(data), "EX", 3600);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}