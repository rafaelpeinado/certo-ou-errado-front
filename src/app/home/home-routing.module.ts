import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home.component";
import { AppRoutes } from '../shared/app-routes.enum';
import { canGoToQuestions } from '../core/guards/auth.guard';
import { homeResolver } from '../core/resolvers/home.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      questions: homeResolver
    }
  },
  {
    path: AppRoutes.QUESTION,
    canMatch: [canGoToQuestions],
    loadChildren: () => import('./question/question.module').then(m => m.QuestionModule)
  },
  {
    path: AppRoutes.RANKING,
    loadChildren: () => import('./ranking/ranking.module').then(m => m.RankingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
