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
            const octokit = await app.getInstallationOctokit(targetInstallId);
            return octokit;
        }
    } catch (e: any) {
        console.error("Auth Error:", e.message);
    }

    throw new Error("Failed to authenticate with GitHub App");
};

export async function fetchOpenIssues() {
    try {
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;

        if (!owner || !repo) {
            console.error('GitHub owner/repo not configured');
            return [];
        }

        const octokit = await getOctokit(owner);

        // Fetch open issues
        const { data } = await octokit.rest.issues.listForRepo({
            owner,
            repo,
            state: 'open',
            per_page: 100,
            headers: {
                'If-None-Match': '' // Bypass cache slightly if needed, but Next.js deduplicates
            }
        });

        const issues = data.map(issue => ({
            id: `issue-${issue.id}`,
            text: issue.body?.split('**Selected Text:**\n> ')[1]?.split('\n')[0]?.trim() || '',
            issueUrl: issue.html_url,
            issueNumber: issue.number,
            title: issue.title,
            description: issue.body || ''
        })).filter(i => i.text && i.text.length > 0);

        return issues;

    } catch (error: any) {
        console.error('Fetch Error:', error);
        return [];
    }
}
