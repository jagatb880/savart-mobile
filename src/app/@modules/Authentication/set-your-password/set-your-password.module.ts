import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SetYourPasswordPageRoutingModule } from "./set-your-password-routing.module";

import { SetYourPasswordPage } from "./set-your-password.page";
import { CoreModule } from "@core/core.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SetYourPasswordPageRoutingModule, ReactiveFormsModule, CoreModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [SetYourPasswordPage],
})
export class SetYourPasswordPageModule {}
