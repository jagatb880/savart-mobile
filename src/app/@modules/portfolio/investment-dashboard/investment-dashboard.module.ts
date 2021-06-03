import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestmentDashboardPageRoutingModule } from './investment-dashboard-routing.module';

import { InvestmentDashboardPage } from './investment-dashboard.page';
import { SharedModule } from "@shared/shared.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    InvestmentDashboardPageRoutingModule
  ],
  declarations: [InvestmentDashboardPage]
})
export class InvestmentDashboardPageModule {}
