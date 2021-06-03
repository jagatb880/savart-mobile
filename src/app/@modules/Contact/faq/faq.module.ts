import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FaqPageRoutingModule } from "./faq-routing.module";

import { FaqPage } from "./faq.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, SharedModule, FaqPageRoutingModule],
  declarations: [FaqPage],
})
export class FaqPageModule {}
