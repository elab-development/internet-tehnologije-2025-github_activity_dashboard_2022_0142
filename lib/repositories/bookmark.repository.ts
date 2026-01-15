import { prisma } from "@/lib/db/prisma";

export const bookmarkRepository = {
  async addBookmark(email: string, repoName: string) {
    return prisma.bookmark.create({
      data: {
        repoName,
        user: {
          connect: { email }
        }
      },
    });
  },

  async getUserBookmarks(email: string) {
    return prisma.bookmark.findMany({
      where: {
        user: {
          email: email
        }
      },
    });
  },

  async removeBookmark(email: string, repoName: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    return prisma.bookmark.deleteMany({
      where: {
        userId: user.id,
        repoName: repoName,
      },
    });
  },
};