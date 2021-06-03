import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { ProfileServicePage } from "./profile-service.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: ProfileServicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileServicePageRoutingModule {}
