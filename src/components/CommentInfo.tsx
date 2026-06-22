/** CommentInfo — author, score, timestamp row. Reconstructed from `gn` in bundle. */
import React, { useState, useEffect } from 'react';
import { Box, Flex, Link, Text } from 'theme-ui';
import VoteButton from './VoteButton';
import { timeAgo, formatScore } from '../utils';

interface Props {
  infoSource: {
    name: string;
    author: string;
    score: number;
    likes: boolean | null;
    created_utc: number;
  };
}

const CommentInfo: React.FC<Props> = ({ infoSource }) => {
  const [vote, setVote] = useState(0);
  const [score, setScore] = useState(infoSource.score);

  useEffect(() => {
    setScore(infoSource.score);
  }, [infoSource.score]);

  useEffect(() => {
    setVote(infoSource.likes ? 1 : infoSource.likes === false ? -1 : 0);
  }, [infoSource.likes]);

  const handleVote = (direction: 1 | -1) => {
    const newScore = (() => {
      if (vote === direction) return score - direction;         // un-vote
      if (vote + direction === 0) return score + 2 * direction; // flip vote
      return score + direction;
    })();
    setScore(newScore);
    const newVote = vote === direction ? 0 : direction;
    setVote(newVote);
    chrome.runtime.sendMessage({ voteId: infoSource.name, direction: newVote });
  };

  return (
    <Flex sx={{ gap: '12px', fontSize: '13px', color: 'secondaryText', flexWrap: 'wrap' }}>
      <Flex sx={{ alignItems: 'center', gap: '6px' }}>
        <VoteButton vote={vote} voteType={1} handleClick={handleVote} size="14px" />
        <Text
          sx={{
            fontWeight: 'bold',
            color: vote === 1 ? 'orange' : vote === -1 ? 'purple' : 'secondaryText',
          }}
        >
          {formatScore(score)}
        </Text>
        <VoteButton vote={vote} voteType={-1} handleClick={handleVote} size="14px" />
      </Flex>
      <Link
        href={`https://reddit.com/u/${infoSource.author}`}
        target="_blank"
        rel="noreferrer"
        sx={{ color: 'primary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
      >
        {infoSource.author}
      </Link>
      <Text sx={{ whiteSpace: 'noWrap' }}>{timeAgo(infoSource.created_utc)}</Text>
    </Flex>
  );
};

export default CommentInfo;
