import { NextResponse } from "next/server";
import { octokit } from "@/lib/github";
import { redis } from "@/lib/redis";

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
    if (cached) return NextResponse.json(JSON.parse(cached));

    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      author: author || undefined,
      per_page: perPage,
      page,
    });

    const commitData = response.data.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      login: c.author?.login,
      avatar: c.author?.avatar_url,
      date: c.commit.author.date,
      url: c.html_url,
    }));

    await redis.set(cacheKey, JSON.stringify(commitData), "EX", 300);

    return NextResponse.json(commitData);

  } catch (error: any) {
    if (error.status === 404) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}