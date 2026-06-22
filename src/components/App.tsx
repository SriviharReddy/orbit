/** App — main component. Reconstructed from `Un` in bundle.
 *  Handles post fetch, comment fetch, theme, and layout. */
import React, { useEffect, useState } from 'react';
import { Box, Flex } from 'theme-ui';
import { useColorMode } from 'theme-ui';
import Subreddits from './Subreddits';
import YouTubeIcon from './YouTubeIcon';
import PostActions from './PostActions';
import Sort from './Sort';
import Comments from './Comments';
import Loading from './Loading';
import NoPostsFound from './NoPostsFound';
import { fetchComments, showRedditComments, showYouTubeComments } from '../utils';
import { RedditPost } from '../types';

interface Props {
  url?: string;
  isContent?: boolean;   // embedded under YouTube video
  isSidePanel?: boolean; // running in side panel
}

const App: React.FC<Props> = ({ url, isContent, isSidePanel }) => {
  const [posts, setPosts] = useState<RedditPost[] | undefined>();
  const [currentPost, setCurrentPost] = useState<RedditPost | undefined>();
  const [comments, setComments] = useState<any[] | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postsMessage, setPostsMessage] = useState<React.ReactNode>('Loading...');
  const [commentsMessage, setCommentsMessage] = useState<React.ReactNode>('Loading...');
  const [newReply, setNewReply] = useState<any>();
  const [sortType, setSortType] = useState('best');
  const [, setColorMode] = useColorMode();

  // Apply saved theme preference
  chrome.storage.local.get(['theme'], (result) => {
    if (result.theme === 'default') {
      setColorMode(
        window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      );
    } else {
      setColorMode(result.theme);
    }
  });

  // Reset state when side panel URL changes
  useEffect(() => {
    if (isSidePanel) {
      setPosts(undefined);
      setCurrentPost(undefined);
      setComments(undefined);
      setIsLoggedIn(false);
      setPostsMessage('Loading...');
      setCommentsMessage('Loading...');
      setNewReply(undefined);
      setSortType('best');
    }

    if (!url) return;

    chrome.runtime.sendMessage({ url }, (response) => {
      if (response?.error) {
        setPostsMessage(`Error: ${response.error}`);
        return;
      }
      if (!response?.posts) return;

      if (response.posts.length === 0) {
        if (isContent) showYouTubeComments();
        setPostsMessage(<NoPostsFound url={url} />);
        return;
      }

      chrome.storage.local.get(['sortType', 'youtubeDefault'], (prefs) => {
        if (isContent) {
          prefs.youtubeDefault ? showYouTubeComments() : showRedditComments();
        }
        if (prefs.sortType) setSortType(prefs.sortType);
        setPosts(response.posts);
        setCurrentPost(response.posts[0]);
        setIsLoggedIn(!!response.modhash);
      });
    });
  }, [isContent, isSidePanel, url]);

  // Fetch comments when post or sort changes
  useEffect(() => {
    if (!currentPost) return;
    setCommentsMessage('Loading...');
    setComments(undefined);
    fetchComments(currentPost.permalink + `?sort=${sortType}`)
      .then((data) => setComments(data))
      .catch((err) => {
        console.log('getComments', err);
        setCommentsMessage(`Error: ${err}`);
      });
  }, [currentPost, sortType]);

  return (
    <Box sx={{ color: 'primaryText', pl: isContent || isSidePanel ? null : 'calc(100vw - 100%)' }}>
      {posts && currentPost ? (
        <>
          <Flex sx={{ gap: '16px' }}>
            <Subreddits posts={posts} currentPost={currentPost} setCurrentPost={setCurrentPost} />
            <YouTubeIcon isContent={isContent} />
          </Flex>
          <Box sx={{ mx: isContent ? '0' : '12px' }}>
            <PostActions currentPost={currentPost} setNewReply={setNewReply} isLoggedIn={isLoggedIn} />
            <Sort sortType={sortType} setSortType={setSortType} />
            <Comments
              comments={comments}
              currentPost={currentPost}
              isContent={isContent}
              isLoggedIn={isLoggedIn}
              commentsMessage={commentsMessage}
              newReply={newReply}
            />
          </Box>
        </>
      ) : (
        <Loading isContent={isContent}>{postsMessage}</Loading>
      )}
    </Box>
  );
};

export default App;
