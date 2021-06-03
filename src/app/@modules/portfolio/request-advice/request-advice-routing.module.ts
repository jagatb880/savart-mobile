import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { RequestAdvicePage } from "./request-advice.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: RequestAdvicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestAdvicePageRoutingModule {}
