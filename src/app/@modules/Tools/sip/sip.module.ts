import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SipPageRoutingModule } from "./sip-routing.module";

import { SipPage } from "./sip.page";
import { SharedModule } from "@shared/shared.module";
import { ChartsModule } from "ng2-charts";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    SipPageRoutingModule,
  ],
  declarations: [SipPage],
})
export class SipPageModule {}
