/** NoPostsFound — shown when no Reddit posts match the URL. Reconstructed from `Tn` in bundle. */
import React from 'react';
import { Link } from 'theme-ui';

interface Props {
  url: string;
}

const NoPostsFound: React.FC<Props> = ({ url }) => (
  <>
    No posts found.{' '}
    <Link
      href={`https://www.reddit.com/submit?url=${url}`}
      rel="noreferrer"
      target="_blank"
      sx={{
        color: 'primary',
        textDecoration: 'none',
        ml: '4px',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      Submit it
    </Link>
  </>
);

export default NoPostsFound;
