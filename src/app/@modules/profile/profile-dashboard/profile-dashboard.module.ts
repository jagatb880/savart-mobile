import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProfileDashboardPageRoutingModule } from "./profile-dashboard-routing.module";

import { ProfileDashboardPage } from "./profile-dashboard.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ProfileDashboardPageRoutingModule],
  declarations: [ProfileDashboardPage],
})
export class ProfileDashboardPageModule {}
