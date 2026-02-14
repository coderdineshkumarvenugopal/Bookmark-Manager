
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/UserMenu";
import { RealtimeBookmarks } from "@/components/RealtimeBookmarks";
import { AddBookmark } from "@/components/AddBookmark";
import { CommandMenu } from "@/components/CommandMenu";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Middleware should catch this, but just in case
    if (!user) return <div>Unauthorized</div>;

    return (
        <div className="min-h-screen p-6 md:p-12 pb-24">
            <CommandMenu />
            <header className="flex items-center justify-between mb-10 md:mb-20">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tighter text-glow">
                        SmartMarks<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px] md:text-xs flex items-center gap-2">
                        <span className="w-8 h-px bg-indigo-500/50" />
                        Your digital brain extension
                    </p>
                </div>
                <UserMenu user={user} />
            </header>

            <main>
                <RealtimeBookmarks />
            </main>

            <AddBookmark />
        </div>
    );
}
