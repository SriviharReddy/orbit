/** Loading — empty state / loading message container. Reconstructed from `bn` in bundle. */
import React from 'react';
import { Box, Flex } from 'theme-ui';
import YouTubeIcon from './YouTubeIcon';

interface Props {
  isContent?: boolean;
  isComments?: boolean;
  children: React.ReactNode;
}

const Loading: React.FC<Props> = ({ isContent, isComments, children }) => (
  <Flex
    sx={{
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      pt: isContent ? '0' : '14px',
      pb: '14px',
    }}
  >
    <Box />
    <Flex>{children}</Flex>
    <Box>
      <YouTubeIcon isContent={isContent} isComments={isComments} />
    </Box>
  </Flex>
);

export default Loading;
