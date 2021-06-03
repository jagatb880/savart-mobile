import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { PersonalProfilePage } from "./personal-profile.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: PersonalProfilePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalProfilePageRoutingModule {}
