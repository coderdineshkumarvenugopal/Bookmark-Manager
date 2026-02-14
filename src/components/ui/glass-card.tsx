
"use client";

import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
    hoverEffect?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, hoverEffect = false, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl transition-colors duration-500 hover:border-white/[0.15] group",
                    className
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                {...props}
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Inner Glow */}
                <div className="absolute -inset-px rounded-2xl border border-white/5 pointer-events-none" />

                <div className="relative z-10 p-6">{children}</div>
            </motion.div>
        )
    }
)
GlassCard.displayName = "GlassCard"
