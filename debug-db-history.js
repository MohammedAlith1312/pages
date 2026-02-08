const { neon } = require('@neondatabase/serverless');

const DB_CONNECTION_STRING = "postgresql://neondb_owner:npg_DVXF7hMy1Nbt@ep-lucky-cell-ah64810p-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function checkHistory() {
    try {
        const sql = neon(DB_CONNECTION_STRING);
        // Fetch ALL rows for home.json to see if there are duplicates/history
        const results = await sql`
            SELECT path, content, last_updated 
            FROM cache_file 
            WHERE path LIKE '%home.json'
        `;

        console.log(`Found ${results.length} rows for home.json:`);

        results.forEach((row, index) => {
            console.log(`\n--- Row ${index + 1} ---`);
            console.log(`Path: ${row.path}`);
            console.log(`Last Updated: ${row.last_updated}`);

            let data = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;

            // Extract the specific card title the user is looking at
            const features = data.sections?.find(s => s.type === 'features');
            if (features?.cards?.[0]) {
                console.log(`Card 1 Title: "${features.cards[0].title}"`);
            } else {
                console.log("Card 1 not found in structure");
            }
        });

    } catch (e) {
        console.error(e);
    }
}

checkHistory();
