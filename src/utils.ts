/** Formats a UTC timestamp into a human-readable relative time string.
 *  Reconstructed from `pn` function in the minified bundle. */
export const timeAgo = (utc: number): string => {
  let t = Date.now() - utc * 1000;
  if (t < 1000) return 'just now';
  t /= 1000;
  if (t < 60) return `${Math.trunc(t)} second${t < 2 ? '' : 's'}`;
  t /= 60;
  if (t < 60) return `${Math.trunc(t)} minute${t < 2 ? '' : 's'}`;
  t /= 60;
  if (t < 24) return `${Math.trunc(t)} hour${t < 2 ? '' : 's'}`;
  t /= 24;
  if (t < 7) return `${Math.trunc(t)} day${t < 2 ? '' : 's'}`;
  t /= 7;
  if (t < 4) return `${Math.trunc(t)} week${t < 2 ? '' : 's'}`;
  t /= 4;
  if (t < 13) return `${Math.trunc(t)} month${t < 2 ? '' : 's'}`;
  t /= 12;
  return `${Math.trunc(t)} year${t < 2 ? '' : 's'}`;
};

/** Formats a score number — abbreviates to "k" above 9999.
 *  Reconstructed from `mn` function in the minified bundle. */
export const formatScore = (score: number): string => {
  if (Math.abs(score) > 9999) {
    return `${(Math.sign(score) * (Math.abs(score) / 1000)).toFixed(0)}k`;
  }
  return `${Math.sign(score) * Math.abs(score)}`;
};

/** Fetches comments for a post via the background worker (avoids CORS on YouTube). */
export const fetchComments = (permalink: string): Promise<any[]> =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ commentsUrl: permalink }, (response) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      if (response && response.error) return reject(response.error);
      if (Array.isArray(response)) return resolve(response);
      reject(new Error('Bad response'));
    });
  });

/** Show Reddit comments, hide YouTube comments. */
export const showRedditComments = () => {
  const yt = document.getElementById('comments');
  const wrap = document.getElementById('redditImgWrap');
  const reddit = document.getElementById('redditComments');
  if (yt) yt.style.display = 'none';
  if (wrap) wrap.style.display = 'none';
  if (reddit) reddit.style.display = 'block';
};

/** Show YouTube comments, hide Reddit comments. */
export const showYouTubeComments = () => {
  const reddit = document.getElementById('redditComments');
  const yt = document.getElementById('comments');
  const wrap = document.getElementById('redditImgWrap');
  if (reddit) reddit.style.display = 'none';
  if (yt) yt.style.display = 'block';
  if (wrap) wrap.style.display = 'flex';
};
