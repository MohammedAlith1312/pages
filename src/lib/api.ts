export function getPageSlugs() {
    return ['home', 'services'];
}

export async function getPageData(slug: string) {
    try {
        const data = await import(`../../lib/pages/${slug}.json`);
        return data.default || data;
    } catch (error) {
        return null;
    }
}

export async function getAllPages() {
    const slugs = getPageSlugs();
    return Promise.all(slugs.map(slug => getPageData(slug)));
}
