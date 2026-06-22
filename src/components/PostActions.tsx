/** PostActions — post title, voting row, reply, save. Reconstructed from `yn` in bundle. */
import React, { useState } from 'react';
import { Box, Divider, Flex, Link } from 'theme-ui';
import CommentInfo from './CommentInfo';
import SaveButton from './SaveButton';
import ReplyToggle from './ReplyToggle';
import ReplyForm from './ReplyForm';
import { RedditPost } from '../types';

interface Props {
  currentPost: RedditPost;
  setNewReply: (reply: any) => void;
  isLoggedIn: boolean;
}

const PostActions: React.FC<Props> = ({ currentPost, setNewReply, isLoggedIn }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <>
      <Box sx={{ mt: '18px' }}>
        <Link
          sx={{
            display: 'block',
            color: 'primaryText',
            fontSize: '16px',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: '.1s linear',
            lineHeight: '22px',
            mb: '8px',
            '&:hover': { color: 'primary' },
          }}
          href={`https://reddit.com${currentPost.permalink}`}
          target="_blank"
          rel="noreferrer"
          dangerouslySetInnerHTML={{ __html: currentPost.title }}
        />
        <Flex sx={{ gap: '12px' }}>
          <CommentInfo infoSource={currentPost} />
          {isLoggedIn && (
            <>
              <SaveButton name={currentPost.name} isSaved={currentPost.saved} />
              <ReplyToggle showReplyForm={showReplyForm} setShowReplyForm={setShowReplyForm} />
            </>
          )}
        </Flex>
      </Box>
      <ReplyForm
        name={currentPost.name}
        showReplyForm={showReplyForm}
        setShowReplyForm={setShowReplyForm}
        setNewReply={setNewReply}
      />
      <Divider sx={{ color: 'border', mt: '18px' }} />
    </>
  );
};

export default PostActions;
