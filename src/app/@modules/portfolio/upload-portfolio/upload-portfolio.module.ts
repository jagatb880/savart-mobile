import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UploadPortfolioPageRoutingModule } from "./upload-portfolio-routing.module";

import { UploadPortfolioPage } from "./upload-portfolio.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    UploadPortfolioPageRoutingModule,
  ],
  declarations: [UploadPortfolioPage],
})
export class UploadPortfolioPageModule {}
