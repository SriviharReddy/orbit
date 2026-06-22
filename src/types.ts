// Reddit API types reconstructed from bundle analysis

export interface RedditPost {
  id: string;
  name: string;
  title: string;
  subreddit: string;
  permalink: string;
  url: string;
  score: number;
  num_comments: number;
  author: string;
  created_utc: number;
  likes: boolean | null;
  saved: boolean;
  modhash?: string;
}

export interface RedditComment {
  kind: 't1' | 'more';
  data: RedditCommentData | RedditMoreData;
}

export interface RedditCommentData {
  id: string;
  name: string;
  author: string;
  body: string;
  body_html: string;
  score: number;
  likes: boolean | null;
  saved: boolean;
  created_utc: number;
  depth: number;
  parent_id: string;
  permalink: string;
  replies: { data: { children: RedditComment[] } } | string;
}

export interface RedditMoreData {
  id: string;
  name: string;
  count: number;
  depth: number;
  children: string[];
  parent_id: string;
}

export interface BackgroundResponse {
  posts?: RedditPost[];
  modhash?: string;
  error?: string;
}
