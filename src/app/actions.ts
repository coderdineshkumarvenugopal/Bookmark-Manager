
"use server";

export async function fetchUrlMetadata(url: string) {
    try {
        let validUrl = url.trim();
        // If it starts with protocol but is missing slashes (e.g., https:google.com)
        if (/^https?:(?! \/\/)/i.test(validUrl)) {
            validUrl = validUrl.replace(/^https?:/i, 'https://');
        }
        // If it's just a domain (e.g., google.com)
        else if (!/^https?:\/\//i.test(validUrl)) {
            validUrl = 'https://' + validUrl;
        }

        const response = await fetch(validUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            return { title: null, error: `Failed to fetch: ${response.statusText}` };
        }

        const html = await response.text();

        // Try OpenGraph title first, then fallback to title tag
        const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);

        let title = ogTitleMatch ? ogTitleMatch[1] : null;

        if (!title) {
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            title = titleMatch ? titleMatch[1] : null;
        }

        return {
            title: title ? title.trim() : null,
            error: null
        };
    } catch (error) {
        console.error("Metadata fetch error for URL:", url, error);
        return { title: null, error: "Unable to retrieve site details" };
    }
}
