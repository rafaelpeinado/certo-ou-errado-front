export interface User {
  id: number,
  name: string;
  student: boolean;
  age: number;
  awareCheck: boolean;
  gameId: string;
  class?: string;
}

export interface UserRequest {
  name: string;
  role: 'STUDENT' | 'VISITOR';
  age: number;
  class?: string;
}
