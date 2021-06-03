import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { ProfileDashboardPage } from "./profile-dashboard.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: ProfileDashboardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileDashboardPageRoutingModule {}
