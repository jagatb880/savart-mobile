import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ScreenerPageRoutingModule } from "./screener-routing.module";

import { ScreenerPage } from "./screener.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, ScreenerPageRoutingModule],
  declarations: [ScreenerPage],
})
export class ScreenerPageModule {}
