import { RankingService } from './../../core/services/ranking.service';
import { Component, OnInit } from '@angular/core';
import { Question } from '../../core/interfaces/question.interface';
import { QuizService } from 'src/app/core/services/quiz.service';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/shared/app-routes.enum';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public question!: Question;
  public totalPoints: number = 0;
  public actualPage: number = 1;
  public correctedPhrase: string = '';
  public answerResult: boolean | null = null;
  public answered: boolean = false;

  private startTime: number = Date.now();

  private readonly MAX_QUESTIONS: number = 15;
  private readonly CORRECT_ANSWER_POINTS: number = 5;
  private readonly CORRECT_PHRASE_POINTS: number = 2;
  private readonly MULTIPLIER_POINTS: number = 1000;
  private readonly STORAGE_KEY: string = 'quiz-status';

  constructor(
    private readonly quizService: QuizService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly rankingService: RankingService,
  ) { }

  ngOnInit(): void {
    this.loadStatus();
    this.question = this.quizService.questions[this.actualPage - 1];
  }

  public answer(answer: boolean): void {
    this.answered = true;
    this.answerResult = answer === this.question.isCorrect;

    if (this.answerResult) {
      this.totalPoints += this.CORRECT_ANSWER_POINTS;
      alert('Você acertou!');
      this.next();
      return;
    }

    if (this.question.isCorrect && this.answerResult != null && !this.answerResult) {
      alert('Você errou!');
      this.next();
      return;
    }

    alert('Infelizmente a resposta está errada. Escreva a frase corretamente.');
  }

  public send(): void {
    if (this.question.correctPhrase) {
      const correctedPhrase: string = this.patternPhrase(this.correctedPhrase);
      const correctPhrase: string = this.patternPhrase(this.question.correctPhrase);

      let text: string;

      if (correctedPhrase.includes(correctPhrase)) {
        text = 'Parabéns! Você corrigiu a frase corretamente.';
        this.totalPoints += this.CORRECT_PHRASE_POINTS;
      } else {
        text = 'A frase corrigida está incorreta.';
      }

      alert(text);
      this.next();
    }
  }

  private next(): void {
    if (this.actualPage >= this.MAX_QUESTIONS) {
      const finalTime = Date.now() - this.startTime;
      const finalPoints = (this.totalPoints * this.MULTIPLIER_POINTS) / (this.MAX_QUESTIONS * this.CORRECT_ANSWER_POINTS);
      const user = this.authService.getUser();
      if (user) {
        this.rankingService.createRanking(this.createRankingRequest(user.id, finalPoints, finalTime))
          .subscribe(() => {
            alert('Você finalizou o questionário. Obrigado por participar! Pontos: ' + finalPoints + ' Tempo: ' + this.formatMs(finalTime));
            this.clearStatus();
            this.router.navigate([`/${AppRoutes.RANKING}`]);
          });
      } else {
        this.router.navigate([`/${AppRoutes.LOGIN}`]);
      }
    } else {
      this.actualPage += 1;
      this.answerResult = null;
      this.correctedPhrase = '';
      this.answered = false;
      this.question = this.quizService.questions[this.actualPage - 1];
      this.saveStatus();
    }
  }

  // private formatMs(ms: number): string {
  //   const totalSeconds = Math.floor(ms / 1000);
  //   const hours = Math.floor(totalSeconds / 3600); const minutes = Math.floor((totalSeconds % 3600) / 60);
  //   const seconds = totalSeconds % 60;
  //   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}s`;
  // }

  private formatMs(ms: number): string {
    if (ms == null || ms < 0) return '00:00:000';

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const msStr = String(milliseconds).padStart(3, '0');

    return `${mm}:${ss}:${msStr}`;
  }

  private patternPhrase(phrase: string): string {
    return phrase.replaceAll(/\s+/g, ' ').toLocaleLowerCase()
  }

  private createRankingRequest(userId: number, score: number, timeMs: number) {
    return {
      userId,
      score,
      timeMs,
    };
  }

  private saveStatus(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      actualPage: this.actualPage,
      totalPoints: this.totalPoints,
      startTime: this.startTime,
    }));
  }

  private loadStatus(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      const status = JSON.parse(data);
      this.actualPage = status.actualPage;
      this.totalPoints = status.totalPoints;
      this.startTime = status.startTime;
    }
  }

  private clearStatus(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
