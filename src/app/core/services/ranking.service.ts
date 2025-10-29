import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, of, tap } from 'rxjs';
import { RankingRequest, RankingResponse } from '../interfaces/ranking.interface';

@Injectable({ providedIn: 'root' })
export class RankingService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public createRanking(user: RankingRequest): Observable<void> {
    return this.http.post<void>('/api/ranking', user).pipe(first());
  }

  public getRankings(): Observable<RankingResponse[]> {
    return this.http.get<RankingResponse[]>('/api/ranking').pipe(first());
  }

  public getRankingByUserId(userId: number): Observable<RankingResponse> {
    return this.http.get<RankingResponse>(`/api/ranking/user/${userId}`).pipe(
      first(),
      catchError((error) => {
        if (error.status === 404) {
          return of(null);
        }
        return of(error);
      })
    );
  }
}
