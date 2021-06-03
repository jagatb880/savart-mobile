import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { EmailusPage } from "./emailus.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: EmailusPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailusPageRoutingModule {}
