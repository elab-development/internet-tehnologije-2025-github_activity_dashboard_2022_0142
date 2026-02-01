"use client";

import { UserList } from "@/components/UserList";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Panel</h1>
      <UserList />
    </div>
  );
}