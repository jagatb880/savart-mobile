import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { WatchlistdetailPage } from "./watchlistdetail.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: WatchlistdetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchlistdetailPageRoutingModule {}
