"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { Plus, X, Link as LinkIcon, Type, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUrlMetadata } from "@/app/actions";

export function AddBookmark() {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        const handleCustomEvent = () => setIsOpen(true);

        document.addEventListener("keydown", handleKeydown);
        document.addEventListener("open-add-bookmark", handleCustomEvent);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
            document.removeEventListener("open-add-bookmark", handleCustomEvent);
        };
    }, []);

    const handleUrlBlur = async () => {
        if (!url || title) return;

        setIsFetchingMetadata(true);
        try {
            const { title: fetchedTitle } = await fetchUrlMetadata(url);
            if (fetchedTitle) setTitle(fetchedTitle);
        } catch (err) {
            console.error("Metadata fetch error:", err);
        } finally {
            setIsFetchingMetadata(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let finalUrl = url.trim();
            if (/^https?:(?! \/\/)/i.test(finalUrl)) {
                finalUrl = finalUrl.replace(/^https?:/i, 'https://');
            } else if (!/^https?:\/\//i.test(finalUrl)) {
                finalUrl = 'https://' + finalUrl;
            }

            const { error: dbError } = await supabase.from("bookmarks").insert({
                title: title || new URL(finalUrl).hostname,
                url: finalUrl,
            });

            if (dbError) throw dbError;

            setIsOpen(false);
            setUrl("");
            setTitle("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to add bookmark");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] p-4 md:p-5 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_20px_40px_-12px_rgba(99,102,241,0.5)] transition-all hover:scale-110 active:scale-95 group"
                aria-label="Add Bookmark"
            >
                <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg glass-morphism rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                            <div className="relative z-10 space-y-6 md:space-y-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tighter">New Insight<span className="text-indigo-500 text-glow">.</span></h2>
                                        <p className="text-slate-400 text-xs md:text-sm font-medium tracking-[0.2em] uppercase mt-1 md:mt-2">Expanding your memory</p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 md:p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                                    >
                                        <X className="w-5 h-5 md:w-6 md:h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                                <LinkIcon className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Paste a URL..."
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                onBlur={handleUrlBlur}
                                                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl py-4 md:py-6 pl-12 md:pl-14 pr-4 md:pr-6 text-white text-base md:text-xl placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium tracking-tight"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                                <Type className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Title will appear here..."
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl py-4 md:py-6 pl-12 md:pl-14 pr-12 md:pr-16 text-white text-base md:text-xl placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium tracking-tight"
                                                disabled={isFetchingMetadata}
                                            />
                                            <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                {isFetchingMetadata ? (
                                                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-400 animate-spin" />
                                                ) : title && (
                                                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 md:p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || isFetchingMetadata || !url}
                                        className="w-full group relative py-4 md:py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-12px_rgba(99,102,241,0.4)]"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            {loading ? "Capturing..." : "Add to SmartMarks"}
                                            <span className="transition-transform group-hover:translate-x-1">→</span>
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
