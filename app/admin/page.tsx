"use client";

import Link from "next/link";
import { UserList } from "@/components/UserList";

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        
        <Link 
          href="/admin/swagger"
          className="h-12 px-8 w-full md:w-auto flex items-center justify-center bg-gray-100 text-black text-xl font-medium hover:bg-white border-2 border-black transition-colors"
        >
          API Docs
        </Link>
      </div>

      <UserList />
    </div>
  );
}