import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfileServicePageRoutingModule } from "./profile-service-routing.module";

import { ProfileServicePage } from "./profile-service.page";
import { SharedModule } from "@shared/shared.module";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule,  SharedModule, ReactiveFormsModule, ProfileServicePageRoutingModule],
  declarations: [ProfileServicePage],
  providers:[InAppBrowser]
})
export class ProfileServicePageModule {}
