import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortfolioAdvicePage } from './portfolio-advice.page';

const routes: Routes = [
  {
    path: '',
    component: PortfolioAdvicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioAdvicePageRoutingModule {}
