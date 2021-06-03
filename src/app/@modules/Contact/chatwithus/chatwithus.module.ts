import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChatwithusPageRoutingModule } from "./chatwithus-routing.module";

import { ChatwithusPage } from "./chatwithus.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, ChatwithusPageRoutingModule],
  declarations: [ChatwithusPage],
})
export class ChatwithusPageModule {}
