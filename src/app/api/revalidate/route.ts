import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Ensure this API route is always dynamic so it doesn't get cached itself
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const queryPath = request.nextUrl.searchParams.get("path");

    if (queryPath) {
        // Normalize path: ensure it starts with /
        const path = queryPath.startsWith('/') ? queryPath : `/${queryPath}`;
        const slug = path.replace(/^\//, '');

        try {
            // Purge the cache for both the specific page and the root layout
            revalidatePath('/', 'layout');
            revalidatePath(path, 'page');


            return NextResponse.json({
                revalidated: true,
                path: path,
                tag: slug ? `page-${slug}` : null,
                now: Date.now()
            });
        } catch (err) {
            return NextResponse.json({
                revalidated: false,
                message: "Error revalidating path",
                error: String(err)
            }, { status: 500 });
        }
    }

    return NextResponse.json({
        revalidated: false,
        now: Date.now(),
        message: "Missing path query parameter (e.g. ?path=home)",
    }, { status: 400 });
}

