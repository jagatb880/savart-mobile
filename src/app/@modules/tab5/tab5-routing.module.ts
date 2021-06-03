import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { Tab5Page } from "./tab5.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: Tab5Page,
    children: [
      { path: "", redirectTo: "/tabs/tab5/tools-dashboard", pathMatch: "full" },
      {
        path: "tools-dashboard",
        loadChildren: () =>
          import("@modules/Tools/tools-dashboard/tools-dashboard.module").then((m) => m.ToolsDashboardPageModule),
      },
      {
        path: "sip",
        loadChildren: () => import("@modules/Tools/sip/sip.module").then((m) => m.SipPageModule),
      },
      {
        path: "lumpsum",
        loadChildren: () => import("@modules/Tools/lumpsum/lumpsum.module").then((m) => m.LumpsumPageModule),
      },
      {
        path: "watchlist",
        loadChildren: () => import("@modules/Tools/watchlist/watchlist.module").then((m) => m.WatchlistPageModule),
      },
      {
        path: "screener",
        loadChildren: () => import("@modules/Tools/screener/screener.module").then((m) => m.ScreenerPageModule),
      },
      {
        path: "watchlistdetail",
        loadChildren: () =>
          import("@modules/Tools/watchlistdetail/watchlistdetail.module").then((m) => m.WatchlistdetailPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab5PageRoutingModule {}
