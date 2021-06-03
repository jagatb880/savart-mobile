import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PortfolioAdviceDetailsPageRoutingModule } from './portfolio-advice-details-routing.module';

import { PortfolioAdviceDetailsPage } from './portfolio-advice-details.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PortfolioAdviceDetailsPageRoutingModule
  ],
  declarations: [PortfolioAdviceDetailsPage]
})
export class PortfolioAdviceDetailsPageModule {}
