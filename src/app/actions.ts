'use server';

import { Octokit } from 'octokit';

export async function createGitHubIssue(formData: FormData) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    return { success: false, message: 'Missing GitHub configuration.' };
  }

  const title = formData.get('title') as string;
  const body = formData.get('description') as string;

  if (!title || !body) {
    return { success: false, message: 'Title and description are required.' };
  }

  try {
    const octokit = new Octokit({ auth: token });

    const response = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
    });

    return { success: true, url: response.data.html_url };
  } catch (error) {
    console.error('GitHub API Error:', error);
    return { success: false, message: 'Failed to create issue.' };
  }
}
