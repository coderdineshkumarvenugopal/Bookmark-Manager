"use client";

import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
            {/* Atmospheric Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center mb-10"
                >
                    <h1 className="text-5xl font-bold tracking-tighter text-white mb-3">
                        Welcome Back<span className="text-indigo-500 text-glow">.</span>
                    </h1>
                    <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">
                        Secure access to your digital mind
                    </p>
                </motion.div>

                <GlassCard className="p-10 backdrop-blur-3xl bg-white/[0.02] border-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]">
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                                <Chrome className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white tracking-tight">Sign in to SmartMarks</h2>
                            <p className="text-slate-500 text-sm mt-2">Use your Google account to continue</p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-black font-bold text-lg transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
                            )}
                            {loading ? "Connecting..." : "Continue with Google"}
                        </button>

                        <div className="flex items-center gap-4 py-2">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">End-to-End Encrypted</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <p className="text-center text-xs text-slate-500 leading-relaxed">
                            By continuing, you acknowledge that this is a demo application.
                        </p>
                    </div>
                </GlassCard>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-8 text-slate-600 text-xs font-medium uppercase tracking-[0.2em]"
                >
                    Protected by Supabase Auth
                </motion.p>
            </div>
        </main>
    );
}
