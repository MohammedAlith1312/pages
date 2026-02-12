import { NextResponse } from 'next/server';
import { Octokit, App } from 'octokit';

// Helper to authenticate as GitHub App (reused)
const getOctokit = async (owner?: string) => {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    if (!appId || !privateKey) {
        throw new Error("Missing GitHub authentication credentials");
    }

    try {
        const app = new App({
            appId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
        });

        // Auto-discover installation
        const { data: installations } = await app.octokit.rest.apps.listInstallations();

        let targetInstallId;
        if (owner) {
            const match = installations.find((i: any) => i.account?.login === owner);
            if (match) targetInstallId = match.id;
        }

        if (!targetInstallId && installations.length > 0) {
            targetInstallId = installations[0].id;
        }

        if (targetInstallId) {
            return await app.getInstallationOctokit(targetInstallId);
        }
    } catch (e: any) {
        console.error("Auth Error:", e.message);
    }

    throw new Error("Failed to authenticate with GitHub App");
};

export async function POST(request: Request) {
    try {
        const { number, comment } = await request.json();

        if (!number || !comment) {
            return NextResponse.json({ error: 'Issue number and comment are required' }, { status: 400 });
        }

        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;

        if (!owner || !repo) {
            return NextResponse.json({ error: 'GitHub config missing' }, { status: 500 });
        }

        const octokit = await getOctokit(owner);

        // Add a comment to the issue
        const response = await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: number,
            body: comment
        });

        return NextResponse.json({ success: true, data: response.data });
    } catch (error: any) {
        console.error('Comment Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to comment on issue' }, { status: 500 });
    }
}
