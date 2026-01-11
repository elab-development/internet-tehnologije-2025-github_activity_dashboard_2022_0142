export type Repo = {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  isBookmarked?: boolean;
};