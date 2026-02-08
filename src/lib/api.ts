import { neon } from '@neondatabase/serverless';

const DB_CONNECTION_STRING = process.env.DATABASE_URL;

/**
 * Get all page slugs
 */
export async function getPageSlugs() {
    const localSlugs = ['home', 'services'];

    if (DB_CONNECTION_STRING) {
        try {
            const sql = neon(DB_CONNECTION_STRING);

            const results = await sql`
                SELECT path FROM cache_file 
                WHERE path LIKE 'lib/pages/%.json'
            `;

            const dbSlugs = results.map((row: any) =>
                row.path.replace('lib/pages/', '').replace('.json', '')
            );

            return Array.from(new Set([...localSlugs, ...dbSlugs]));
        } catch {
            console.warn("[API] DB slug fetch failed, using local only");
        }
    }

    return localSlugs;
}

/**
 * Get page data (JSON FIRST → DB override)
 */
export async function getPageData(slug: string) {
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;

    let jsonData: any = null;

    // 🥇 STEP 1 — LOAD JSON FIRST (always fresh)
    try {
        const module = await import(`../../lib/pages/${cleanSlug}.json`);
        jsonData = module.default;
        console.log(`[API] JSON loaded: ${cleanSlug}`);
    } catch {
        console.warn(`[API] JSON missing: ${cleanSlug}`);
    }

    // 🥈 STEP 2 — CHECK DB CACHE (CMS override)
    if (DB_CONNECTION_STRING) {
        try {
            const sql = neon(DB_CONNECTION_STRING);
            const fullPath = `lib/pages/${cleanSlug}.json`;

            const results = await sql`
                SELECT content FROM cache_file 
                WHERE path = ${fullPath}
                LIMIT 1
            `;
            if (results && results.length > 0) {
                let content = (results[0] as any).content;

                let dbData = content;

                // 🔥 double parse fix
                if (typeof dbData === 'string') {
                    dbData = JSON.parse(dbData);
                }

                if (typeof dbData === 'string') {
                    dbData = JSON.parse(dbData);
                }

                console.log("[API] CMS override from DB:", cleanSlug);
                return dbData;
            }

        } catch (err) {
            console.error("[API] DB error, fallback JSON", err);
        }
    }

    // 🥉 STEP 3 — RETURN JSON IF NO DB
    if (jsonData) return jsonData;

    return null;
}

/**
 * Get all pages
 */
export async function getAllPages() {
    const slugs = await getPageSlugs();
    return Promise.all(slugs.map(slug => getPageData(slug)));
}
