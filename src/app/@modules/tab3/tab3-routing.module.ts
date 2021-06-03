import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";
import { Tab3Page } from "./tab3.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: Tab3Page,
    children: [
      { path: "", redirectTo: "/tabs/tab3/inbox", pathMatch: "full" },
      {
        path: "inbox",
        loadChildren: () => import("@modules/inbox/inbox/inbox.module").then((m) => m.InboxPageModule),
      },
      {
        path: "message",
        loadChildren: () => import("@modules/inbox/message/message.module").then((m) => m.MessagePageModule),
      },
      {
        path: "portfolio-advice",
        loadChildren: () => import("@modules/inbox/portfolio-advice/portfolio-advice.module").then((m) => m.PortfolioAdvicePageModule),
      },
      {
        path: "portfolio-advice-details",
        loadChildren: () => import("@modules/inbox/portfolio-advice-details/portfolio-advice-details.module").then((m) => m.PortfolioAdviceDetailsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
