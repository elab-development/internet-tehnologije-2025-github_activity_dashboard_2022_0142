import { prisma } from "@/lib/db/prisma";

export const UserRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create(email: string, password: string, role: "USER" | "ADMIN" = "USER") {
    return prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });
  },

  async getAllWithBookmarkCount() {
    return prisma.user.findMany({
      include: {
        _count: {
          select: { bookmarks: true }
        }
      }
    });
  },

  async updateRole(id: string, role: "USER" | "ADMIN") {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }
};
