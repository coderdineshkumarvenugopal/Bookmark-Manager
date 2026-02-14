
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function UserMenu({ user }: { user: { email?: string, user_metadata: { avatar_url?: string, full_name?: string } } }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/5 transition-all duration-300 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
            >
                <div className="relative">
                    {user.user_metadata.avatar_url ? (
                        <Image
                            src={user.user_metadata.avatar_url}
                            alt={user.user_metadata.full_name || "User"}
                            width={36}
                            height={36}
                            className="rounded-full border border-white/10"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <span className="hidden md:inline-block text-sm font-medium text-slate-200">
                    {user.user_metadata.full_name || user.email?.split('@')[0]}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-xl overflow-hidden z-50 ring-1 ring-white/5"
                    >
                        <div className="px-4 py-3 border-b border-white/5">
                            <p className="text-xs text-slate-500">Signed in as</p>
                            <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
