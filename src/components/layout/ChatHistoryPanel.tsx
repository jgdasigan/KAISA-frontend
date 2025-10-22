"use client";

import { useEffect } from "react";
import { useChatHistoryStore } from "@/stores/chatHistoryStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

export const ChatHistoryPanel = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const { sessions, setSessions, isLoading, setLoading } = useChatHistoryStore();

  useEffect(() => {
    const load = async () => {
      if (!authStore.userDetails?.id) return;
      setLoading(true);
      try {
        // # REST history API removed; to be replaced by WebSocket action later
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [authStore.userDetails?.id, setLoading, setSessions]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/50 text-sm text-kaisa-midnight">
        <div className="p-4 font-semibold">Chat History</div>
        <div className="flex flex-1 items-center justify-center text-xs text-kaisa-midnight/60">
          Loading sessions...
        </div>
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="flex h-full flex-col divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/50 text-sm text-kaisa-midnight">
        <div className="p-4 font-semibold">Chat History</div>
        <div className="flex flex-1 items-center justify-center text-xs text-kaisa-midnight/60">
          Start a conversation to see it appear here.
        </div>
      </div>
    );
  }

  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, session) => {
    const dateKey = new Date(session.timestamp).toDateString();
    acc[dateKey] = acc[dateKey] ? [...acc[dateKey], session] : [session];
    return acc;
  }, {});

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/50 text-sm text-kaisa-midnight shadow-lg">
      <div className="border-b border-white/20 p-4 font-semibold">Chat History</div>
      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([date, sessionsForDate]) => (
          <div key={date} className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-kaisa-blue/60">{date}</p>
            <ul className="mt-2 space-y-1">
              {sessionsForDate.map((session) => (
                <li key={session.session_id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/chat/${session.session_id}`)}
                    className={cn(
                      "w-full rounded-xl bg-white/70 px-3 py-2 text-left text-sm transition hover:bg-kaisa-yellow/80 hover:text-kaisa-midnight"
                    )}
                  >
                    {session.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
