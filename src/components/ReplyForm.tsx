/** ReplyForm — inline reply form. Reconstructed from `fn` in bundle. */
import React, { useState } from 'react';
import { Box, Button, Flex, Text, Textarea } from 'theme-ui';

interface Props {
  name: string;
  showReplyForm: boolean;
  setShowReplyForm: (v: boolean) => void;
  setNewReply: (reply: any) => void;
}

const ReplyForm: React.FC<Props> = ({ name, showReplyForm, setShowReplyForm, setNewReply }) => {
  const [error, setError] = useState<string | null>(null);

  if (!showReplyForm) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const replyText = (form.elements.namedItem('reply') as HTMLTextAreaElement).value;
    chrome.runtime.sendMessage({ replyId: name, replyText }, (response) => {
      if (response?.json?.errors?.length > 0) {
        setError(response.json.errors[0][1]);
      } else {
        setShowReplyForm(false);
        setNewReply(response?.json?.data?.things?.[0]);
      }
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit as any}>
      <Textarea
        name="reply"
        sx={{
          border: '1px solid',
          borderColor: 'border',
          height: '120px',
          background: 'transparent',
          mt: '12px',
          outline: 'none',
          font: 'inherit',
          fontSize: '14px',
          resize: 'vertical',
          transition: '.1s linear',
          '&:hover': { borderColor: 'primary' },
          '&:focus': { borderColor: 'primary' },
        }}
      />
      <Flex sx={{ gap: '6px', alignItems: 'center' }}>
        <Button
          type="submit"
          sx={{
            all: 'unset',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
            color: 'textDark',
            p: '4px 8px',
            mt: '8px',
            borderRadius: '3px',
            border: '1px solid',
            borderColor: 'border',
            transition: '.1s linear',
            background: 'button',
            '&:hover': { backgroundColor: 'border' },
          }}
        >
          Reply
        </Button>
        {error && (
          <Text sx={{ color: 'error', fontSize: '13px', display: 'block', mt: '6px' }}>
            {error}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default ReplyForm;
