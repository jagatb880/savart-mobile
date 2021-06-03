import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TransactionLogPageRoutingModule } from "./transaction-log-routing.module";

import { TransactionLogPage } from "./transaction-log.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, TransactionLogPageRoutingModule],
  declarations: [TransactionLogPage],
})
export class TransactionLogPageModule {}
