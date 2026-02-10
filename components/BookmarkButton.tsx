"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Confetti from "react-confetti";

type Props = {
  repoFullName: string;
  initialIsBookmarked?: boolean;
};

const PixelBookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className="rendering-pixelated"
  >
    <path d="M5 3h14v18l-7-4-7 4V3Z" />
  </svg>
);

export default function BookmarkButton({ repoFullName, initialIsBookmarked = false }: Props) {
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0, t: 0 });

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session || isSubmitting) return;

    const previousState = isBookmarked;
    const isAdding = !previousState;

    setIsSubmitting(true);
    setIsBookmarked(isAdding);

    if (isAdding) {
      setConfettiPos({
        x: e.clientX,
        y: e.clientY,
        t: Date.now(),
      });
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000);
    }

    try {
      const response = await fetch("/api/bookmarks", {
        method: previousState ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName: repoFullName }),
      });

      if (!response.ok) throw new Error("Sync failed");
    } catch (error) {
      setIsBookmarked(previousState);
      setConfettiActive(false);
      console.error("Bookmark error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <>
      {confettiActive && (
        <div 
          key={confettiPos.t} 
          className="fixed inset-0 pointer-events-none z-50"
        >
          <Confetti
            width={typeof window !== "undefined" ? window.innerWidth : 0}
            height={typeof window !== "undefined" ? window.innerHeight : 0}
            recycle={false}
            numberOfPieces={50}
            gravity={0.4}
            initialVelocityY={25}
            initialVelocityX={10}
            tweenDuration={1}
            confettiSource={{
              x: confettiPos.x,
              y: confettiPos.y,
              w: 0,
              h: 0,
            }}
            colors={["#facc15", "#eab308", "#fef08a"]}
          />
        </div>
      )}

      <button
        onClick={toggleBookmark}
        disabled={isSubmitting}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`p-2.5 transition-all duration-200 border-2 ${
          isBookmarked
            ? "bg-yellow-400 border-yellow-600 text-yellow-900"
            : "bg-white border-gray-400 text-gray-400 hover:text-gray-600 hover:border-gray-600"
        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "active:scale-90"}`}
      >
        <PixelBookmarkIcon filled={isBookmarked} />
      </button>
    </>
  );
}