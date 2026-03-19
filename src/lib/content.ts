import type { CollectionResponse, NewsItem, TrendingItem } from '../types/content';

async function fetchCollection<T>(path: string): Promise<CollectionResponse<T>> {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json() as Promise<CollectionResponse<T>>;
}

export function fetchNewsData() {
  return fetchCollection<NewsItem>('/data/news/latest.json');
}

export function fetchTrendingData(range: 'daily' | 'weekly' | 'monthly') {
  return fetchCollection<TrendingItem>(`/data/trending/${range}.json`);
}
