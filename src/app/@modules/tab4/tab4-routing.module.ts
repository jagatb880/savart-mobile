import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { Tab4Page } from "./tab4.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: Tab4Page,
    children: [
      { path: "", redirectTo: "/tabs/tab4/contact-dashboard", pathMatch: "full" },
      {
        path: "contact-dashboard",
        loadChildren: () =>
          import("@modules/Contact/contact-dashboard/contact-dashboard.module").then(
            (m) => m.ContactDashboardPageModule
          ),
      },
      {
        path: "chatwithus",
        loadChildren: () => import("@modules/Contact/chatwithus/chatwithus.module").then((m) => m.ChatwithusPageModule),
      },
      {
        path: "faq",
        loadChildren: () => import("@modules/Contact/faq/faq.module").then((m) => m.FaqPageModule),
      },
      {
        path: "emailus",
        loadChildren: () => import("@modules/Contact/emailus/emailus.module").then((m) => m.EmailusPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4PageRoutingModule {}
