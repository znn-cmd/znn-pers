interface GithubFileResponse {
  type: 'file' | 'dir';
  name: string;
  path: string;
  sha: string;
  content?: string;
  encoding?: string;
}

interface GithubListEntry {
  type: 'file' | 'dir';
  name: string;
  path: string;
  sha: string;
}

function getGithubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    throw new Error('Missing GitHub config: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO');
  }

  return { token, owner, repo, branch };
}

function getGithubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function decodeBase64(content: string): string {
  return Buffer.from(content.replace(/\n/g, ''), 'base64').toString('utf8');
}

function encodeBase64(content: string): string {
  return Buffer.from(content, 'utf8').toString('base64');
}

export async function githubGetFile(filePath: string): Promise<{ content: string; sha: string }> {
  const { token, owner, repo, branch } = getGithubConfig();
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath).replace(/%2F/g, '/')}?ref=${branch}`;
  const response = await fetch(endpoint, { headers: getGithubHeaders(token) });

  if (!response.ok) {
    throw new Error(`GitHub get file failed: ${response.status}`);
  }

  const payload = (await response.json()) as GithubFileResponse;
  if (payload.type !== 'file' || !payload.content) {
    throw new Error('GitHub path is not a file');
  }

  return {
    content: decodeBase64(payload.content),
    sha: payload.sha,
  };
}

export async function githubListDirectory(dirPath: string): Promise<GithubListEntry[]> {
  const { token, owner, repo, branch } = getGithubConfig();
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(dirPath).replace(/%2F/g, '/')}?ref=${branch}`;
  const response = await fetch(endpoint, { headers: getGithubHeaders(token) });

  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    throw new Error(`GitHub list directory failed: ${response.status}`);
  }

  const payload = (await response.json()) as GithubListEntry[];
  if (!Array.isArray(payload)) {
    return [];
  }
  return payload;
}

export async function githubUpsertFile(params: {
  filePath: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<{ sha: string }> {
  const { token, owner, repo, branch } = getGithubConfig();
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(params.filePath).replace(/%2F/g, '/')}`;
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: getGithubHeaders(token),
    body: JSON.stringify({
      message: params.message,
      content: encodeBase64(params.content),
      branch,
      sha: params.sha,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub upsert failed: ${response.status} ${text}`);
  }

  const payload = (await response.json()) as { content?: { sha?: string } };
  return { sha: payload.content?.sha || '' };
}
