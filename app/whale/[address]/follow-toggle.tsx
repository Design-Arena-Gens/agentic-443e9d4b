"use client";

import { useEffect, useState } from "react";

type FollowToggleProps = {
  address: string;
  name: string;
};

const STORAGE_KEY = "followedWhales";

type FollowedWhale = {
  address: string;
  name: string;
  savedAt: string;
};

export default function FollowToggle({ address, name }: FollowToggleProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const entries: FollowedWhale[] = JSON.parse(raw);
      setIsFollowing(entries.some((entry) => entry.address === address));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [address]);

  const handleToggle = () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    let entries: FollowedWhale[] = [];
    if (raw) {
      try {
        entries = JSON.parse(raw);
      } catch {
        // wipe corrupted storage
      }
    }

    if (isFollowing) {
      entries = entries.filter((entry) => entry.address !== address);
      setIsFollowing(false);
    } else {
      const now = new Date().toISOString();
      entries = [
        { address, name, savedAt: now },
        ...entries.filter((entry) => entry.address !== address),
      ].slice(0, 50);
      setIsFollowing(true);
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition
        ${
          isFollowing
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30"
            : "bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30"
        }`}
    >
      {isFollowing ? "Unfollow Whale" : "Follow Whale"}
    </button>
  );
}
