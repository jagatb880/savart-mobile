import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DematPageRoutingModule } from "./demat-routing.module";

import { DematPage } from "./demat.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, DematPageRoutingModule],
  declarations: [DematPage],
})
export class DematPageModule {}
