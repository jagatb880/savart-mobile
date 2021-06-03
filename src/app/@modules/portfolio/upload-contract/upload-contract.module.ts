import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UploadContractPageRoutingModule } from "./upload-contract-routing.module";

import { UploadContractPage } from "./upload-contract.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, UploadContractPageRoutingModule],
  declarations: [UploadContractPage],
})
export class UploadContractPageModule {}
