import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MessagePageRoutingModule } from "./message-routing.module";

import { MessagePage } from "./message.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, SharedModule, MessagePageRoutingModule],
  declarations: [MessagePage],
})
export class MessagePageModule {}
