import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AppRoutes } from '../shared/app-routes.enum';
import { AuthService } from '../core/services/auth.service';
import { RankingService } from '../core/services/ranking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public routes = AppRoutes;
  public alreadyPlayed: boolean = false;
  public gameId!: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly rankingService: RankingService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const { alreadyPlayed, gameId } = data['questions'];
      this.alreadyPlayed = alreadyPlayed;
      this.gameId = gameId;
    });
  }

  public navigate(path: string): void {
    this.router.navigate([path], { relativeTo: this.route });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate([`/${AppRoutes.LOGIN}`]);
  }



}
