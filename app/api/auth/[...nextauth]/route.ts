/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Get authentication info
 *     tags:
 *       - Auth
 *     description: Retrieves authentication information for the current user/session.
 *     responses:
 *       200:
 *         description: Successful retrieval of auth info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The authenticated user data
 *                 session:
 *                   type: object
 *                   description: Session information
 *   post:
 *     summary: Login or perform authentication
 *     tags:
 *       - Auth
 *     description: Authenticates a user using provided credentials.
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
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */

import { handlers } from "@/lib/auth"; 
export const { GET, POST } = handlers;