export interface Photo {
    id: number;
    url: string;
    description: string;
    type: 'photo'; 
  }
  
  export interface Prompt {
    id: number;
    question: string;
    answer: string;
    type: 'prompt';
  }
  
  export interface Votes {
    [key: string]: number;
  }
  
  export interface User {
    id: string;
    username?: string;
    gender: 'male' | 'female' | 'other';
    attractedTo: ('men' | 'women' | 'both')[];
    comparisons: number;
    lastActive: number;
  }
  
  export interface VoteRecord {
    [key: string]: number;
  }