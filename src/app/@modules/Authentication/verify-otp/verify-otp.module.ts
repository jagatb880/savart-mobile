import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { VerifyOtpPageRoutingModule } from "./verify-otp-routing.module";

import { VerifyOtpPage } from "./verify-otp.page";
import { CoreModule } from "@core/core.module";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, VerifyOtpPageRoutingModule, CoreModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [VerifyOtpPage],
})
export class VerifyOtpPageModule {}
