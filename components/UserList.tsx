"use client";

import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";
import PlaceholderCard from "./PlaceholderCard";

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

return (
  <div className="grid gap-4">
    {loading
      ? Array.from({ length: 6 }).map((_, i) => (
          <PlaceholderCard key={i} />
        ))
      : users.map((u: any) => (
          <UserCard key={u.id} user={u} onUpdate={fetchUsers} />
        ))}
  </div>
);
}
