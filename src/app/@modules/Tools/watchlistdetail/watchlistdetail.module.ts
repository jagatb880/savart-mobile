import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { WatchlistdetailPageRoutingModule } from "./watchlistdetail-routing.module";

import { WatchlistdetailPage } from "./watchlistdetail.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    WatchlistdetailPageRoutingModule,
  ],
  declarations: [WatchlistdetailPage],
})
export class WatchlistdetailPageModule {}
