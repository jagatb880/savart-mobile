import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { ContactDashboardPage } from "./contact-dashboard.page";

const routes: Routes = [
  {
    path: "",
    component: ContactDashboardPage,
    canActivate: [IsexpiredGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactDashboardPageRoutingModule {}
