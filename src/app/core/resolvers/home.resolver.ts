import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RankingService } from '../services/ranking.service';

export const homeResolver: ResolveFn<{ alreadyPlayed: boolean; gameId: string }> = () => {
  const authService = inject(AuthService);
  const rankingService = inject(RankingService);
  const router = inject(Router);

  const user = authService.getUser();
  if (!user) {
    router.navigate(['/login']);
    return of({ alreadyPlayed: false, gameId: '' });
  }

  return rankingService.getRankingByUserId(user.id).pipe(
    map(ranking => ({
      alreadyPlayed: !!ranking,
      gameId: user.gameId
    }))
  );
};
