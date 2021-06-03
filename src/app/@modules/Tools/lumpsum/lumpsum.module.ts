import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LumpsumPageRoutingModule } from "./lumpsum-routing.module";

import { LumpsumPage } from "./lumpsum.page";
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
    LumpsumPageRoutingModule,
  ],
  declarations: [LumpsumPage],
})
export class LumpsumPageModule {}
