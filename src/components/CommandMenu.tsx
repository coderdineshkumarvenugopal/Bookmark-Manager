"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Command } from "cmdk";
import { Search, Plus, Globe, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Bookmark {
    id: string;
    title: string;
    url: string;
}

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
            if (e.key === "/") {
                e.preventDefault();
                setOpen(true);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (open) {
            const fetchBookmarks = async () => {
                const { data } = await supabase
                    .from("bookmarks")
                    .select("id, title, url")
                    .order("created_at", { ascending: false });
                if (data) setBookmarks(data);
            };
            fetchBookmarks();
        }
    }, [open, supabase]);

    const filteredBookmarks = bookmarks.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.url.toLowerCase().includes(search.toLowerCase())
    );

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 md:pt-[15vh] px-4 md:px-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full md:max-w-2xl relative z-10"
                    >
                        <Command className="glass-morphism rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/[0.08]">
                            <div className="flex items-center border-b border-white/[0.05] px-4 md:px-8 py-2">
                                <Search className="w-5 h-5 md:w-6 md:h-6 text-slate-500 mr-3 md:mr-4 shrink-0" />
                                <Command.Input
                                    value={search}
                                    onValueChange={setSearch}
                                    placeholder="Search your library..."
                                    className="flex-1 bg-transparent py-4 md:py-6 text-xl md:text-2xl text-white placeholder:text-slate-600 focus:outline-none min-w-0 font-medium tracking-tight"
                                />
                                <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5 shrink-0 uppercase tracking-widest">
                                    <span>ESC</span>
                                </div>
                            </div>

                            <Command.List className="max-h-[50vh] overflow-y-auto p-4 scrollbar-hide">
                                <Command.Empty className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                        <Search className="w-12 h-12 text-slate-400" />
                                        <p className="text-slate-400 font-medium tracking-wide">No results found for that search.</p>
                                    </div>
                                </Command.Empty>

                                <Command.Group heading={<span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 block">Navigation</span>}>
                                    <Command.Item
                                        onSelect={() => {
                                            setOpen(false);
                                            window.dispatchEvent(new CustomEvent('open-add-bookmark'));
                                        }}
                                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-300 aria-selected:bg-white/[0.08] aria-selected:text-white cursor-pointer transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-aria-selected:border-indigo-500/50 group-aria-selected:bg-indigo-500/10 transition-all">
                                            <Plus className="w-6 h-6 text-slate-400 group-aria-selected:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-lg tracking-tight">Create New Bookmark</p>
                                            <p className="text-xs text-slate-500 font-medium tracking-wide">Add a new URL to your collection</p>
                                        </div>
                                        <kbd className="hidden md:flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                                            ⌘ N
                                        </kbd>
                                    </Command.Item>
                                </Command.Group>

                                {bookmarks.length > 0 && (
                                    <Command.Group heading={<span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 mt-8 block">Your Collection</span>}>
                                        <div className="grid gap-2">
                                            {filteredBookmarks.map((bookmark) => (
                                                <Command.Item
                                                    key={bookmark.id}
                                                    onSelect={() => {
                                                        window.open(bookmark.url, '_blank');
                                                        setOpen(false);
                                                    }}
                                                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-300 aria-selected:bg-white/[0.08] aria-selected:text-white cursor-pointer transition-all group"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-aria-selected:border-indigo-500/50 group-aria-selected:bg-indigo-500/10 transition-all overflow-hidden p-2">
                                                        <img
                                                            src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`}
                                                            alt=""
                                                            className="w-full h-full object-contain opacity-40 group-aria-selected:opacity-100 transition-opacity"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-lg tracking-tight truncate">{bookmark.title}</p>
                                                        <p className="text-xs text-slate-500 font-medium truncate tracking-wide flex items-center gap-2">
                                                            <Globe className="w-3 h-3" />
                                                            {new URL(bookmark.url).hostname}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className="w-5 h-5 text-slate-600 opacity-0 group-aria-selected:opacity-100 group-aria-selected:text-indigo-400 transition-all mr-2" />
                                                </Command.Item>
                                            ))}
                                        </div>
                                    </Command.Group>
                                )}
                            </Command.List>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
