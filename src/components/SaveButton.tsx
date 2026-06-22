/** SaveButton — save/unsave a post or comment. Reconstructed from `cn` in bundle. */
import React, { useState } from 'react';
import { Button } from 'theme-ui';

interface Props {
  name: string;
  isSaved: boolean;
}

const SaveButton: React.FC<Props> = ({ name, isSaved }) => {
  const [saved, setSaved] = useState(isSaved);

  const handleClick = () => {
    const action = saved ? 'unsave' : 'save';
    chrome.runtime.sendMessage({ saveId: name, action }, (response) => {
      if (response?.error) {
        console.error(response.error);
      } else {
        setSaved(!saved);
      }
    });
  };

  return (
    <Button onClick={handleClick} variant="action">
      {saved ? 'unsave' : 'save'}
    </Button>
  );
};

export default SaveButton;
