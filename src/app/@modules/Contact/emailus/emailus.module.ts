import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EmailusPageRoutingModule } from "./emailus-routing.module";

import { EmailusPage } from "./emailus.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, EmailusPageRoutingModule],
  declarations: [EmailusPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmailusPageModule {}
