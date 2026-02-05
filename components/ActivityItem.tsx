"use client"

type Props = {
  activity: any; // Now representing a commit object
};

export default function ActivityItem({ activity }: Props) {
  return (
    <li className="p-4 bg-white border border-gray-800">
      <div className="flex items-center gap-3">
        {activity.avatar && (
          <img src={activity.avatar} className="w-6 h-6 border border-gray-800" alt="" />
        )}
        <span className="font-medium text-sm">{activity.author}</span>
        <span className="text-gray-400 text-xs font-mono">{activity.sha.substring(0, 7)}</span>
      </div>
      
      <p className="mt-2 text-sm text-gray-800 line-clamp-2">
        {activity.message}
      </p>

      <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">
        {new Date(activity.date).toLocaleString()}
      </p>
    </li>
  );
}