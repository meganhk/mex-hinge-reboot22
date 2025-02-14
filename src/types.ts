export interface Photo {
    id: number;
    url: string;
    description: string;
  }
  
  export interface Prompt {
    id: number;
    question: string;
    answer: string;
  }
  
  export interface Votes {
    [key: number]: number;
  }