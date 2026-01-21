"use client"

import { Activity } from "@/types/activity";

type Props = {
  activity: Activity;
};


export default function ActivityItem({activity} : Props) {
return (
<li key={activity.id} className="p-4 bg-white border border-gray-800">
    <div className="flex items-center gap-3">
        <img src={activity.actor.avatar_url} className="w-6 h-6 rounded-b-none" alt="" />
            <span className="font-medium">{activity.actor.login}</span>
            <span className="text-gray-500">{activity.type}</span>
    </div>
    <p className="text-xs text-gray-400 mt-2">
                {new Date(activity.created_at).toLocaleString()}
    </p>
</li>);
}