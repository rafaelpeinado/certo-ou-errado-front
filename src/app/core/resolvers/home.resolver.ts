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

  const cachedData = getCachedAlreadyPlayedAndGameId();
  if (cachedData && cachedData.alreadyPlayed) {
    return of(cachedData);
  }

  return rankingService.getRankingByUserId(user.id).pipe(
    map(ranking => {
      const alreadyPlayed = !!ranking;
      const gameId = user.gameId;
      cacheAlreadyPlayedAndGameId(alreadyPlayed, gameId);
      return { alreadyPlayed, gameId };
    })
  );
};

function cacheAlreadyPlayedAndGameId(alreadyPlayed: boolean, gameId: string) {
  localStorage.setItem('alreadyPlayed', JSON.stringify(alreadyPlayed));
  localStorage.setItem('gameId', gameId);
}

function getCachedAlreadyPlayedAndGameId(): { alreadyPlayed: boolean; gameId: string } | null {
  const alreadyPlayedData = localStorage.getItem('alreadyPlayed');
  const gameId = localStorage.getItem('gameId');
  if (alreadyPlayedData && gameId) {
    return {
      alreadyPlayed: JSON.parse(alreadyPlayedData),
      gameId: gameId
    };
  }
  return null;
}
