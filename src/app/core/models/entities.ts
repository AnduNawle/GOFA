export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  date: any; // Firestore Timestamp
  location: string;
  category: string;
  competition: string;
  isFinished: boolean;
  homeLogo?: string;
  awayLogo?: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  category: string;
  photoUrl?: string;
  stats?: {
    matches: number;
    goals: number;
    assists: number;
  };
  isPlayerOfTheWeek?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  date: any; // Firestore Timestamp
  imageUrl?: string;
  category: string;
}
