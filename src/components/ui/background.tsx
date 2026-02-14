
"use client";

import { motion } from "framer-motion";

export function DynamicBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020617]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-white opacity-[0.03] mask-image-[radial-gradient(ellipse_at_center,black,transparent)]" />

            {/* Main Orbs */}
            {/* Orb 1 - Indigo */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, 50, 100, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/20 blur-[120px]"
            />

            {/* Orb 2 - Purple */}
            <motion.div
                animate={{
                    x: [0, -150, 50, 0],
                    y: [0, 100, -50, 0],
                    scale: [1.2, 1, 1.1, 1.2],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-purple-600/20 blur-[140px]"
            />

            {/* Orb 3 - Cyan (Accent) */}
            <motion.div
                animate={{
                    x: [0, 200, 0],
                    y: [100, -100, 100],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[20%] left-[20%] w-[40vh] h-[40vh] rounded-full bg-cyan-500/10 blur-[100px]"
            />

            {/* Floating Particles/Specks */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -1000],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 20,
                        ease: "linear",
                    }}
                    className="absolute w-px h-px bg-white"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `-5%`,
                    }}
                />
            ))}
        </div>
    );
}
