import { inject } from '@angular/core';
import { CanActivateChildFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs';
import { Ranking } from '../interfaces/ranking.interface';
import { AuthService } from '../services/auth.service';
import { RankingService } from '../services/ranking.service';

const allow = true;
const deny = (router: Router): UrlTree => router.createUrlTree(['/login']);

export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? allow : deny(router);
};

export const authChildGuard: CanActivateChildFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? allow : deny(router);
};

export const loggedOutGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return !auth.isLoggedIn() ? allow : router.createUrlTree(['/home']);
};

export const canGoToQuestions: CanMatchFn = () => {
  const rankingService = inject(RankingService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser();
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  return rankingService.getRankingByUserId(user.id).pipe(
    map((ranking) => ranking ? router.createUrlTree(['/home']) : allow)
  );
};
