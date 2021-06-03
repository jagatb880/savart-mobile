import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SetAGoalPageRoutingModule } from "./set-a-goal-routing.module";

import { SetAGoalPage } from "./set-a-goal.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, SetAGoalPageRoutingModule],
  declarations: [SetAGoalPage],
})
export class SetAGoalPageModule {}
