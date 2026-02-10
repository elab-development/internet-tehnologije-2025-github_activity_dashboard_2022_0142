export type Commit = {
  sha: string;
  message: string;
  author: string;
  login?: string;
  avatar?: string;
  date: string;
  url: string;
}