"use client"

type Props = {
  activity: any;
};

export default function ActivityItem({ activity }: Props) {
  return (
    <li className="p-4 bg-gray-100 border-2 border-gray-800 flex justify-between items-center transition-all relative">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          {activity.avatar && (
            <img
              src={activity.avatar}
              className="w-6 h-6 border border-gray-800"
              alt=""
            />
          )}
          <span className="text-xl font-semibold truncate">
            {activity.author}
          </span>
          <span className="text-gray-400 text-xs font-mono">
            {activity.sha.substring(0, 7)}
          </span>
        </div>

        <p className="mt-1 text-lg text-gray-500 line-clamp-3">
          {activity.message}
        </p>
      </div>

      <p className="ml-4 text-[10px] text-gray-400 uppercase tracking-wider whitespace-nowrap">
        {new Date(activity.date).toLocaleString()}
      </p>
    </li>
  );
}
