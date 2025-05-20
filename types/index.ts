export interface Post {
  id: string;
  text: string;
  scheduledDate: string; // ISO string
  platform: 'Facebook' | 'Instagram' | 'Twitter';
  hashtags: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  notes: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type PlatformType = 'Facebook' | 'Instagram' | 'Twitter';
export type StatusType = 'Draft' | 'Scheduled' | 'Published';

export interface CalendarMarking {
  [date: string]: {
    marked: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
}