export interface MangaTags {
  authors: string[];
  characters: string[];
  general: string[];
  series: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  date: string;
  read: boolean;
  size?: string;
}

export type LayoutDensity = 'comfortable' | 'compact';

export type ComicImageSourceType = 'Local' | 'Network' | 'Cloud';

export interface MangaData {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  fileSize: string;
  format: 'CBZ' | 'ZIP' | 'PDF' | 'FOLDER';
  path: string;
  rating: number;
  dateAdded?: string;
  series?: string;
  tags: MangaTags;
  chapters?: Chapter[];
  lastReadChapterId?: string;
  status?: 'Reading' | 'Completed' | 'Plan to Read'; // User reading status
  publicationStatus?: '连载中' | '已完结'; // Publication status for filter
  imageSourceType?: ComicImageSourceType; // For filter
  lastOpened?: string;
}