export interface RankingRequest {
  userId: number;
  score: number;
  timeMs: number;
}

export interface RankingResponse {
  id: number;
  userId: number;
  timeMs: number;
  score: number;
  name: string;
  role: 'STUDENT' | 'VISITOR';
  age: number;
  gameId: string;
  class?: string;
}

export interface Ranking {
    id: number;
    userId: number;
    timeMs: number;
    score: number;
    createdAt: string;
};
