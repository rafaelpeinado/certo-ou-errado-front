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
  public finalMessage!: string;

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
    this.showAlert = false;
    this.answerResult = answer === this.question.isCorrect;

    if (this.answerResult) {
      this.totalPoints += this.CORRECT_ANSWER_POINTS;
      this.showAlertWithStyle('success', `Você acertou a frase ${this.actualPage}!`);
      this.next();
      return;
    }

    if (this.question.isCorrect && this.answerResult != null && !this.answerResult) {
      this.showAlertWithStyle('danger', `Você errou a frase ${this.actualPage}!`);
      this.next();
      return;
    }

    this.saveStatus();
    this.showAlertWithStyle('warning', `Infelizmente está errado. Corrija a frase ${this.actualPage}.`);
  }

  public send(): void {
    if (this.question.correctPhrase) {
      const correctedPhrase: string = this.patternPhrase(this.correctedPhrase);
      const correctPhrase: string = this.patternPhrase(this.question.correctPhrase);

      if (correctedPhrase.includes(correctPhrase)) {
        this.showAlertWithStyle('success', `Parabéns! Você corrigiu a frase ${this.actualPage} corretamente.`);
        this.totalPoints += this.CORRECT_PHRASE_POINTS;
      } else {
        this.showAlertWithStyle('danger', `Infelizmente você errou na correção da frase ${this.actualPage}.`);
      }
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
            this.clearStatus();
            this.quizService.clearQuestions();
            this.finishQuiz(finalPoints, finalTime);
            setTimeout(() => {
              this.router.navigate([`/${AppRoutes.RANKING}`]);
            }, 5000)
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
    return phrase
      .replaceAll(/\s+/g, ' ')      // substitui múltiplos espaços por um único espaço
      .replaceAll(/\.+$/g, '')      // remove pontos finais no fim da frase
      .toLocaleLowerCase()          // converte para minúsculas
      .trim();                      // remove espaços do início e fim
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
      answerResult: this.answerResult,
      answered: this.answered,
    }));
  }

  private loadStatus(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      const status = JSON.parse(data);
      this.actualPage = status.actualPage;
      this.totalPoints = status.totalPoints;
      this.startTime = status.startTime;
      this.answerResult = status.answerResult;
      this.answered = status.answered;
    }
  }

  private clearStatus(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  showAlert = false;
  alertMessage = '';
  alertClass = 'alert-success';

  private showAlertWithStyle(type: 'success' | 'danger' | 'warning', message: string): void {
    this.alertClass = `alert-${type}`;
    this.alertMessage = message;
    this.showAlert = true;
  }

  private finishQuiz(finalPoints: number, finalTime: number): void {
    this.finalMessage = `
    <h4 class="fw-bold">Parabéns!</h4>
    Obrigado por participar!<br>
    Pontos: <strong>${finalPoints.toFixed(2)}</strong><br>
    Tempo: <strong>${this.formatMs(finalTime)}</strong>
  `;
  }

}
