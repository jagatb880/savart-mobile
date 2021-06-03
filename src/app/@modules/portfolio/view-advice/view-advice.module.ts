import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ViewAdvicePageRoutingModule } from "./view-advice-routing.module";

import { ViewAdvicePage } from "./view-advice.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ViewAdvicePageRoutingModule],
  declarations: [ViewAdvicePage],
})
export class ViewAdvicePageModule {}
