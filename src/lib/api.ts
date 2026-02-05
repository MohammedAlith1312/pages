import fs from 'fs/promises';
import path from 'path';

export function getPageSlugs() {
    return ['home', 'services'];
}

export async function getPageData(slug: string) {
    try {
        // Using fs.readFile enables 'revalidatePath' to work correctly.
        // Unlike 'import', this reads the fresh file from disk on every request/revalidation.
        const filePath = path.join(process.cwd(), 'lib/pages', `${slug}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return null;
    }
}

export async function getAllPages() {
    const slugs = getPageSlugs();
    return Promise.all(slugs.map(slug => getPageData(slug)));
}
