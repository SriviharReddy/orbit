/** ReplyToggle — toggle the reply form open/closed. Reconstructed from `dn` in bundle. */
import React from 'react';
import { Button } from 'theme-ui';

interface Props {
  showReplyForm: boolean;
  setShowReplyForm: (v: boolean) => void;
}

const ReplyToggle: React.FC<Props> = ({ showReplyForm, setShowReplyForm }) => (
  <Button onClick={() => setShowReplyForm(!showReplyForm)} variant="action">
    {showReplyForm ? 'cancel' : 'reply'}
  </Button>
);

export default ReplyToggle;
