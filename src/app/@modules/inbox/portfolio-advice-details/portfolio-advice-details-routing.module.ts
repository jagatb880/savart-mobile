import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortfolioAdviceDetailsPage } from './portfolio-advice-details.page';

const routes: Routes = [
  {
    path: '',
    component: PortfolioAdviceDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioAdviceDetailsPageRoutingModule {}
