/** Comment — recursive single comment with replies, load-more, and collapse.
 *  Reconstructed from `Sn` / `wn` in bundle. */
import React, { useState } from 'react';
import { Box, Button, Flex, Link } from 'theme-ui';
import parse from 'html-react-parser';
import CommentInfo from './CommentInfo';
import SaveButton from './SaveButton';
import ReplyToggle from './ReplyToggle';
import ReplyForm from './ReplyForm';
import { fetchComments } from '../utils';

interface Props {
  comment: any;
  permalink: string;
  isLoggedIn: boolean;
  depth?: number;
}

/** LoadMore — handles "more comments" nodes. Reconstructed from `wn`. */
const LoadMore: React.FC<{ parent: any; comment: any; permalink: string; isLoggedIn: boolean }> = ({
  parent,
  comment,
  permalink,
  isLoggedIn,
}) => {
  const [loaded, setLoaded] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  if (loaded.length > 0) {
    return (
      <>
        {loaded.map((batch, i) =>
          batch !== undefined
            ? batch.map((item: any) => (
                <Box key={item.data.id}>
                  <Comment comment={item} permalink={permalink} isLoggedIn={isLoggedIn} depth={parent.data.depth + comment.data.depth} />
                </Box>
              ))
            : null
        )}
      </>
    );
  }

  return (
    <Box sx={{ mt: '14px' }}>
      <Box sx={{ color: 'primary', fontSize: '13px', mt: '6px' }}>
        {comment.data.count === 0 ? (
          <Link
            href={`https://www.reddit.com/${permalink}${parent.data.parent_id.substring(3)}`}
            target="_blank"
            rel="noreferrer"
            sx={{ cursor: 'pointer', textDecoration: 'none', color: 'primary', '&:hover': { textDecoration: 'underline' } }}
          >
            Continue this thread
          </Link>
        ) : (
          <Button
            sx={{ all: 'unset', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => {
              setLoading(true);
              Promise.all(
                comment.data.children.map((id: string) => fetchComments(`${permalink}${id}`))
              ).then((results) => {
                setLoaded(results);
                setLoading(false);
              });
            }}
          >
            {loading ? 'Loading...' : `Load more (${comment.data.count})`}
          </Button>
        )}
      </Box>
    </Box>
  );
};

const Comment: React.FC<Props> = ({ comment, permalink, isLoggedIn, depth }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState<any>(undefined);
  const effectiveDepth = depth !== undefined ? depth : comment.data.depth;

  if (comment.kind === 'more') {
    return (
      <Box sx={{ mt: '6px', mb: '10px' }}>
        <LoadMore parent={comment} comment={comment} permalink={permalink} isLoggedIn={isLoggedIn} />
      </Box>
    );
  }

  const bodyHtml = comment.data.body_html
    ? comment.data.body_html
        .replaceAll('<a href=', '<a target="_blank" href=')
        .replaceAll('<a target="_blank" href="/', '<a target="_blank" href="https://reddit.com/')
    : '';

  return (
    <>
      <Flex
        key={comment.data.id}
        sx={{ m: effectiveDepth ? ['18px 0 0 0', '18px 0 0 12px'] : '0 0 24px 0' }}
      >
        {/* Collapse bar */}
        <Button
          sx={{
            all: 'unset',
            cursor: 'pointer',
            pl: '12px',
            ml: '-12px',
            '&:hover': { '> div': { borderColor: 'primary' } },
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Box
            sx={{
              height: '100%',
              borderLeft: '1px solid',
              borderColor: 'border',
              transition: '.1s linear',
              pl: '4px',
              width: '12px',
            }}
          />
        </Button>

        <Box sx={{ width: '100%', ml: '4px' }}>
          {collapsed ? (
            <CommentInfo infoSource={comment.data} />
          ) : (
            <>
              <Flex>
                <Box sx={{ width: '100%' }}>
                  <CommentInfo infoSource={comment.data} />
                  {/* Comment body HTML */}
                  <Box
                    className="orbitCommentBody"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                    sx={{ fontSize: '14px', wordBreak: 'break-word', lineHeight: '22px', mt: '8px' }}
                  />
                  <Flex sx={{ gap: '12px', mt: '6px' }}>
                    <Button
                      onClick={() => window.open(`https://reddit.com${permalink}${comment.data.id}`)}
                      variant="action"
                    >
                      permalink
                    </Button>
                    {isLoggedIn && (
                      <>
                        <SaveButton name={comment.data.name} isSaved={comment.data.saved} />
                        <ReplyToggle showReplyForm={showReplyForm} setShowReplyForm={setShowReplyForm} />
                      </>
                    )}
                  </Flex>
                  <ReplyForm
                    name={comment.data.name}
                    showReplyForm={showReplyForm}
                    setShowReplyForm={setShowReplyForm}
                    setNewReply={setNewReply}
                  />
                </Box>
              </Flex>

              {/* New reply injected after submitting */}
              {newReply && (
                <Comment comment={newReply} permalink={permalink} isLoggedIn={isLoggedIn} depth={effectiveDepth + 1} />
              )}

              {/* Nested replies */}
              {comment.data.replies &&
                comment.data.replies.data?.children?.map((child: any) => (
                  <Box key={child.data.id}>
                    {child.kind === 'more' ? (
                      <LoadMore parent={comment} comment={child} permalink={permalink} isLoggedIn={isLoggedIn} />
                    ) : (
                      <Comment comment={child} permalink={permalink} isLoggedIn={isLoggedIn} depth={depth} />
                    )}
                  </Box>
                ))}
            </>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default Comment;
