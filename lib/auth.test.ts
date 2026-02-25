import { describe, it, expect, vi, beforeEach } from "vitest";
import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("@/lib/repositories/user.repository", () => ({
  UserRepository: {
    findByEmail: vi.fn(),
  },
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: (config: any) => config,
}));

import bcrypt from "bcryptjs";
import { UserRepository } from "@/lib/repositories/user.repository";
import { authConfig } from "@/lib/auth.config";

describe("auth.config", () => {
  const provider = authConfig.providers[0] as any;
  const authorize = provider.authorize;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authorize()", () => {
    it("returns user when credentials are valid", async () => {
      const mockUser = {
        id: "1",
        email: "test@test.com",
        password: "hashed",
        role: "ADMIN",
      };

      (UserRepository.findByEmail as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);

      const result = await authorize({
        email: "test@test.com",
        password: "password",
      });

      expect(result).not.toBeNull();
      expect(result).toEqual({
        id: "1",
        email: "test@test.com",
        role: "ADMIN",
      });

      expect(UserRepository.findByEmail).toHaveBeenCalledWith(
        "test@test.com"
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password",
        "hashed"
      );
    });

    it("returns null when user does not exist", async () => {
      (UserRepository.findByEmail as any).mockResolvedValue(null);

      const result = await authorize({
        email: "no@test.com",
        password: "password",
      });

      expect(result).toBeNull();
    });

    it("returns null when password is invalid", async () => {
      const mockUser = {
        id: "1",
        email: "test@test.com",
        password: "hashed",
        role: "USER",
      };

      (UserRepository.findByEmail as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);

      const result = await authorize({
        email: "test@test.com",
        password: "wrong",
      });

      expect(result).toBeNull();
    });
  });

  describe("callbacks.jwt()", () => {
    it("adds role to token if user exists", async () => {
      const token = {} as JWT;
      const user = { role: "ADMIN" } as User;

      const jwtCallback = authConfig.callbacks!.jwt as any;

      const result = await jwtCallback({
        token,
        user,
      });

      expect(result.role).toBe("ADMIN");
    });

    it("does not modify token if no user", async () => {
      const token = { role: "USER" } as JWT;

      const jwtCallback = authConfig.callbacks!.jwt as any;

      const result = await jwtCallback({
        token,
        user: undefined,
      });

      expect(result.role).toBe("USER");
    });
  });

  describe("callbacks.session()", () => {
    it("adds role to session.user", async () => {
      const session = {
        user: { email: "test@test.com" },
        expires: "",
      } as any;

      const token = { role: "ADMIN" } as JWT;

      const sessionCallback = authConfig.callbacks!.session as any;

      const result = await sessionCallback({
        session,
        token,
      });

      expect(result.user.role).toBe("ADMIN");
    });
  });
});