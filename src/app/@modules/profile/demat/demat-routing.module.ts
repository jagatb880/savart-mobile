import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { DematPage } from "./demat.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: DematPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DematPageRoutingModule {}
