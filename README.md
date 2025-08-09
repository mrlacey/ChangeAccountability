# ChangeAccountability

A browser extension that enhances GitHub blame pages by showing Pull Request metadata, making it easier to understand the context and accountability of code changes.

## Features

- 🔍 **Enhanced Blame View**: Adds PR metadata badges to GitHub blame pages
- 🔗 **PR Information**: Shows PR number, title, and who merged the PR
- 🎨 **GitHub Integration**: Respects GitHub's dark mode and styling
- 🚀 **Dynamic Navigation**: Works with GitHub's SPA-style navigation using MutationObserver
- 🔐 **Secure Token Storage**: Safely stores GitHub Personal Access Token locally
- 🌐 **Cross-Browser**: Compatible with Chrome, Edge, and Firefox (MV3)

## Installation

### For Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist/` folder

### Setting up GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Generate a new token with these permissions:
   - Repository access: Public repositories (or specific repos)
   - Permissions: Contents (read), Metadata (read), Pull requests (read)
3. Open the extension options page and enter your token

## Development

### Available Scripts

- `npm run build` - Build the extension for production
- `npm run dev` - Build and watch for changes during development
- `npm run clean` - Clean the dist directory
- `npm run zip` - Create a distribution package

### Project Structure

```
src/
├── content.ts      # Main content script for GitHub blame enhancement
├── options.ts      # Options page for managing GitHub token
static/
├── options.html    # Options page UI
├── styles.css      # Extension styles
└── icons/          # Extension icons
scripts/
├── build.js        # Build script using esbuild
└── zip.js          # Package creation script
```

### Technical Details

- **TypeScript**: All logic written in TypeScript for type safety
- **esbuild**: Fast bundling and minification
- **MV3**: Uses Manifest V3 for modern browser compatibility
- **GitHub API**: Fetches PR data using GitHub's REST API
- **DOM Manipulation**: Safely injects badges using MutationObserver

## How It Works

1. **Page Detection**: Monitors for GitHub blame pages using URL patterns
2. **Commit Analysis**: Extracts commit hashes from blame view links
3. **API Queries**: Fetches associated PR data using GitHub's API
4. **UI Enhancement**: Injects PR metadata badges next to commit information
5. **Dynamic Updates**: Handles GitHub's SPA navigation automatically

## Privacy & Security

- GitHub token is stored locally using Chrome's storage API
- Only communicates with github.com and api.github.com
- No data is sent to third-party services
- Token is only used for read-only API access

## Browser Compatibility

- ✅ Chrome (with MV3 support)
- ✅ Edge (with MV3 support) 
- ✅ Firefox (with MV3 support)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details