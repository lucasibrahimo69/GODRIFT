
export type ItemCategory = 'car' | 'track';

export interface RacingItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: ItemCategory;
  spec?: string;
}

export interface VoteData {
  id: string;
  count: number;
}

export interface AIAnalysis {
  itemTitle: string;
  pros: string[];
  tips: string;
}
