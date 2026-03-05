/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with bookmark counts
 *     tags:
 *       - Users
 *     description: Retrieves all users along with the number of bookmarks each user has.
 *     responses:
 *       200:
 *         description: List of users with bookmark counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   bookmarkCount:
 *                     type: integer
 *   patch:
 *     summary: Update user role
 *     tags:
 *       - Users
 *     description: Updates the role of a specific user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - id
 *               - role
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 bookmarkCount:
 *                   type: integer
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
import { NextResponse } from "next/server";
import { UserRepository } from "@/lib/repositories/user.repository";

export async function GET() {
  const users = await UserRepository.getAllWithBookmarkCount();
  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const { id, role } = await req.json();
  const updated = await UserRepository.updateRole(id, role);
  return NextResponse.json(updated);
}