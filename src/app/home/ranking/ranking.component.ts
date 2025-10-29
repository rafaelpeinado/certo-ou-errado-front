import { AppRoutes } from './../../shared/app-routes.enum';
import { Component, OnInit } from '@angular/core';
import { RankingResponse } from 'src/app/core/interfaces/ranking.interface';
import { RankingService } from 'src/app/core/services/ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  public rankings: RankingResponse[] = [];
  public appRoutes = AppRoutes;

  constructor(
    private readonly rankingService: RankingService,
  ) { }

  ngOnInit(): void {
    this.rankingService.getRankings()
      .subscribe((rankings: RankingResponse[]) => this.rankings = rankings);
  }

  getMedalClass(i: number) {
    switch (i) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return '';
    }
  }
}
