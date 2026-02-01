"use client";

import { useState } from "react";

export function UserCard({ user, onUpdate }: { user: any, onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (newRole: string) => {
    setLoading(true);
    await fetch("/api/users", {
      method: "PATCH",
      body: JSON.stringify({ id: user.id, role: newRole }),
    });
    setLoading(false);
    onUpdate(); 
  };

  return (
    <div className="p-4 border shadow flex justify-between items-center bg-white">
      <div>
        <p className="font-bold">{user.email}</p>
        <p className="text-sm text-gray-500">Bookmarks: {user._count.bookmarks}</p>
      </div>
      <select 
        value={user.role} 
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className="border p-1"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
    </div>
  );
}