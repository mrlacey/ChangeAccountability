/**
 * ChangeAccountability Content Script
 * Enhances GitHub blame pages with PR metadata
 */

interface PRMetadata {
  number: number;
  title: string;
  merged_by: {
    login: string;
    avatar_url: string;
  } | null;
  merged_at: string | null;
  url: string;
}

class GitHubBlameEnhancer {
  private githubToken: string | null = null;
  private observer: MutationObserver | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Load GitHub token from storage
    await this.loadGitHubToken();
    
    // Start observing for GitHub's dynamic navigation
    this.setupMutationObserver();
    
    // Check if we're on a blame page and enhance it
    this.enhanceBlamePage();
  }

  private async loadGitHubToken(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['githubToken']);
      this.githubToken = result.githubToken || null;
    } catch (error) {
      console.error('ChangeAccountability: Failed to load GitHub token', error);
    }
  }

  private setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        }
      });
      
      if (shouldCheck && this.isBlamePage()) {
        // Debounce to avoid excessive calls
        setTimeout(() => this.enhanceBlamePage(), 500);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private isBlamePage(): boolean {
    return window.location.pathname.includes('/blame/') && 
           window.location.hostname === 'github.com';
  }

  private async enhanceBlamePage(): Promise<void> {
    if (!this.isBlamePage() || !this.githubToken) {
      return;
    }

    console.log('ChangeAccountability: Enhancing blame page...');
    
    // Find all commit links in the blame view
    const commitLinks = document.querySelectorAll('a[href*="/commit/"]');
    
    for (const link of Array.from(commitLinks)) {
      const href = link.getAttribute('href');
      if (href) {
        const commitHash = this.extractCommitHash(href);
        if (commitHash && !link.querySelector('.change-accountability-badge')) {
          await this.addPRMetadataToBlameLine(link, commitHash);
        }
      }
    }
  }

  private extractCommitHash(href: string): string | null {
    const match = href.match(/\/commit\/([a-f0-9]{40})/);
    return match ? match[1] || null : null;
  }

  private async addPRMetadataToBlameLine(commitLink: Element, commitHash: string): Promise<void> {
    try {
      const prData = await this.fetchPRForCommit(commitHash);
      if (prData) {
        this.injectPRBadge(commitLink, prData);
      }
    } catch (error) {
      console.error('ChangeAccountability: Failed to fetch PR data for commit', commitHash, error);
    }
  }

  private async fetchPRForCommit(commitHash: string): Promise<PRMetadata | null> {
    if (!this.githubToken) return null;

    const repoPath = this.extractRepoPath();
    if (!repoPath) return null;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoPath}/commits/${commitHash}/pulls`,
        {
          headers: {
            'Authorization': `Bearer ${this.githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        console.warn('ChangeAccountability: API request failed', response.status);
        return null;
      }

      const pulls = await response.json();
      return pulls.length > 0 ? pulls[0] : null;
    } catch (error) {
      console.error('ChangeAccountability: API request error', error);
      return null;
    }
  }

  private extractRepoPath(): string | null {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3) {
      return `${pathParts[1]}/${pathParts[2]}`;
    }
    return null;
  }

  private injectPRBadge(commitLink: Element, prData: PRMetadata): void {
    // Check if badge already exists
    if (commitLink.querySelector('.change-accountability-badge')) {
      return;
    }

    const badge = document.createElement('span');
    badge.className = 'change-accountability-badge';
    badge.innerHTML = `
      <span class="change-accountability-pr-info" title="PR #${prData.number}: ${prData.title}${prData.merged_by ? ' (merged by ' + prData.merged_by.login + ')' : ''}">
        🔀 PR #${prData.number}
        ${prData.merged_by ? `<span class="change-accountability-merger">by ${prData.merged_by.login}</span>` : ''}
      </span>
    `;

    // Insert badge after the commit link
    commitLink.parentNode?.insertBefore(badge, commitLink.nextSibling);
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize the enhancer when the page loads
let enhancer: GitHubBlameEnhancer;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    enhancer = new GitHubBlameEnhancer();
  });
} else {
  enhancer = new GitHubBlameEnhancer();
}

// Cleanup when navigating away
window.addEventListener('beforeunload', () => {
  if (enhancer) {
    enhancer.destroy();
  }
});