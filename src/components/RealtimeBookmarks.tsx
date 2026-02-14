
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookmarkCard } from "./BookmarkCard";
import { motion, AnimatePresence } from "framer-motion";

interface Bookmark {
    id: string;
    created_at: string;
    title: string;
    url: string;
    user_id: string;
}

export function RealtimeBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // 1. Fetch initial data
        const fetchBookmarks = async () => {
            const { data } = await supabase
                .from("bookmarks")
                .select("*")
                .order("created_at", { ascending: false });

            if (data) setBookmarks(data);
            setLoading(false);
        };

        fetchBookmarks();

        // 2. Subscribe to real-time changes
        const channel = supabase
            .channel("realtime-bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
                    } else if (payload.eventType === "DELETE") {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
                    } else if (payload.eventType === "UPDATE") {
                        setBookmarks((prev) => prev.map(b => b.id === payload.new.id ? payload.new as Bookmark : b));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleDelete = async (id: string) => {
        // Optimistic update (optional, but handled by realtime mostly)
        // For now, let's rely on realtime to update the UI or do it manually if we want instant feedback before server confirms
        // But requirement says "real-time updates", so showing the server state is most authentic.
        // However, for UX, we might want to delete it instantly.
        // Let's just fire the delete command.
        await supabase.from("bookmarks").delete().eq("id", id);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
                ))}
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                    <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
                <p className="text-slate-400 max-w-sm mx-auto">
                    Tap the + button to save your first bookmark. It will appear here instantly.
                </p>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence initial={false} mode='popLayout'>
                {bookmarks.map((bookmark) => (
                    <motion.li
                        key={bookmark.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <BookmarkCard bookmark={bookmark} onDelete={handleDelete} />
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
}
