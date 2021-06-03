import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PortfolioAdvicePageRoutingModule } from './portfolio-advice-routing.module';

import { PortfolioAdvicePage } from './portfolio-advice.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PortfolioAdvicePageRoutingModule
  ],
  declarations: [PortfolioAdvicePage]
})
export class PortfolioAdvicePageModule {}
