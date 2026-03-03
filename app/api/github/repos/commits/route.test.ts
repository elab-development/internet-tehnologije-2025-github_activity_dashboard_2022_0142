import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { GET } from "./route";
import { redis } from "@/lib/redis";
import { octokit } from "@/lib/github";

vi.mock("@/lib/github", () => ({
  octokit: {
    rest: {
      repos: {
        listCommits: vi.fn(),
      },
    },
  },
}));

vi.mock("@/lib/redis", () => ({
    redis: {
        get: vi.fn(),
        set: vi.fn()    
    }
}));

describe("commits API route",  () => {
    const mockCommits = [{ sha: "123", message: "Cached commit" }];
    beforeEach(()=>vi.clearAllMocks());
    
    describe("caching logic", () => {
        it("returns cached data on a cache hit", async () => {
            vi.mocked(redis.get as Mock).mockResolvedValue(mockCommits);
            
            const req = new Request("http://localhost/api/commits?owner=facebook&repo=react");
            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockCommits);
            expect(octokit.rest.repos.listCommits).not.toHaveBeenCalled();
        })

        it("returns external data on a cache miss", async () => {
            vi.mocked(redis.get).mockResolvedValue(null);

            const mockGithubResponse = {
                data: [
                    {
                        sha: "123",
                        commit: { 
                            message: "Fix bug", 
                            author: { name: "Jane Doe", date: "2024-01-01" } 
                        },
                        author: { login: "janedoe", avatar_url: "https://photo.com" },
                        html_url: "https://github.com/123"
                    }
                ]
            };
            vi.mocked(octokit.rest.repos.listCommits).mockResolvedValue(mockGithubResponse as any);

            const req = new Request("http://localhost/api/commits?owner=facebook&repo=react");
            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(octokit.rest.repos.listCommits).toHaveBeenCalledWith({
                owner: "facebook",
                repo: "react",
                author: undefined,
                per_page: 10,
                page: 1,
            });
            expect(redis.set).toHaveBeenCalled();
            expect(data[0].sha).toBe("123");
        });
    })

    describe("error handling", () => {
      it("returns 400 when owner or repo is missing", async () => {
        const req = new Request("http://localhost/api/commits?owner=facebook");
        
        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Owner and Repo are required");
        
        expect(redis.get).not.toHaveBeenCalled();
        expect(octokit.rest.repos.listCommits).not.toHaveBeenCalled();
      });
    });

    it("returns 404 when GitHub repository is not found", async () => {
        vi.mocked(redis.get).mockResolvedValue(null);

        vi.mocked(octokit.rest.repos.listCommits).mockRejectedValue({
          status: 404,
        });

        const req = new Request("http://localhost/api/commits?owner=aaa&repo=aaaa");
        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe("Repository not found");
      });

      it("returns 500 for unexpected server errors", async () => {
        vi.mocked(redis.get).mockResolvedValue(null);

        vi.mocked(octokit.rest.repos.listCommits).mockRejectedValue(new Error("Boom!"));

        const req = new Request("http://localhost/api/commits?owner=fb&repo=react");
        const response = await GET(req);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Internal Server Error");
      });
})