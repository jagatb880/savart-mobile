import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { SelectGoalPage } from "./select-goal.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: SelectGoalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectGoalPageRoutingModule {}
