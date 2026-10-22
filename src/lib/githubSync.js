/**
 * GitHub API synchronization helper for React Visualized iPhone App
 * Enables direct in-app commits to https://github.com/Amara-Manikanta/React-Visualized-Learning
 */

const DEFAULT_REPO_OWNER = "Amara-Manikanta";
const DEFAULT_REPO_NAME = "React-Visualized-Learning";
const DEFAULT_BRANCH = "main";
const GITHUB_TOKEN_KEY = "react_visualized_github_token";

export function getSavedGitHubToken() {
  try {
    return localStorage.getItem(GITHUB_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function saveGitHubToken(token) {
  try {
    localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
  } catch (e) {
    console.error("Failed to save GitHub token:", e);
  }
}

export function clearGitHubToken() {
  try {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
  } catch (e) {
    console.error("Failed to clear GitHub token:", e);
  }
}

/**
 * Safely encode a UTF-8 string to Base64 (handling Unicode & emojis)
 */
export function utf8ToBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * Verify GitHub Token connection and fetch authenticated user info
 */
export async function verifyGitHubToken(token) {
  if (!token) throw new Error("Please provide a GitHub Personal Access Token.");

  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid or expired GitHub Personal Access Token.");
    }
    throw new Error(`GitHub Authentication failed (HTTP ${res.status}).`);
  }

  const user = await res.json();
  return {
    login: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
  };
}

/**
 * Fetch the latest SHA of a file from GitHub repository
 */
export async function getFileSha({
  token,
  owner = DEFAULT_REPO_OWNER,
  repo = DEFAULT_REPO_NAME,
  filePath,
  branch = DEFAULT_BRANCH,
}) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 404) {
    return null; // File doesn't exist yet on remote
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch file SHA from GitHub (HTTP ${res.status}).`
    );
  }

  const data = await res.json();
  return data.sha;
}

/**
 * Push code directly to GitHub repository from inside the iPhone app
 */
export async function pushFileToGitHub({
  token,
  owner = DEFAULT_REPO_OWNER,
  repo = DEFAULT_REPO_NAME,
  filePath,
  content,
  message,
  branch = DEFAULT_BRANCH,
}) {
  if (!token) throw new Error("GitHub Personal Access Token is required.");
  if (!filePath) throw new Error("Target file path is missing.");

  // 1. Get latest file SHA on remote branch
  const currentSha = await getFileSha({ token, owner, repo, filePath, branch });

  // 2. Prepare Base64 payload
  const base64Content = utf8ToBase64(content);

  const body = {
    message: message || `docs(mobile): update ${filePath} via React Visualized iOS app`,
    content: base64Content,
    branch,
  };

  if (currentSha) {
    body.sha = currentSha;
  }

  // 3. Put contents to GitHub
  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 409) {
      throw new Error(
        "Conflict: The file was modified remotely. Please pull or re-sync before pushing."
      );
    }
    if (res.status === 403) {
      throw new Error(
        "Permission Denied: Ensure your Personal Access Token has the 'repo' scope."
      );
    }
    throw new Error(err.message || `GitHub commit failed (HTTP ${res.status}).`);
  }

  const result = await res.json();
  return {
    commitSha: result.commit.sha,
    commitUrl: result.commit.html_url,
    commitMessage: result.commit.message,
    author: result.commit.author?.name || "Mobile Developer",
    branch,
  };
}
