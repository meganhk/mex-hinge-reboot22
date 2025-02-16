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
