import { getPageData, getPageSlugs } from "@/lib/api";
import PageBuilder from "@/components/PageBuilder";
import { Metadata } from "next";

// Allow new pages to be generated on demand (On-Demand ISR)
export const dynamicParams = true;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await getPageSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pageData = await getPageData(slug);

    if (!pageData) {
        return {
            title: "Page Not Found"
        };
    }

    return {
        title: pageData.title,
    };
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;
    const pageData = await getPageData(slug);

    if (!pageData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-center">
                <h1 className="text-2xl font-bold">Page is not found</h1>
            </div>
        );
    }

    return (
        <main>
            <PageBuilder sections={pageData.sections} />
        </main>
    );
}
