/** contentScript.tsx — injected into YouTube pages.
 *  Reconstructed from `Hn` / `Vn` in bundle. */
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'theme-ui';
import App from './components/App';
import YouTubeOverlay from './components/YouTubeOverlay';
import theme from './theme';
import './css/global.css';

let observer: MutationObserver | null = null;

/** Inject the Reddit comments panel and overlay icon into the YouTube page. */
const injectRedditComments = (ytCommentsEl: Element) => {
  // Remove existing mounts if navigating within YouTube
  document.getElementById('redditComments')?.remove();
  document.getElementById('redditImgWrap')?.remove();

  const redditMount = document.createElement('div');
  redditMount.setAttribute('id', 'redditComments');
  redditMount.style.marginTop = '16px';

  const overlayMount = document.createElement('div');
  overlayMount.setAttribute('id', 'redditImgWrap');

  ytCommentsEl.parentNode?.insertBefore(redditMount, ytCommentsEl);
  ytCommentsEl.parentNode?.insertBefore(overlayMount, ytCommentsEl);

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <App url={window.location.href} isContent />
    </ThemeProvider>,
    redditMount
  );

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <YouTubeOverlay />
    </ThemeProvider>,
    overlayMount
  );
};

/** Initialise injection — waits for #comments if not yet rendered. */
const init = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (!window.location.pathname.startsWith('/watch')) return;

  const existing = document.getElementById('comments');
  if (existing) {
    injectRedditComments(existing);
    return;
  }

  observer = new MutationObserver(() => {
    const el = document.getElementById('comments');
    if (el) {
      observer?.disconnect();
      observer = null;
      injectRedditComments(el);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

document.addEventListener('yt-navigate-finish', init);
init();
