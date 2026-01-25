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
    <form onSubmit={handleSubmit} className="flex gap-0">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-3 py-2 border border-gray-700 border-r-0 rounded-none bg-transparent text-black focus:outline-none focus:bg-gray-100 transition-colors duration-300"
      >
        <option value="repo">Repo</option>
        <option value="user">User</option>
      </select>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={type === "user" ? "Enter username..." : "Search repositories..."}
        className={`flex-1 px-4 py-2 border border-gray-700 rounded-none focus:outline-none focus:bg-gray-100 text-black transition-colors duration-300 ease-in-out ${
          (value.length > 0) ? "bg-gray-100" : "bg-transparent"
        }`}
      />
      <button 
        type="submit"
        className="px-6 py-2 bg-transparent hover:bg-gray-100 hover:text-black transition-all duration-300 ease-in-out border border-l-0 border-gray-700 rounded-none text-black font-medium"
      >
        Search
      </button>
    </form>
  );
}