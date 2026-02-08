"use client";

import { useState } from "react";

type Props = {
  onSearch: (query: string, type: string) => void;
  initialValue: string;
  initialType: string;
};

export default function SearchBox({ onSearch, initialValue, initialType }: Props) {
  const [value, setValue] = useState(initialValue);
  const [type, setType] = useState(initialType);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(value, type);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-3 py-2 border-2 border-gray-700 rounded-none bg-gray-100 hover:bg-white text-black focus:outline-none focus:bg-gray-100 transition-colors duration-300"
      >
        <option value="repo">Repo</option>
        <option value="user">User</option>
      </select>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={type === "user" ? "Enter username..." : "Search repositories..."}
className="flex-1 px-4 py-2 border-2 border-gray-700 bg-gray-100 hover:bg-white focus:bg-white focus:outline-none text-black transition-colors duration-300 ease-in-out rounded-none"      />
      <button 
        type="submit"
        className="px-6 py-2 bg-gray-100 hover:bg-white hover:text-black transition-all duration-300 ease-in-out border-2 -l-0 border-gray-700 rounded-none text-black font-medium"
      >
        Search
      </button>
    </form>
  );
}