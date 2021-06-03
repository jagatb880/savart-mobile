import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { InvestmentProfilePage } from "./investment-profile.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: InvestmentProfilePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestmentProfilePageRoutingModule {}
