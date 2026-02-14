import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { DynamicBackground } from '@/components/ui/background'

// Note: Temporarily using system font stack to avoid build-time Google Fonts fetch errors in restricted environments.
// If you have a stable internet connection, you can revert to:
// const inter = Inter({ subsets: ['latin'], display: 'swap' })
const inter = { className: 'font-sans' }

export const metadata: Metadata = {
    title: 'Smart Bookmark App',
    description: 'A private, real-time bookmark manager',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, "min-h-screen antialiased selection:bg-purple-500/30")}>
                <DynamicBackground />
                <div className="relative z-10">
                    {children}
                </div>
            </body>
        </html>
    )
}
