import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FullDashboardPageRoutingModule } from "./full-dashboard-routing.module";

import { FullDashboardPage } from "./full-dashboard.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, SharedModule, FullDashboardPageRoutingModule],
  declarations: [FullDashboardPage],
})
export class FullDashboardPageModule {}
