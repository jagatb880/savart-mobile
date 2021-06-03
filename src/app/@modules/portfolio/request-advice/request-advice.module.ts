import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RequestAdvicePageRoutingModule } from "./request-advice-routing.module";

import { RequestAdvicePage } from "./request-advice.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, RequestAdvicePageRoutingModule],
  declarations: [RequestAdvicePage],
})
export class RequestAdvicePageModule {}
