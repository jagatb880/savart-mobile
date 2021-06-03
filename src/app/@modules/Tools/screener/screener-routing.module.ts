import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { ScreenerPage } from "./screener.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: ScreenerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScreenerPageRoutingModule {}
