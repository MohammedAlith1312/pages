import { NextResponse } from 'next/server';
import { Octokit, App } from 'octokit';

const getOctokit = async (owner?: string) => {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    if (appId && privateKey) {
        try {
            const app = new App({
                appId,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            });

            let targetInstallId = null;
            const { data: installations } = await app.octokit.rest.apps.listInstallations();

            if (owner) {
                const match = installations.find((i: any) => i.account?.login === owner);
                if (match) {
                    targetInstallId = match.id;
                }
            }

            if (!targetInstallId && installations.length > 0) {
                targetInstallId = installations[0].id;
            }

            if (targetInstallId) {
                return await app.getInstallationOctokit(targetInstallId);
            }
        } catch (e: any) {
            console.error("GitHub App Auth Error:", e.message);
        }
    }
    throw new Error("Missing GitHub authentication credentials");
};

export async function POST(request: Request) {
    try {
        const { number } = await request.json();

        if (!number) {
            return NextResponse.json({ error: 'Missing issue number' }, { status: 400 });
        }

        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;

        if (!owner || !repo) {
            return NextResponse.json(
                { error: 'GITHUB_OWNER and GITHUB_REPO environment variables are not set' },
                { status: 500 }
            );
        }

        const octokit = await getOctokit(owner);

        await octokit.rest.issues.update({
            owner,
            repo,
            issue_number: number,
            state: 'closed',
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error closing issue:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to close issue' },
            { status: 500 }
        );
    }
}
