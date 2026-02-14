
# Smart Bookmark App 🔖

A private, real-time bookmark manager built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. Designed with a unique "Glass & Void" aesthetic.

## Features
- **Google Authentication**: Secure login via Supabase Auth.
- **Real-time Updates**: Bookmarks sync instantly across devices/tabs using Supabase Realtime.
- **Private Storage**: Row Level Security (RLS) ensures users only see their own data.
- **Glassmorphism UI**: A premium, deep-space theme with glass cards and fluid animations.
- **Responsive Design**: Works on mobile and desktop.

### Pro Features 🚀
- **Smart Metadata**: Automatically fetches the website title when you type a URL.
- **Command Menu**: Press `Cmd+K` (or `/`) to instantly search your bookmarks.
- **Keyboard Shortcuts**: Power user friendly (`Cmd+N` to add new).

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Postgres, Auth, Realtime)
- **Deployment**: Vercel

## Setup & Run

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Supabase Setup**
   Run the following SQL in your Supabase SQL Editor:
   ```sql
   create table bookmarks (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     title text not null,
     url text not null,
     user_id uuid references auth.users not null default auth.uid()
   );

   alter table bookmarks enable row level security;

   create policy "Users can view their own bookmarks" on bookmarks
     for select using (auth.uid() = user_id);

   create policy "Users can insert their own bookmarks" on bookmarks
     for insert with check (auth.uid() = user_id);

   create policy "Users can delete their own bookmarks" on bookmarks
     for delete using (auth.uid() = user_id);
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Technical Challenges & Solutions

### 1. Bypassing CORS for Metadata Extraction
**Challenge**: Fetching website titles directly from the client-side resulted in CORS (Cross-Origin Resource Sharing) errors, as most sites block client-side scraping.
**Solution**: Implemented a **Next.js Server Action** (`fetchUrlMetadata`) to handle requests server-side.
- **Optimization**: Used a custom `User-Agent` header to mimic a real browser, preventing blocks from sites like Amazon or LinkedIn.
- **Parsing Strategy**: Instead of heavy libraries like JSDOM, I used targeted **Regex** to extract `<meta property="og:title">` and `<title>` tags, significantly reducing bundle size and execution time.

### 2. Real-time State Reconciliation
**Challenge**: Ensuring the UI updates instantly when external changes occur (e.g., a delete from another tab) while maintaining a smooth user experience without "flickering" or lost focus.
**Solution**: Leveraged **Supabase Realtime** with a robust React state management pattern.
- **Event Handling**: Built a specialized `RealtimeBookmarks` component that listens for `INSERT`, `UPDATE`, and `DELETE` events.
- **Optimistic UI**: While the app relies on real-time pulses, the state transition uses **Framer Motion's `AnimatePresence`** with `layout` props to smoothly glide cards into position as they arrive from the server, making the sync feel instantaneous.

### 3. Preventing "Flash of Unauthenticated Content" (FOUC)
**Challenge**: Next.js App Router sometimes renders a partial skeleton or the login page briefly before the auth state is confirmed, leading to a poor UX.
**Solution**: Implemented a robust **Middleware layer** (`middleware.ts`).
- **Logic**: The middleware intercepts every request, validates the Supabase session via cookies *before* reaching the page component, and performs server-side redirects. This ensures unauthenticated users never even see the dashboard layout.

### 4. Performance vs. Aesthetic Fidelity
**Challenge**: High-intensity `backdrop-blur` filters (essential for the "Glass & Void" look) can cause frame drops during animations on lower-end devices.
**Solution**: 
- **GPU Acceleration**: Used `transform-translate-z(0)` and `will-change` on glass cards to force hardware acceleration.
- **Layering**: Strategically limited blur to top-level modals and navigation, using static gradients for background depth to keep the repaint cost low.
