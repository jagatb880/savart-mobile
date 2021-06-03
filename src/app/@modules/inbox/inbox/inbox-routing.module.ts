import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { InboxPage } from "./inbox.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: InboxPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxPageRoutingModule {}
