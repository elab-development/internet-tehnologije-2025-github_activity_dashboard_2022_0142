"use client";

import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="grid gap-4">
      {users.map((u: any) => (
        <UserCard key={u.id} user={u} onUpdate={fetchUsers} />
      ))}
    </div>
  );
}