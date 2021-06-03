import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { ToolsDashboardPage } from "./tools-dashboard.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: ToolsDashboardPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsDashboardPageRoutingModule {}
