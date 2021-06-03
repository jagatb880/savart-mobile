import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ViewPortfolioPageRoutingModule } from "./view-portfolio-routing.module";

import { ViewPortfolioPage } from "./view-portfolio.page";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, ViewPortfolioPageRoutingModule],
  declarations: [ViewPortfolioPage],
})
export class ViewPortfolioPageModule {}
