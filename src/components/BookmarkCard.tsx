
import { SpotlightCard } from "./ui/spotlight-card";
import { Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
}

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
    // Simple favicon fetcher
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=128`;

    return (
        <SpotlightCard className="group relative transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.05]">
            <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 min-w-0"
            >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 p-2 border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]">
                    <img
                        src={faviconUrl}
                        alt=""
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-100 truncate group-hover:text-indigo-300 transition-colors duration-300 tracking-tight">
                        {bookmark.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate font-medium tracking-wide flex items-center gap-1.5 uppercase mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-indigo-500/50" />
                        {new URL(bookmark.url).hostname}
                    </p>
                </div>
                <div className="flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                </div>
            </a>

            <button
                onClick={() => onDelete(bookmark.id)}
                className="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 scale-75 group-hover:scale-100"
                aria-label="Delete bookmark"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </SpotlightCard>
    );
}
