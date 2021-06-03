import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { InvestmentProfilePageRoutingModule } from "./investment-profile-routing.module";

import { InvestmentProfilePage } from "./investment-profile.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    InvestmentProfilePageRoutingModule,
  ],
  declarations: [InvestmentProfilePage],
})
export class InvestmentProfilePageModule {}
