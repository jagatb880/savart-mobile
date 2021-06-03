import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TransactionLogDetailPageRoutingModule } from "./transaction-log-detail-routing.module";

import { TransactionLogDetailPage } from "./transaction-log-detail.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    TransactionLogDetailPageRoutingModule,
  ],
  declarations: [TransactionLogDetailPage],
})
export class TransactionLogDetailPageModule {}
