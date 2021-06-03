import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { TransactionLogPage } from "./transaction-log.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: TransactionLogPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionLogPageRoutingModule {}
