import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsexpiredGuard } from "@shared/guard/isexpired.guard";

import { UploadPortfolioPage } from "./upload-portfolio.page";

const routes: Routes = [
  {
    path: "",
    canActivate: [IsexpiredGuard],
    component: UploadPortfolioPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadPortfolioPageRoutingModule {}
