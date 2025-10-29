import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RankingRoutingModule } from './ranking-routing.module';
import { RankingComponent } from './ranking.component';
import { TimeFormatPipe } from 'src/app/core/pipes/time-format.pipe';


@NgModule({
  declarations: [
    RankingComponent,
    TimeFormatPipe,
  ],
  imports: [
    CommonModule,
    RankingRoutingModule
  ],
  exports: [TimeFormatPipe],
})
export class RankingModule { }
