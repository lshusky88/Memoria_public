
// Types for entities in our application
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatar?: string | null;
}

export interface Family {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  relation?: string | null;
  birthDate?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Memory {
  id: string;
  title: string;
  description?: string | null;
  memberId: string;
  categoryId?: string | null;
  date: string;
  mediaUrls: string[];
  mediaType: 'image' | 'video' | 'audio' | 'note';
  locationName?: string | null;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
  createdAt: string;
  updatedAt: string;
  // Virtual fields for display
  memberName?: string;
  categoryName?: string;
  // Convenience property for component usage
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface Milestone {
  id: string;
  title: string;
  memberId: string;
  date: string;
  reminderDate?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Adding Prompt type for PromptCard
export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  question: string;
  isDefault?: boolean;
  categories: string[];
}

// Photo Book types
export interface PhotoBook {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  memberId?: string | null;
  memberName?: string | null;
  memoryCount: number;
  createdAt: string;
  updatedAt: string;
}

