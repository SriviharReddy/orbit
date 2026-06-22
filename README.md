# Orbit — Reddit Comments on YouTube & Webpages

> A community-maintained fork of [Comet](https://github.com/z0ccc/comet) by z0ccc, rebuilt with full source and updated branding.

Orbit replaces YouTube's comment section with the corresponding Reddit discussion, and lets you view Reddit comments for any webpage — all without leaving the page.

---

## Features

- **YouTube integration** — automatically replaces YouTube comments with Reddit posts for the current video
- **Universal** — click the extension icon on any webpage to see its Reddit discussion
- **Multi-subreddit** — tabs across all subreddits that have posted the URL
- **Sort** — switch between Best, Top, New, Old, and Controversial
- **Voting** — upvote and downvote posts and comments (Reddit login required)
- **Reply** — reply to posts and comments inline
- **Save** — save posts and comments
- **Side panel** — open as a Chrome side panel instead of a popup
- **Dark mode** — follows system preference, or set manually in options
- **Icon indicator** — extension icon is colour when Reddit posts exist, grey when none are found

---

## Project Structure

```
orbit-src/
├── src/
│   ├── components/
│   │   ├── App.tsx             # Main app — post/comment orchestration
│   │   ├── Comment.tsx         # Recursive comment + load-more
│   │   ├── CommentInfo.tsx     # Author, score, timestamp row
│   │   ├── Comments.tsx        # Top-level comment list
│   │   ├── Loading.tsx         # Loading / empty state container
│   │   ├── NoPostsFound.tsx    # "No posts found" with submit link
│   │   ├── PostActions.tsx     # Post title, voting, save, reply
│   │   ├── ReplyForm.tsx       # Inline reply form
│   │   ├── ReplyToggle.tsx     # reply / cancel toggle button
│   │   ├── SaveButton.tsx      # Save / unsave button
│   │   ├── Sort.tsx            # Sort order selector
│   │   ├── Subreddits.tsx      # Subreddit tab list
│   │   ├── VoteButton.tsx      # Upvote / downvote arrow
│   │   ├── YouTubeIcon.tsx     # Button to switch back to YouTube comments
│   │   └── YouTubeOverlay.tsx  # Reddit icon overlaid on YouTube page
│   ├── css/
│   │   └── global.css          # Comment body styles, scrollbar theming
│   ├── background.ts           # Service worker — API, icon, voting
│   ├── contentScript.tsx       # YouTube injection entry point
│   ├── options.tsx             # Settings page
│   ├── popup.tsx               # Popup entry point
│   ├── sidePanel.tsx           # Side panel entry point
│   ├── theme.ts                # Theme-UI theme (light + dark)
│   ├── types.ts                # Reddit API TypeScript types
│   └── utils.ts                # timeAgo, formatScore, fetchComments, show/hide helpers
├── assets/
│   └── icon_source.png         # Full-resolution source icon (512×512)
├── icons/
│   ├── icon48.png              # Colour icon (active state)
│   ├── icon128.png             # Colour icon (store listing)
│   └── iconGrey48.png          # Grey icon (no posts found)
├── public/
│   ├── popup.html
│   ├── sidePanel.html
│   └── options.html
├── _locales/                   # i18n message strings (54 locales)
├── manifest.json               # Chrome Extension Manifest V3
├── webpack.config.js
├── tsconfig.json
├── .babelrc
└── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 17 |
| Styling | [Theme UI](https://theme-ui.com/) |
| Language | TypeScript |
| Bundler | Webpack 5 |
| Transpiler | Babel |
| Extension API | Chrome Manifest V3 |

---

## Installation & Setup

### Option 1: Quick Install (Pre-built Release)

1. Download the latest extension archive (`orbit-v1.0.0.zip`) from the [GitHub Releases](https://github.com/SriviharReddy/orbit/releases).
2. Extract the downloaded zip file into a folder of your choice.
3. Open your Google Chrome or Chromium-based browser (Brave, Edge, Vivaldi, etc.) and navigate to `chrome://extensions` (or `edge://extensions` for Edge).
4. Enable **Developer mode** using the toggle switch in the top-right corner.
5. Click the **Load unpacked** button in the top-left corner.
6. Select the extracted folder (which contains the `manifest.json` file).

---

### Option 2: Build from Source

#### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- npm

#### Install dependencies

```bash
npm install
```

#### Build

```bash
npm run build
```

The output bundle will be generated in `dist/`.

#### Development (watch mode)

```bash
npm run dev
```

#### Load built extension in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` folder

---

## Settings

Open the extension options page to configure:

| Setting | Description |
|---|---|
| Theme | Light / Dark / System default |
| Default sort | Best / Top / New / Old / Controversial |
| YouTube default | Show YouTube comments instead of Reddit by default |
| Hide posts with 0 comments | Filters out dead threads |
| Disable icon badge check | Skips the API call on every navigation (faster) |
| Open in side panel by default | Opens side panel instead of popup on icon click |

---

## How It Works

1. **Content script** — injected on `youtube.com/watch*`. Mounts the React app underneath the native comment section and a Reddit icon overlay above it.
2. **Background worker** — handles all cross-origin `fetch` calls (Reddit API), voting, replying, saving, and icon badge updates.
3. **Popup / Side panel** — query the active tab's URL, send it to the background worker, and render the same React app.

```
Page (YouTube)          Background Worker          Reddit API
      │                        │                        │
      │──commentsUrl msg──────▶│                        │
      │                        │──fetch comments───────▶│
      │                        │◀──JSON─────────────────│
      │◀──children array───────│                        │
      │                        │                        │
      │──url msg───────────────▶│                       │
      │                        │──search + submit──────▶│
      │                        │◀──posts JSON───────────│
      │◀──{ posts, modhash }───│                        │
```

---

## License

MIT — see [LICENSE](LICENSE)

Based on [Comet](https://github.com/z0ccc/comet) by z0ccc.
