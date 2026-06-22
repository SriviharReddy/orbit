/** YouTubeIcon — button to switch back to YouTube comments. Reconstructed from `vn` in bundle.
 *  Only visible in isContent mode on the posts/loading view (not on comments list). */
import React from 'react';
import { Button } from 'theme-ui';
import { showYouTubeComments } from '../utils';

interface Props {
  isContent?: boolean;
  isComments?: boolean;
}

const YouTubeIcon: React.FC<Props> = ({ isContent, isComments }) => {
  if (!isContent || isComments) return null;

  return (
    <Button
      onClick={showYouTubeComments}
      sx={{
        all: 'unset',
        cursor: 'pointer',
        transition: '.1s linear',
        'svg > path': { fill: 'button' },
        ':hover': { opacity: 0.8 },
      }}
    >
      {/* YouTube logo SVG — path from original bundle */}
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" version="1.1" viewBox="0 0 36 36">
        <path
          strokeWidth="1.125"
          d="M17.994 4.38c-9.83 0-13.614 1-14.585 6.101C2.603 13.126 2.603 18 2.603 18s0 4.874.806 7.519C4.38 30.62 8.163 31.62 18 31.62c9.83 0 13.614-1 14.585-6.1.806-2.646.806-7.52.806-7.52s0-4.874-.806-7.52C31.614 5.381 27.83 4.38 18 4.38zM14.81 23.27v-10.54L24.31 18l-9.5 5.27z"
        />
      </svg>
    </Button>
  );
};

export default YouTubeIcon;
