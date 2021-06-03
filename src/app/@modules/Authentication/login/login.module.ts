import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";
import { CoreModule } from "@core/core.module";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, LoginPageRoutingModule, CoreModule],
  declarations: [LoginPage],
  exports: [LoginPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPageModule {}
