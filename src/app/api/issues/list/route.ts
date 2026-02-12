import { NextResponse } from 'next/server';
import { Octokit, App } from 'octokit';

// Helper to authenticate as GitHub App
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
            const octokit = await app.getInstallationOctokit(targetInstallId);
            return octokit;
        }
    } catch (e: any) {
        console.error("Auth Error:", e.message);
    }

    throw new Error("Failed to authenticate with GitHub App");
};

export async function GET() {
    try {
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;

        if (!owner || !repo) {
            return NextResponse.json(
                { error: 'GitHub owner/repo not configured' },
                { status: 500 }
            );
        }

        const octokit = await getOctokit(owner);

        // Fetch open issues
        const { data } = await octokit.rest.issues.listForRepo({
            owner,
            repo,
            state: 'open',
            per_page: 100
        });

        const issues = data.map(issue => {
            const body = issue.body || '';
            let extractedText = '';

            // Try Text selection format
            if (body.includes('**Selected Text:**\n> ')) {
                extractedText = body.split('**Selected Text:**\n> ')[1]?.split('\n')[0]?.trim() || '';
            }
            // Try Image selection format
            else if (body.includes('**Selected Image:**\n')) {
                extractedText = body.split('**Selected Image:**\n')[1]?.split('\n')[0]?.trim() || '';
            }

            return {
                id: `issue-${issue.id}`,
                issueNumber: issue.number,
                title: issue.title,
                body: body,
                url: issue.html_url,
                selectedText: extractedText
            };
        }).filter(i => i.selectedText && i.selectedText.length > 0);

        return NextResponse.json({ issues });

    } catch (error: any) {
        console.error('Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch issues' },
            { status: 500 }
        );
    }
}
