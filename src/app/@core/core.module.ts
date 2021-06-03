import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BackgroundComponent } from "@core/components/background/background.component";
import { NkButtonComponent } from "@core/components/nk-button/nk-button.component";

@NgModule({
  declarations: [BackgroundComponent, NkButtonComponent],
  imports: [CommonModule],
  exports: [BackgroundComponent, NkButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CoreModule {}
