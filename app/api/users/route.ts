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