import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SelectGoalPageRoutingModule } from "./select-goal-routing.module";

import { SelectGoalPage } from "./select-goal.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, SelectGoalPageRoutingModule],
  declarations: [SelectGoalPage],
})
export class SelectGoalPageModule {}
