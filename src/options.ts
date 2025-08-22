/**
 * ChangeAccountability Options Page
 * Manages GitHub Personal Access Token storage
 */

class OptionsManager {
  private tokenInput: HTMLInputElement | null = null;
  private saveButton: HTMLButtonElement | null = null;
  private statusDiv: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupElements();
      this.loadSavedToken();
      this.setupEventListeners();
    });
  }

  private setupElements(): void {
    this.tokenInput = document.getElementById('github-token') as HTMLInputElement;
    this.saveButton = document.getElementById('save-token') as HTMLButtonElement;
    this.statusDiv = document.getElementById('status') as HTMLElement;

    if (!this.tokenInput || !this.saveButton || !this.statusDiv) {
      console.error('ChangeAccountability: Required elements not found');
      return;
    }
  }

  private setupEventListeners(): void {
    if (!this.saveButton || !this.tokenInput) return;

    this.saveButton.addEventListener('click', () => this.saveToken());
    this.tokenInput.addEventListener('input', () => this.clearStatus());
    this.tokenInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveToken();
      }
    });

    // Test token button
    const testButton = document.getElementById('test-token') as HTMLButtonElement;
    if (testButton) {
      testButton.addEventListener('click', () => this.testToken());
    }
  }

  private async loadSavedToken(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['githubToken']);
      if (result.githubToken && this.tokenInput) {
        this.tokenInput.value = result.githubToken;
        this.showStatus('Token loaded successfully', 'success');
      }
    } catch (error) {
      this.showStatus('Failed to load saved token', 'error');
      console.error('ChangeAccountability: Failed to load token', error);
    }
  }

  private async saveToken(): Promise<void> {
    if (!this.tokenInput) return;

    const token = this.tokenInput.value.trim();
    
    if (!token) {
      this.showStatus('Please enter a GitHub token', 'error');
      return;
    }

    if (!this.isValidTokenFormat(token)) {
      this.showStatus('Invalid token format. Should start with "ghp_" or "github_pat_"', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ githubToken: token });
      this.showStatus('Token saved successfully!', 'success');
    } catch (error) {
      this.showStatus('Failed to save token', 'error');
      console.error('ChangeAccountability: Failed to save token', error);
    }
  }

  private async testToken(): Promise<void> {
    if (!this.tokenInput) return;

    const token = this.tokenInput.value.trim();
    
    if (!token) {
      this.showStatus('Please enter a token to test', 'error');
      return;
    }

    this.showStatus('Testing token...', 'info');

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        this.showStatus(`Token is valid! Connected as: ${userData.login}`, 'success');
      } else {
        this.showStatus(`Token test failed: ${response.status} ${response.statusText}`, 'error');
      }
    } catch (error) {
      this.showStatus('Network error while testing token', 'error');
      console.error('ChangeAccountability: Token test error', error);
    }
  }

  private isValidTokenFormat(token: string): boolean {
    // GitHub Personal Access Tokens have specific prefixes and lengths
    // See: https://github.blog/changelog/2021-03-31-personal-access-token-format-updates/
    const tokenSpecs = [
      { prefix: 'ghp_', length: 40 },           // classic PAT
      { prefix: 'github_pat_', length: 82 },    // fine-grained PAT
      { prefix: 'gho_', length: 40 },           // OAuth access token
      { prefix: 'ghu_', length: 40 },           // user-to-server token
      { prefix: 'ghs_', length: 40 },           // server-to-server token
      { prefix: 'ghr_', length: 40 },           // refresh token
    ];
    
    for (const spec of tokenSpecs) {
      if (token.startsWith(spec.prefix) && token.length === spec.length) {
        return true;
      }
    }
    return false;
  }

  private showStatus(message: string, type: 'success' | 'error' | 'info'): void {
    if (!this.statusDiv) return;

    this.statusDiv.textContent = message;
    this.statusDiv.className = `status ${type}`;
    
    // Clear status after 5 seconds for success/info messages
    if (type === 'success' || type === 'info') {
      setTimeout(() => this.clearStatus(), 5000);
    }
  }

  private clearStatus(): void {
    if (!this.statusDiv) return;
    
    this.statusDiv.textContent = '';
    this.statusDiv.className = 'status';
  }
}

// Initialize the options manager
new OptionsManager();