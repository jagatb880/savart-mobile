import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { WatchlistPage } from "./watchlist.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: WatchlistPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchlistPageRoutingModule {}
