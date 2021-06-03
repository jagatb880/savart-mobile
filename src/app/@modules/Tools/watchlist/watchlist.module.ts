import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { WatchlistPageRoutingModule } from "./watchlist-routing.module";

import { WatchlistPage } from "./watchlist.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ReactiveFormsModule, WatchlistPageRoutingModule],
  declarations: [WatchlistPage],
})
export class WatchlistPageModule {}
