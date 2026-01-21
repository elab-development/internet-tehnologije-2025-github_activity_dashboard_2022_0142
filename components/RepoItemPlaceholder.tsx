export default function RepoItemPlaceholder() {
  return (
    <li className="p-4 bg-transparent border border-gray-800 flex justify-between items-center animate-pulse">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-5 w-1/3" />
        <div className="space-y-2">
          <div className="h-3 w-full" />
          <div className="h-3 w-2/3" />
        </div>
      </div>
    </li>
  );
}