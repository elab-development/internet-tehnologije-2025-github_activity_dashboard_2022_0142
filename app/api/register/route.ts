/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     description: Creates a new user account with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Missing email/password or user already exists
 *       500:
 *         description: Internal server error
 */

import { NextResponse } from "next/server";
import { UserRepository } from "@/lib/repositories/user.repository";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserRepository.create(
      email,
      hashedPassword,
      "USER",
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}