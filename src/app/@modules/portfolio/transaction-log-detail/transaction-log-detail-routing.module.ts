import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { TransactionLogDetailPage } from "./transaction-log-detail.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: TransactionLogDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionLogDetailPageRoutingModule {}
