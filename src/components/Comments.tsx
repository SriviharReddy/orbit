/** Comments — renders the list of top-level comments. Reconstructed from `En` in bundle. */
import React from 'react';
import { Box } from 'theme-ui';
import Comment from './Comment';
import Loading from './Loading';
import { RedditPost } from '../types';

interface Props {
  comments: any[] | undefined;
  currentPost: RedditPost;
  isContent?: boolean;
  isLoggedIn: boolean;
  commentsMessage: string | React.ReactNode;
  newReply?: any;
}

const Comments: React.FC<Props> = ({
  comments,
  currentPost,
  isContent,
  isLoggedIn,
  commentsMessage,
  newReply,
}) => {
  if (Array.isArray(comments) && comments.length >= 0) {
    return (
      <Box sx={{ mt: '14px', mr: '4px' }}>
        {newReply && (
          <Comment comment={newReply} permalink={currentPost.permalink} isLoggedIn={isLoggedIn} depth={0} />
        )}
        {comments.map((comment) => (
          <Comment
            key={comment.data.id}
            comment={comment}
            permalink={currentPost.permalink}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </Box>
    );
  }

  return (
    <Loading isContent={isContent} isComments>
      {commentsMessage}
    </Loading>
  );
};

export default Comments;
