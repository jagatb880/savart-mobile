import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ToolsDashboardPageRoutingModule } from './tools-dashboard-routing.module';

import { ToolsDashboardPage } from './tools-dashboard.page';
import { SharedModule } from "@shared/shared.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ToolsDashboardPageRoutingModule
  ],
  declarations: [ToolsDashboardPage]
})
export class ToolsDashboardPageModule {}
