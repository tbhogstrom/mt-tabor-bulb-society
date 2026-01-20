export type Neighborhood =
  | 'mt-tabor'
  | 'montavilla'
  | 'richmond'
  | 'division'
  | 'hawthorne'
  | 'sellwood'
  | 'other';

export const NEIGHBORHOODS: { value: Neighborhood; label: string }[] = [
  { value: 'mt-tabor', label: 'Mt Tabor' },
  { value: 'montavilla', label: 'Montavilla' },
  { value: 'richmond', label: 'Richmond' },
  { value: 'division', label: 'Division' },
  { value: 'hawthorne', label: 'Hawthorne' },
  { value: 'sellwood', label: 'Sellwood' },
  { value: 'other', label: 'Other' },
];

export interface ForumPost {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  displayName: string;
  title: string;
  body?: string; // Supports markdown
  caption?: string;
  neighborhood?: Neighborhood;
  speciesGuess?: string;
  needsIdHelp: boolean;
  createdAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  commentCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  parentCommentId?: string;
  displayName: string;
  content: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'walk' | 'talk' | 'sale' | 'meeting' | 'other';
}

export interface BoardMember {
  name: string;
  role: string;
  bio?: string;
}

export interface AdminStats {
  totalPosts: number;
  postsThisWeek: number;
  totalComments: number;
  commentsThisWeek: number;
  deletedPosts: number;
  deletedComments: number;
}
