import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { WelcomeLoginPageRoutingModule } from './welcome-login-routing.module';

import { WelcomeLoginPage } from './welcome-login.page';
import { CoreModule } from "@core/core.module";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, WelcomeLoginPageRoutingModule, CoreModule],
  declarations: [WelcomeLoginPage],
  exports: [WelcomeLoginPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WelcomeLoginPageModule {}
