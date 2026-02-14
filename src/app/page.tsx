
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                redirect("/dashboard");
            }
            setUser(user);
            setLoading(false);
        };
        checkUser();
    }, []);

    if (loading) return null;

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-6 md:p-24 overflow-hidden">
            {/* Atmospheric Lighting */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 text-center space-y-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                    <h1 className="text-4xl sm:text-6xl md:text-9xl font-bold tracking-tighter text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        SmartMarks<span className="text-indigo-500 text-glow">.</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-3xl font-light text-slate-300 max-w-sm md:max-w-2xl mx-auto text-balance leading-tight tracking-tight px-4">
                        The <span className="text-white font-medium border-b border-indigo-500/50">private, real-time</span> brain extension for your digital life.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-8"
                >
                    <GlassCard hoverEffect className="max-w-md w-full backdrop-blur-3xl bg-white/[0.02] border-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-white tracking-tight">Ready to declutter?</h2>
                            <Link
                                href="/login"
                                className="group relative w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all overflow-hidden rounded-2xl bg-indigo-600 shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] hover:bg-indigo-500 hover:scale-[1.02] active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            </Link>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-[0.2em]">No credit card required</p>
                        </div>
                    </GlassCard>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {["Real-time Sync", "End-to-end Private", "Keyboard First", "Glass UI"].map((feature) => (
                            <span key={feature} className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                {feature}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Visual Decoration */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 flex flex-col items-center gap-2">
                <div className="w-px h-12 bg-gradient-to-b from-transparent to-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">Scroll</span>
            </div>
        </main>
    );
}
