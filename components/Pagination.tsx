"use client";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  if (totalPages === 0) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={onPrev}
        className="px-3 py-1 bg-gray-100 border disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-3 py-1 text-lg">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={onNext}
        className="px-3 py-1 bg-gray-100 border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
