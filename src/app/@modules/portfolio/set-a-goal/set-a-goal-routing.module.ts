import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { SetAGoalPage } from "./set-a-goal.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: SetAGoalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetAGoalPageRoutingModule {}
