import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PortfolioDashboardPageRoutingModule } from "./portfolio-dashboard-routing.module";

import { PortfolioDashboardPage } from "./portfolio-dashboard.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    PortfolioDashboardPageRoutingModule,
  ],
  declarations: [PortfolioDashboardPage],
})
export class PortfolioDashboardPageModule {}
