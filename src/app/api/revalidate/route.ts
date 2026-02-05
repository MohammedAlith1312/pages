import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Ensure this API route is always dynamic so it doesn't get cached itself
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const queryPath = request.nextUrl.searchParams.get("path");

    if (queryPath) {
        // Normalize path: ensure it starts with /
        const path = queryPath.startsWith('/') ? queryPath : `/${queryPath}`;

        try {
            revalidatePath('/');
            revalidatePath(path);
            return NextResponse.json({
                revalidated: true,
                revalidatedPaths: ['/', path],
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
        message: "Missing path query parameter (e.g. ?path=/)",
    }, { status: 400 });
}
