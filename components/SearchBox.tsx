"use client";

import { useState } from "react";

type Props = {
  onSearch: (query: string) => void;
  initialValue: string;
};

export default function SearchBox({ onSearch, initialValue }: Props) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // DODATE KLASE: 
        // transition-colors (aktivira animaciju za boje)
        // duration-300 (trajanje animacije 300ms)
        // ease-in-out (ubrzanje/usporenje animacije za prirodniji efekat)
        className={`flex-1 px-4 py-2 border border-gray-700 rounded-none focus:outline-none text-black transition-colors duration-300 ease-in-out ${
          (value.length > 0) ? "bg-gray-100" : "bg-transparent"
        }`}
      />
      <button 
        type="submit"
        className="px-6 py-2 bg-transparent hover:bg-gray-100 hover:text-black transition-all duration-300 ease-in-out border border-gray-700 rounded-none text-black"
      >
        Search
      </button>
    </form>
  );
}