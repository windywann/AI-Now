export type NewsItem = {
  id: number;
  time: string;
  date: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: string;
};

export type TrendingItem = {
  id: number;
  repo: string;
  description: string;
  language: string;
  stars: string;
  forks: string;
  todayStars: string;
  url: string;
};

export type CollectionResponse<T> = {
  updatedAt: string;
  items: T[];
};
