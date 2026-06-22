// Background service worker — reconstructed from background.bundle.js
// Handles: post lookups, icon updates, voting, replying, saving, commentsUrl fetch

const getStorage = (key: string): Promise<any> =>
  new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => resolve(result[key]));
  });

const YOUTUBE_WATCH = 'www.youtube.com/watch?v=';

const searchPosts = async (query: string) =>
  fetch(
    `https://www.reddit.com/search.json?q=url%3A'${query}'&include_over_18=on&sort=top&type=link`
  )
    .then((r) => r.json())
    .catch((e) => e);

const getSubmitPage = async (url: string) =>
  fetch(`https://www.reddit.com/submit.json?url=${normalizeUrl(url)}`)
    .then((r) => r.json())
    .catch((e) => e);

const normalizeUrl = (url: string) =>
  (url.endsWith('/') ? url.slice(0, -1) : url)
    .replace(/(^\w+:|^)\/\//, '')
    .split('#')[0];

const extractVideoId = (idx: number, url: string) =>
  url.indexOf('&') === -1
    ? url.substring(idx + YOUTUBE_WATCH.length)
    : url.substring(idx + YOUTUBE_WATCH.length, url.lastIndexOf('&'));

const sortByComments = (a: any, b: any) => b.num_comments - a.num_comments;

const processPosts = (
  results: any[],
  normalizedUrl: string,
  isYouTube: boolean,
  hidePosts: boolean
) => {
  let posts = results
    .filter((r) => r.kind === 'Listing' && r.data.children.length > 0)
    .reduce((acc: any[], r: any) => acc.concat(r.data.children), [])
    .reduce((acc: any[], c: any) => acc.concat(c.data), [])
    .filter((p: any) => p.num_comments >= (hidePosts ? 1 : 0));

  if (!isYouTube) {
    posts = posts.filter((p: any) => normalizeUrl(p.url) === normalizedUrl);
  }

  // Deduplicate by id
  posts = [...new Map(posts.map((p: any) => [p.id, p])).values()];
  posts = posts.sort(sortByComments);
  return posts;
};

const fetchPosts = async (url: string) => {
  const hidePosts = await getStorage('hidePosts');
  const ytIdx = url.indexOf(YOUTUBE_WATCH);
  const isYouTube = ytIdx !== -1;
  const normalized = normalizeUrl(url);

  let results: any[];
  if (isYouTube) {
    const videoId = extractVideoId(ytIdx, url);
    results = [await searchPosts(videoId)];
  } else {
    results = await Promise.all([searchPosts(normalized), getSubmitPage(normalized)]);
  }

  return processPosts(results, normalized, isYouTube, hidePosts);
};

const getModhash = () =>
  fetch('https://api.reddit.com/api/me.json', { cache: 'no-cache' })
    .then((r) => r.json())
    .then((r) => r.data.modhash)
    .catch((e) => e);

const buildUrl = (base: string, params: Record<string, any>) => {
  const url = new URL(base);
  Object.keys(params).forEach((k) => url.searchParams.append(k, params[k]));
  return url;
};

const updateIcon = async (tabUrl: string) => {
  const noPopupCheck = await getStorage('noPopupCheck');
  if (noPopupCheck) return;

  const posts = await fetchPosts(tabUrl);
  const iconPath = posts.length ? '../icon48.png' : '../iconGrey48.png';
  const iconDef = { path: { 48: iconPath } };
  try {
    chrome.action.setIcon(iconDef);
  } catch {
    (chrome as any).browserAction.setIcon(iconDef);
  }
};

const onNavigate = (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
  if (details.frameType !== 'outermost_frame' && details.frameId !== 0) return;
  updateIcon((details as any).url);
};

chrome.webNavigation.onHistoryStateUpdated.addListener(onNavigate);
chrome.webNavigation.onBeforeNavigate.addListener(onNavigate);

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (tabs[0]?.url) updateIcon(tabs[0].url);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Fetch comments (from content script on YouTube — avoids CORS)
  if (message.commentsUrl) {
    fetch(`https://api.reddit.com${message.commentsUrl}`)
      .then((r) => r.json())
      .then((r) => {
        const children =
          r && r[1] && r[1].data && Array.isArray(r[1].data.children)
            ? r[1].data.children
            : [];
        sendResponse(children);
      })
      .catch((err) => sendResponse({ error: String(err) }));
    return true;
  }

  // Fetch posts for a URL
  if (message.url) {
    Promise.all([fetchPosts(message.url), getModhash()])
      .then(([posts, modhash]) => sendResponse({ posts, modhash }))
      .catch((err) => sendResponse({ error: String(err) }));
    return true;
  }

  // Vote
  if (message.voteId) {
    (async () => {
      const modhash = await getModhash();
      if (!modhash) return;
      const url = buildUrl('https://www.reddit.com/api/vote.json', {
        dir: message.direction,
        id: message.voteId,
        rank: 2,
        uh: modhash,
      });
      await fetch(url.toString(), { method: 'POST' });
    })();
  }

  // Reply
  if (message.replyId) {
    (async () => {
      const modhash = await getModhash();
      const url = buildUrl('https://www.reddit.com/api/comment.json', {
        api_type: 'json',
        text: message.replyText,
        thing_id: message.replyId,
        uh: modhash,
      });
      const res = await fetch(url.toString(), { method: 'POST' });
      sendResponse(await res.json());
    })();
    return true;
  }

  // Save / Unsave
  if (message.saveId) {
    (async () => {
      const modhash = await getModhash();
      const url = buildUrl(
        `https://www.reddit.com/api/${message.action}.json`,
        { id: message.saveId, uh: modhash }
      );
      const res = await fetch(url.toString(), { method: 'POST' });
      sendResponse(res.ok ? { success: true } : { error: await res.text() });
    })();
    return true;
  }
});

// Side panel default behaviour
chrome.storage.local.get(['sidePanelDefault'], (result) => {
  if (result.sidePanelDefault) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
  }
});
