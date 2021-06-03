import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { LumpsumPage } from "./lumpsum.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: LumpsumPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LumpsumPageRoutingModule {}
