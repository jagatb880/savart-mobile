import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { UploadContractPage } from "./upload-contract.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: UploadContractPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadContractPageRoutingModule {}
