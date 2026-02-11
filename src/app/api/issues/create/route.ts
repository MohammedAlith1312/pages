import { NextResponse } from 'next/server';
import { Octokit, App } from 'octokit';

const getOctokit = async (owner?: string) => {
    // -------------------------------------------------------------------------
    // ℹ️ GITHUB AUTH NOTE:
    // We MUST use "App ID" (Integer) + "Private Key" for backend automation.
    // "Client ID" (e.g. Iv1...) is for frontend user login only and CANNOT
    // be used to create issues from the backend without a user present.
    // -------------------------------------------------------------------------
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    // Debugging: Check which env vars are loaded
    // Debugging: Check which env vars are loaded
    console.log("Checking GitHub Credentials:");
    console.log(`- GITHUB_APP_ID: ${appId ? 'Set' : 'Missing'}`);
    console.log(`- GITHUB_APP_PRIVATE_KEY: ${privateKey ? 'Set' : 'Missing'}`);

    // Common mistake check: User trying to use Client ID instead of App ID
    if (!appId && (process.env.GITHUB_CLIENT_ID || process.env.GITHUB_APP_CLIENT_ID)) {
        console.warn("⚠️ WARNING: GITHUB_APP_ID is missing, but GITHUB_CLIENT_ID was found.");
        console.warn("   GitHub Apps require the 'App ID' (an integer, e.g. 12345), NOT the 'Client ID' (e.g. Iv1...).");
        console.warn("   Please check your .env file and ensure GITHUB_APP_ID is set to the App ID found in your GitHub App settings.");
    }

    // GitHub App Authentication (Sole Method)
    if (appId && privateKey) {
        try {
            const app = new App({
                appId,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            });

            let targetInstallId = null;

            console.log("Attempting installation auto-discovery...");
            const { data: installations } = await app.octokit.rest.apps.listInstallations();

            if (owner) {
                const match = installations.find((i: any) => i.account?.login === owner);
                if (match) {
                    targetInstallId = match.id;
                    console.log(`Found installation for owner '${owner}': ${targetInstallId}`);
                }
            }

            if (!targetInstallId && installations.length > 0) {
                targetInstallId = installations[0].id;
                console.log(`Using first available installation: ${targetInstallId}`);
            }

            if (targetInstallId) {
                return await app.getInstallationOctokit(targetInstallId);
            }

            console.error("No valid installation found for this App.");

        } catch (e: any) {
            console.error("GitHub App Auth Error:", e.message);
        }
    }

    throw new Error("Missing GitHub authentication credentials (GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY required)");
};

export async function POST(request: Request) {
    try {
        const { title, body } = await request.json();

        if (!title || !body) {
            return NextResponse.json(
                { error: 'Missing title or body' },
                { status: 400 }
            );
        }

        // You can set these in .env.local or hardcode for now
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;

        if (!owner || !repo) {
            return NextResponse.json(
                { error: 'GITHUB_OWNER and GITHUB_REPO environment variables are not set' },
                { status: 500 }
            );
        }

        const octokit = await getOctokit(owner);

        const response = await octokit.rest.issues.create({
            owner,
            repo,
            title,
            body,
        });

        return NextResponse.json({ success: true, url: response.data.html_url });
    } catch (error: any) {
        console.error('Error creating issue:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create issue' },
            { status: 500 }
        );
    }
}
