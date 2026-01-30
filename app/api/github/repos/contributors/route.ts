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
  if (cached) return NextResponse.json(JSON.parse(cached));

  const res = await octokit.rest.repos.getContributorsStats({ owner, repo });

  // GitHub returns 202 if it's calculating the data
  if (res.status === 202) return NextResponse.json({ pending: true });

  const data = (res.data as any[])
    .map((item) => ({
      author: item.author.login,
      commits: item.total,
    }))
    .sort((a, b) => b.commits - a.commits); // Highest commits first

  await redis.set(key, JSON.stringify(data), "EX", 3600);
  return NextResponse.json(data);
}