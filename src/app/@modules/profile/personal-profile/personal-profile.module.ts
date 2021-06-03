import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PersonalProfilePageRoutingModule } from "./personal-profile-routing.module";

import { PersonalProfilePage } from "./personal-profile.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    PersonalProfilePageRoutingModule,
  ],
  declarations: [PersonalProfilePage],
})
export class PersonalProfilePageModule {}
