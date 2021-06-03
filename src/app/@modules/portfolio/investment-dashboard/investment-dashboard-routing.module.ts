import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { InvestmentDashboardPage } from "./investment-dashboard.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: InvestmentDashboardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentDashboardPageRoutingModule {}
