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
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
      <input
        data-testid="search-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={type === "user" ? "Enter username..." : "Search repositories..."}
        className="flex-1 px-4 py-2 border-2 border-gray-700 bg-gray-100 hover:bg-white focus:bg-white focus:outline-none text-black transition-colors duration-300 ease-in-out rounded-none order-1 md:order-2"
      />
      <div className="flex gap-3 order-2 md:contents">
        <select
          data-testid="search-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="flex-1 md:flex-none px-3 py-2 border-2 border-gray-700 rounded-none bg-gray-100 hover:bg-white text-black focus:outline-none focus:bg-gray-100 transition-colors duration-300 md:order-1"
        >
          <option value="repo">Repo</option>
          <option value="user">User</option>
        </select>
        <button
          data-testid="search-submit"
          type="submit"
          className="flex-1 md:flex-none px-6 py-2 bg-gray-100 hover:bg-white hover:text-black transition-all duration-300 ease-in-out border-2 border-gray-700 rounded-none text-black font-medium md:order-3"
        >
          Search
        </button>
      </div>
    </form>
  );
}