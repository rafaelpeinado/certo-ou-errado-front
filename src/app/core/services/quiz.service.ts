import { Injectable } from '@angular/core';
import { Question } from '../interfaces/question.interface';
import { QUESTIONS } from '../datas/questions.data';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private pool: readonly Question[] = QUESTIONS;
  private readonly STORAGE_KEY: string = 'quiz-selected-questions';

  private randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private drawIds(n: number): number[] {
    const ids = new Set<number>();

    while (ids.size < n) {
      const randomId = this.randomInt(1, this.pool.length);
      ids.add(randomId);
    }

    return [...ids];
  }

  private saveStorage(questions: Question[]): Question[] {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questions));
    return questions;
  }

  private getStorage(): Question[] | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) as Question[] : null;
  }

  private loadRound(n = 15): Question[] {
    const ids = this.drawIds(n);
    const selected = ids
      .map(id => this.pool.find(q => q.id === id)!)
      .filter(Boolean);

    return this.saveStorage(selected);
  }

  get questions(): Question[] {
    const selected = this.getStorage() || [];
    if (selected.length === 0) {
      return this.loadRound();
    }
    return selected;
  }
}
